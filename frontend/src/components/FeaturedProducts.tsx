import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus, Minus, X } from 'lucide-react';
import type { Product } from '../types';
import type { RootState } from '../store';
import toast from 'react-hot-toast';

interface FeaturedProductsProps {
  products: Product[];
  title: string;
}


const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, title }) => {
  const dispatch = useDispatch();
  const productStocks = useSelector((state: RootState) => state.products.stock);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleOpenQuickAdd = (product: Product) => {
    setQuickAddProduct(product);
    setSelectedQuantity(1);
  };

  const handleCloseQuickAdd = () => {
    setQuickAddProduct(null);
  };

  // Tính toán tồn kho thực tế cho sản phẩm đang mở trong Modal
  const totalStock = quickAddProduct ? (productStocks[quickAddProduct.id] ?? quickAddProduct.stock) : 0;
  const cartItem = quickAddProduct ? cartItems.find(item => item.id === quickAddProduct.id) : undefined;
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const availableStock = totalStock - quantityInCart;

  const handleAddToCart = () => {
    if (!quickAddProduct) return;

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

    dispatch(addToCart({ ...quickAddProduct, addQuantity: selectedQuantity }));
    toast.success(`Đã thêm ${quickAddProduct.title} vào giỏ hàng`, {
      style: {
        borderRadius: '0px',
        background: '#000',
        color: '#fff',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }
    });
    handleCloseQuickAdd();
  };

  return (
    <>
    <section className="px-6 py-20 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-xl font-bold uppercase tracking-[0.2em] font-display">{title}</h2>
        <Link to="/vinyl" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
          Xem tất cả
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product) => {
          const currentStock = productStocks[product.id] ?? product.stock;
          return (
            <div key={product.id} className="group flex flex-col">
              <div className="aspect-square bg-rs-gray-light mb-6 overflow-hidden relative">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.imgUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </Link>
                
                {currentStock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-sm font-bold uppercase tracking-widest">Hết hàng</span>
                  </div>
                )}
                
                <button 
                  onClick={() => handleOpenQuickAdd(product)}
                  disabled={currentStock <= 0}
                  className={`absolute bottom-0 left-0 right-0 py-4 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ease-in-out ${
                    currentStock <= 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed translate-y-0'
                      : 'bg-black text-white translate-y-full group-hover:translate-y-0 hover:bg-zinc-800'
                  }`}
                >
                  <Plus size={14} /> {currentStock <= 0 ? 'Hết hàng' : 'Quick Add'}
                </button>
              </div>
              
              <div className="space-y-1">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider leading-tight line-clamp-1 hover:opacity-60 transition-opacity">{product.title}</h3>
                </Link>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product.artist}</p>
                <p className="text-[11px] font-medium pt-2">${product.price.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>

    {/* Quick Add Modal */}
    {quickAddProduct && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white w-full max-w-3xl flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in duration-300">
          <button 
            onClick={handleCloseQuickAdd}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-full md:w-1/2 aspect-square bg-rs-gray-light">
            <img 
              src={quickAddProduct.imgUrl} 
              alt={quickAddProduct.title}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{quickAddProduct.artist}</p>
            <h3 className="text-2xl font-display font-bold uppercase tracking-wider mb-4 leading-tight">
              {quickAddProduct.title}
            </h3>
            <p className="text-xl font-sans font-bold mb-6">${quickAddProduct.price.toFixed(2)}</p>
            
            <div className="flex flex-col gap-4 mb-8">
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
              disabled={availableStock <= 0}
              className={`w-full py-5 uppercase tracking-[0.3em] text-[11px] font-bold transition-all duration-300 ${
                availableStock <= 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {availableStock <= 0 ? 'Đã thêm tối đa' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default FeaturedProducts;