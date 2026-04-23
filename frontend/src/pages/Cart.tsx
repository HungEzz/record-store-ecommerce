
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const productStocks = useSelector((state: RootState) => state.products.stock);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Khởi tạo state cho các sản phẩm được chọn (mặc định chọn các món còn hàng)
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>(() => {
    return cartItems.filter(item => (productStocks[item.id] ?? item.stock) > 0).map(item => item.id);
  });

  const selectedItems = cartItems.filter(item => selectedItemIds.includes(item.id));
  const totalPrice = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const inStockItems = cartItems.filter(item => (productStocks[item.id] ?? item.stock) > 0);
  const allSelected = inStockItems.length > 0 && selectedItemIds.length === inStockItems.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(inStockItems.map(i => i.id));
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Tự động đồng bộ giỏ hàng nhưng KHÔNG xóa món hết hàng
  useEffect(() => {
    cartItems.forEach(item => {
      const currentTotalStock = productStocks[item.id] ?? item.stock;
      
      if (item.quantity > currentTotalStock && currentTotalStock > 0) {
        dispatch(updateQuantity({ id: item.id, quantity: currentTotalStock }));
      }
    });

    // Tự động bỏ chọn các món đã hết hàng
    setSelectedItemIds(prev => prev.filter(id => {
      const currentTotalStock = productStocks[id] ?? cartItems.find(i => i.id === id)?.stock ?? 0;
      return currentTotalStock > 0;
    }));
  }, [cartItems, productStocks, dispatch]);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow min-h-[60vh] px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-display uppercase font-bold text-rs-black mb-6 tracking-wide">
          Giỏ hàng của bạn
        </h1>
        <p className="text-gray-500 mb-10 font-sans">Hiện chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link
          to="/vinyl"
          className="bg-rs-black text-white px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors font-sans"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 w-full flex-grow">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-rs-border">
        <h1 className="text-3xl md:text-4xl font-display uppercase font-bold text-rs-black tracking-wide">
          Giỏ hàng ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
        </h1>
        {cartItems.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer font-sans text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black">
            <input 
              type="checkbox" 
              checked={allSelected} 
              onChange={handleSelectAll} 
              className="w-5 h-5 accent-black cursor-pointer"
              disabled={inStockItems.length === 0}
            />
            Chọn tất cả
          </label>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
        {cartItems.map((item) => {
          const currentTotalStock = productStocks[item.id] ?? item.stock;
          const isOutOfStock = currentTotalStock <= 0;
          return (
            <div key={item.id} className={`flex gap-4 md:gap-6 py-6 border-b border-rs-border group ${isOutOfStock ? 'opacity-60 grayscale-[50%]' : ''}`}>
              <div className="flex items-center pt-2">
                <input 
                  type="checkbox" 
                  checked={selectedItemIds.includes(item.id)} 
                  onChange={() => handleSelectItem(item.id)} 
                  className="w-5 h-5 accent-black cursor-pointer"
                  disabled={isOutOfStock}
                />
              </div>

              <Link to={`/product/${item.id}`} className="w-24 md:w-32 aspect-square bg-rs-gray-light flex-shrink-0 relative">
                <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
              </Link>

              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <Link to={`/product/${item.id}`} className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-lg md:text-xl uppercase font-display text-rs-black hover:opacity-70 transition-opacity leading-tight">
                        {item.title}
                      </h3>
                      {isOutOfStock && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                          Hết hàng
                        </span>
                      )}
                    </Link>
                    <p className="font-bold font-sans text-rs-black text-lg whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 font-sans mt-1">{item.artist}</p>
                  <p className="text-xs text-gray-400 font-sans mt-2 uppercase tracking-wider">
                    Format: {item.category || 'vinyl'}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center border border-rs-border w-fit">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30"
                      disabled={item.quantity <= 1 || isOutOfStock}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-semibold font-sans">{item.quantity}</span>
                    <button
                      onClick={() => {
                        if (item.quantity >= currentTotalStock) {
                          toast.error(`Bạn đã có ${item.quantity} sản phẩm trong giỏ hàng. Không thể thêm vào giỏ vì sẽ vượt quá giới hạn mua hàng.`, {
                            style: {
                              borderRadius: '0px',
                              background: '#dc2626',
                              color: '#fff',
                              fontSize: '10px',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase'
                            }
                          });
                        } else {
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
                        }
                      }}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30"
                      disabled={isOutOfStock}
                    >
                      <Plus size={14} />
                    </button>
                </div>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-400 hover:text-rs-black transition-colors flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest"
                  >
                    <Trash2 size={16} strokeWidth={1.5} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-rs-gray-light p-8 sticky top-28">
            <h2 className="text-xl font-bold uppercase font-display text-rs-black mb-6 pb-4 border-b border-gray-200 tracking-wide">
              Tổng đơn hàng
            </h2>

            <div className="flex justify-between text-gray-600 font-sans mb-4 text-sm">
              <span>Tạm tính</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-sans mb-6 pb-6 border-b border-gray-200 text-sm">
              <span>Giao hàng</span>
              <span className="uppercase text-xs tracking-wider font-semibold text-rs-black">Miễn phí</span>
            </div>

            <div className="flex justify-between font-bold text-xl font-sans text-rs-black mb-8">
              <span>Tổng cộng</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { selectedItems } })}
              disabled={selectedItems.length === 0}
              className="w-full bg-rs-black text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-zinc-800 transition-colors font-sans flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thanh toán an toàn <ArrowRight size={14} />
            </button>

            <Link
              to="/vinyl"
              className="block text-center mt-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;