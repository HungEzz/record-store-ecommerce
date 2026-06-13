import { env } from '../../config/env';
import { productRepository } from '../products/product.repository';
import { executeTool, getToolsForRole, UserContext } from './chat.tools';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

const MAX_TOOL_HOPS = 5;

const buildSystemPrompt = (ctx: UserContext, cartItems: any[], path: string): string => {
  const roleLabel =
    ctx.role === 'ADMIN'
      ? 'ADMIN (toàn quyền: xem mọi đơn, sửa/xóa đơn, xem thống kê)'
      : ctx.role === 'USER'
        ? 'KHÁCH ĐÃ ĐĂNG NHẬP (chỉ xem đơn của mình)'
        : 'KHÁCH (chưa đăng nhập)';

  const cartSummary =
    Array.isArray(cartItems) && cartItems.length > 0
      ? `Giỏ hàng hiện tại có ${cartItems.length} sản phẩm: ${cartItems
        .map((c: any) => `${c.title} x${c.quantity}`)
        .join(', ')}.`
      : 'Giỏ hàng đang trống.';

  return `Bạn là trợ lý AI của cửa hàng Classic Records (bán Vinyl, CD, Merch).
Trả lời bằng tiếng Việt, ngắn gọn, thân thiện. Có thể dùng HTML cơ bản (<br/>, <strong>, <a>) để format.

QUYỀN HẠN HIỆN TẠI CỦA USER: ${roleLabel}.
Đường dẫn user đang xem: ${path || 'không rõ'}.
${cartSummary}

NGUYÊN TẮC QUAN TRỌNG:
1. Khi user hỏi về sản phẩm/đơn hàng/thống kê → BẮT BUỘC gọi tool tương ứng để lấy dữ liệu thật, KHÔNG được bịa.
2. Bạn CÓ KHẢ NĂNG thêm sản phẩm vào giỏ hàng thật của user qua tool 'add_to_cart'. KHÔNG BAO GIỜ bảo user "tự bấm link để thêm" — bạn làm được trực tiếp.
   - Khi user nói "mua", "thêm vào giỏ", "đặt", "lấy đi"… → tìm sản phẩm bằng search_products, sau đó hỏi xác nhận một câu duy nhất: "Bạn xác nhận thêm <tên> vào giỏ chứ?".
   - Khi user đáp đồng ý dù bằng bất kỳ cách nào ("ok", "có", "thêm đi", "yes", "đồng ý", "đúng rồi", "thêm vào giỏ giúp tôi", "ok thêm giúp")  → GỌI NGAY add_to_cart với confirmed=true. Không hỏi lại lần 2.
3. Với hành động ghi/xóa (update_order_status, delete_order):
   - PHẢI hỏi xác nhận rõ ràng trước.
   - Chỉ truyền confirmed=true khi user đã đồng ý ("xóa", "đồng ý", "ok xóa", "có", "yes"…).
   - Nếu user chưa xác nhận, trả lời bằng câu hỏi xác nhận thay vì gọi tool.
4. Nếu user (không phải admin) đòi thao tác admin → lịch sự từ chối, gợi ý liên hệ admin.
5. Khi liệt kê sản phẩm/đơn hàng, format gọn: tên, giá, trạng thái. Không cần lặp lại ID dài nếu không cần.`;
};

