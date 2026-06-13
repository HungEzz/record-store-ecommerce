import nodemailer from 'nodemailer';
import dns from 'dns';
import { env } from './env';

// Cache the transporter and resolved IP to avoid DNS queries on every send
let cachedTransporter: nodemailer.Transporter | null = null;
let lastResolvedIp: string | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  try {
    // Force resolving smtp.gmail.com via IPv4 exclusively
    const ips = await dns.promises.resolve4('smtp.gmail.com');
    if (ips && ips.length > 0) {
      const ip = ips[0];
      
      if (cachedTransporter && lastResolvedIp === ip) {
        return cachedTransporter;
      }
      
      lastResolvedIp = ip;
      cachedTransporter = nodemailer.createTransport({
        host: ip,
        port: 587,
        secure: false, // Use STARTTLS on port 587
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
          servername: 'smtp.gmail.com', // Crucial for matching TLS certificate of Gmail SMTP
        },
      });
      return cachedTransporter;
    }
  } catch (error) {
    console.error('Failed to resolve smtp.gmail.com via IPv4, falling back to hostname resolution:', error);
  }

  // Fallback if DNS resolution fails
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return cachedTransporter;
}

/**
 * Send OTP verification email with a styled HTML template.
 * The OTP code is displayed prominently in the email body.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1db954 0%,#148a3c 100%);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#000;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        🎵 Classic Records
      </h1>
      <p style="margin:8px 0 0;color:rgba(0,0,0,0.7);font-size:13px;">
        Xác thực tài khoản
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="color:#e0e0e0;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Xin chào! Bạn vừa đăng ký tài khoản tại <strong style="color:#1db954;">Classic Records</strong>.
        Vui lòng sử dụng mã OTP bên dưới để xác thực email của bạn:
      </p>

      <!-- OTP Code -->
      <div style="background:#1a1a1a;border:2px dashed #1db954;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">
          Mã xác thực
        </p>
        <p style="margin:0;color:#1db954;font-size:36px;font-weight:800;letter-spacing:8px;font-family:'Courier New',monospace;">
          ${otp}
        </p>
      </div>

      <p style="color:#888;font-size:12px;line-height:1.5;margin:20px 0 0;">
        ⏱ Mã có hiệu lực trong <strong style="color:#e0e0e0;">5 phút</strong>.<br>
        🔒 Không chia sẻ mã này với bất kỳ ai.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 28px;border-top:1px solid #222;text-align:center;">
      <p style="margin:0;color:#555;font-size:11px;">
        Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: `"Classic Records" <${env.SMTP_USER}>`,
      to,
      subject: `[Classic Records] Mã xác thực OTP: ${otp}`,
      html,
    });
  } catch (error: any) {
    console.error('Failed to send OTP email via SMTP:', error.message || error);
    console.log(`
========================================================================
[MAIL FALLBACK] PHÁT HIỆN LỖI GỬI EMAIL (Có thể do Render chặn cổng SMTP)
- Email người nhận: ${to}
- Mã OTP của bạn: ${otp}
Hãy sử dụng mã OTP này để hoàn tất xác thực trên giao diện web.
========================================================================
    `);
  }
}

/**
 * Send OTP email for password reset with a styled HTML template.
 */
export async function sendPasswordResetOtpEmail(to: string, otp: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#141414;border-radius:16px;border:1px solid #222;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#e74c3c 0%,#c0392b 100%);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
        🔑 Classic Records
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
        Đặt lại mật khẩu
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="color:#e0e0e0;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản tại <strong style="color:#e74c3c;">Classic Records</strong>.
        Vui lòng sử dụng mã OTP bên dưới để xác nhận:
      </p>

      <!-- OTP Code -->
      <div style="background:#1a1a1a;border:2px dashed #e74c3c;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <p style="margin:0 0 8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">
          Mã xác nhận
        </p>
        <p style="margin:0;color:#e74c3c;font-size:36px;font-weight:800;letter-spacing:8px;font-family:'Courier New',monospace;">
          ${otp}
        </p>
      </div>

      <p style="color:#888;font-size:12px;line-height:1.5;margin:20px 0 0;">
        ⏱ Mã có hiệu lực trong <strong style="color:#e0e0e0;">5 phút</strong>.<br>
        🔒 Không chia sẻ mã này với bất kỳ ai.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 28px;border-top:1px solid #222;text-align:center;">
      <p style="margin:0;color:#555;font-size:11px;">
        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: `"Classic Records" <${env.SMTP_USER}>`,
      to,
      subject: `[Classic Records] Mã đặt lại mật khẩu`,
      html,
    });
  } catch (error: any) {
    console.error('Failed to send password reset email via SMTP:', error.message || error);
    console.log(`
========================================================================
[MAIL FALLBACK] PHÁT HIỆN LỖI GỬI EMAIL (Có thể do Render chặn cổng SMTP)
- Email người nhận: ${to}
- Mã OTP đặt lại mật khẩu: ${otp}
Hãy sử dụng mã OTP này để hoàn tất đặt lại mật khẩu.
========================================================================
    `);
  }
}
