import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import FeaturedProducts from '../components/FeaturedProducts';
import { Minus, Plus } from 'lucide-react';

import type { RootState } from '../store';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const allProducts = useSelector((state: RootState) => state.products.items);
  
  const currentProduct = useMemo(() => {
    if (allProducts.length === 0) return null;
    return allProducts.find(p => p.id === Number(id)) || allProducts[0];
  }, [id, allProducts]);

  // Get tổng stock từ Redux store (dữ liệu thực từ DB)
  const totalStock = useSelector((state: RootState) => currentProduct ? (state.products.stock[currentProduct.id] ?? currentProduct.stock) : 0);

  // Lấy số lượng sản phẩm này đã có trong giỏ hàng
  const cartItem = useSelector((state: RootState) => state.cart.items.find(item => item.id === currentProduct?.id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Tính toán số lượng còn lại có thể thêm vào giỏ
  const availableStock = totalStock - quantityInCart;

  const relatedProducts = useMemo(() => {
    if (!currentProduct) return [];
    return allProducts.filter(p => p.id !== currentProduct.id).slice(0, 4);
  }, [currentProduct, allProducts]);

  if (!currentProduct) {
    return <div className="py-40 text-center uppercase tracking-widest text-gray-500 text-sm">Loading...</div>;
  }

  const handleAddToCart = () => {
    if (availableStock <= 0 || selectedQuantity > availableStock) {
      toast.error(`Bạn đã có ${quantityInCart} sản phẩm trong giỏ hàng. Không thể thêm vào giỏ vì sẽ vượt quá giới hạn mua hàng.`, {
        style: {
          borderRadius: '0px',
          background: '#dc2626',
          color: '#fff',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }
      });
      return;
    }

    dispatch(addToCart({ ...currentProduct, addQuantity: selectedQuantity }));
    setIsAdded(true);
    setSelectedQuantity(1); // Reset lại 1 sau khi thêm thành công
    
    toast.success('Đã thêm vào giỏ hàng', {
      style: {
        borderRadius: '0px',
        background: '#000',
        color: '#fff',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 w-full">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          <div className="w-full md:w-1/2 bg-rs-gray-light border border-rs-border overflow-hidden relative">
            <img 
              src={currentProduct.imgUrl} 
              alt={currentProduct.title} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
            {totalStock <= 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <p className="text-white text-2xl font-bold uppercase tracking-widest">Hết hàng</p>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-start pt-4 md:pt-8">
            <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-8 font-sans">
              <Link to="/" className="hover:text-black transition-colors">Home</Link> 
              <span className="mx-2">/</span> 
              <Link to={`/${currentProduct.category}`} className="hover:text-black transition-colors uppercase">{currentProduct.category}</Link>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide font-display text-rs-black mb-2 leading-[1.1]">
              {currentProduct.title}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-400 font-sans mb-8 italic">
              {currentProduct.artist}
            </h2>
            
            <div className="text-2xl font-bold font-sans text-rs-black mb-4 pb-6 border-b border-rs-border flex justify-between items-center">
              <span>${currentProduct.price.toFixed(2)}</span>
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${
                totalStock <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {totalStock <= 0 ? 'Hết hàng' : `Kho: ${totalStock}`}
              </span>
            </div>

            <div className="mb-10">
              <p className="text-sm text-gray-600 font-sans leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Số lượng</span>
                <div className="flex items-center border border-rs-border w-fit">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-30"
                    disabled={selectedQuantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-semibold font-sans">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(Math.min(availableStock, selectedQuantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-30"
                    disabled={selectedQuantity >= availableStock || availableStock === 0}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              
              {selectedQuantity >= availableStock && availableStock > 0 && (
                <p className="text-red-500 text-[10px] uppercase tracking-wider font-bold">
                  Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
                </p>
              )}
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isAdded || availableStock <= 0}
              className={`w-full py-5 uppercase tracking-[0.3em] text-[11px] font-bold transition-all duration-500 ${
                availableStock <= 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : isAdded 
                  ? 'bg-green-600 text-white cursor-default' 
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {totalStock <= 0 ? 'Hết hàng' : availableStock <= 0 ? 'Đã thêm tối đa' : isAdded ? 'Đã thêm thành công' : 'Thêm vào giỏ hàng'}
            </button>

            <div className="mt-12 pt-8 border-t border-rs-border">
              <div className="grid grid-cols-2 gap-8 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <div>
                  <p className="mb-2 text-black">Vận chuyển</p>
                  <p className="font-medium leading-relaxed">Giao hàng miễn phí cho đơn hàng trên $100.</p>
                </div>
                <div>
                  <p className="mb-2 text-black">Đổi trả</p>
                  <p className="font-medium leading-relaxed">Hoàn trả trong vòng 30 ngày nếu còn nguyên seal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-rs-border mt-10">
        <FeaturedProducts products={relatedProducts} title="Có thể bạn cũng thích" />
      </div>
    </div>
  );
};

export default ProductDetail;