const callDeepseek = async (
  messages: ChatMessage[],
  tools: any[],
): Promise<any> => {
  if (!env.DEEPSEEK_API_KEY) throw new Error('Missing DEEPSEEK_API_KEY');

  const response = await fetch(env.DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL,
      messages,
      tools: tools.length ? tools : undefined,
      tool_choice: tools.length ? 'auto' : undefined,
      temperature: 0.5,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek Error ${response.status}: ${body}`);
  }

  return response.json();
};

const callGemini = async (
  systemPrompt: string,
  history: any[],
  message: string,
): Promise<string> => {
  if (!env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');

  const contents = [];
  for (const h of history) {
    contents.push({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content || '' }],
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini Error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Invalid response from Gemini');
  }
  return text;
};

const simpleFallback = async (message: string): Promise<string> => {
  const lower = message.toLowerCase();
  let category = '';
  if (lower.includes('vinyl') || lower.includes('đĩa than') || lower.includes('than')) {
    category = 'VINYL';
  } else if (lower.includes('cd') || lower.includes('đĩa cd')) {
    category = 'CD';
  } else if (lower.includes('merch') || lower.includes('phụ kiện')) {
    category = 'MERCH';
  }

  try {
    const products = await productRepository.findMany();
    let hits = [];
    
    if (category) {
      hits = products.filter((p: any) => p.category === category);
    } else {
      const words = lower.split(/\s+/).filter((w) => w.length >= 3);
      hits = products.filter((p: any) => {
        const text = `${p.title} ${p.artist} ${p.category}`.toLowerCase();
        return words.some((word) => text.includes(word));
      });
    }

    if (hits.length > 0) {
      const list = hits
        .slice(0, 5)
        .map((p: any) => `• <strong>${p.title}</strong> — ${p.artist} — $${p.price}`)
        .join('<br/>');
      return `Hiện tại kết nối AI đang gián đoạn, dưới đây là một số sản phẩm phù hợp tìm thấy trong hệ thống:<br/>${list}`;
    }
  } catch (err) {
    console.error('Fallback search failed:', err);
  }
  return 'Xin lỗi bạn, hiện tại hệ thống AI đang bận hoặc chưa được cấu hình khóa API (DEEPSEEK_API_KEY / GEMINI_API_KEY). Bạn vui lòng thử lại sau hoặc liên hệ Hotline 1800-CLASSIC để được hỗ trợ nhanh nhất nhé!';
};

export interface ChatActionPayload {
  type: 'add_to_cart';
  product: any;
  quantity: number;
}

export interface ChatResult {
  response: string;
  actions: ChatActionPayload[];
}

export const chatService = {
  generateResponse: async (
    message: string,
    history: any[],
    context: any = {},
    userCtx: UserContext = { userId: null, role: 'GUEST' },
  ): Promise<ChatResult> => {
    const cartItems = Array.isArray(context?.cart) ? context.cart : [];
    const path = context?.path || '';
    const systemPrompt = buildSystemPrompt(userCtx, cartItems, path);

    // 1. Try DeepSeek if configured
    if (env.DEEPSEEK_API_KEY) {
      const tools = getToolsForRole(userCtx.role).map((t) => ({
        type: t.type,
        function: t.function,
      }));

      const systemMsg: ChatMessage = {
        role: 'system',
        content: systemPrompt,
      };

      const recentHistory: ChatMessage[] = (history || [])
        .slice(-8)
        .map((h: any) => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          content: String(h.content || ''),
        }));

      const messages: ChatMessage[] = [
        systemMsg,
        ...recentHistory,
        { role: 'user', content: message },
      ];

      const collectedActions: ChatActionPayload[] = [];

      try {
        for (let hop = 0; hop < MAX_TOOL_HOPS; hop++) {
          const data = await callDeepseek(messages, tools);
          const choice = data?.choices?.[0];
          const aiMessage = choice?.message;
          if (!aiMessage) break;

          const toolCalls = aiMessage.tool_calls;

          if (toolCalls && toolCalls.length > 0) {
            messages.push({
              role: 'assistant',
              content: aiMessage.content ?? null,
              tool_calls: toolCalls,
            });

            for (const call of toolCalls) {
              let args: any = {};
              try {
                args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
              } catch {
                args = {};
              }
              const { result, action } = await executeTool(call.function.name, args, userCtx);
              if (action) collectedActions.push(action as ChatActionPayload);
              messages.push({
                role: 'tool',
                tool_call_id: call.id,
                name: call.function.name,
                content: JSON.stringify(result),
              });
            }
            continue;
          }

          return {
            response:
              (aiMessage.content as string) || 'Mình chưa rõ câu hỏi, bạn nói lại giúp nhé.',
            actions: collectedActions,
          };
        }
        return {
          response:
            'Mình cần nhiều bước hơn để xử lý. Bạn có thể tách câu hỏi thành các phần nhỏ giúp mình không?',
          actions: collectedActions,
        };
      } catch (err: any) {
        console.error('DeepSeek chat failed, trying Gemini backup...', err?.message || err);
      }
    }

    // 2. Try Gemini backup if configured
    if (env.GEMINI_API_KEY) {
      try {
        const responseText = await callGemini(systemPrompt, history || [], message);
        return { response: responseText, actions: [] };
      } catch (err: any) {
        console.error('Gemini chat backup failed:', err?.message || err);
      }
    }

    // 3. Fallback to smart local product matching
    return { response: await simpleFallback(message), actions: [] };
  },
};
