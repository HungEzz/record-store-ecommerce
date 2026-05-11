import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { ShoppingBag, Plus, Minus, X, Heart, Play } from 'lucide-react';
import type { Product } from '../types';
import type { RootState } from '../store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, size = 'md', showCategory = true }) => {
  const dispatch = useDispatch();
  const productStocks = useSelector((state: RootState) => state.products.stock);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);

  const currentStock = productStocks[product.id] ?? product.stock;
  const inCartQty = cartItems.find(i => i.id === product.id)?.quantity ?? 0;
  const maxAddable = Math.max(0, currentStock - inCartQty);
  const isOutOfStock = currentStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) { toast.error('Out of stock'); return; }
    if (maxAddable <= 0) { toast.error('Already at max quantity in cart'); return; }
    setQty(1);
    setShowModal(true);
  };

  const confirmAdd = () => {
    if (inCartQty + qty > currentStock) { toast.error('Exceeds available stock'); return; }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`Added ${qty > 1 ? `${qty}× ` : ''}${product.title}`, {
      style: { borderRadius: '12px', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontSize: 13 },
    });
    setShowModal(false);
  };

  const categoryColors: Record<string, string> = {
    vinyl: 'var(--warm-purple)',
    cd: 'var(--accent)',
    merch: 'var(--warm-amber)',
  };

  const catColor = categoryColors[product.category || 'vinyl'] || 'var(--accent)';

  return (
    <>
      <div className="card-product" style={{ background: 'var(--bg-card)' }}>
        {/* Image */}
        <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div className="product-img-wrap" style={{ position: 'relative' }}>
            <img src={product.imgUrl} alt={product.title} loading="lazy" />

            {/* Overlay on hover */}
            <div className="play-overlay">
              <div style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-accent)',
              }}>
                <Play size={20} fill="#000" color="#000" style={{ marginLeft: 2 }} />
              </div>
            </div>

            {/* Stock badge */}
            {isOutOfStock && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  background: 'rgba(244,63,94,0.9)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.06em',
                }}>
                  SOLD OUT
                </span>
              </div>
            )}

            {/* Category label */}
            {showCategory && (
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                color: catColor,
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {product.category}
              </div>
            )}

            {/* Wish */}
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setWished(w => !w); }}
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Heart
                size={14}
                color={wished ? '#f43f5e' : '#fff'}
                fill={wished ? '#f43f5e' : 'none'}
              />
            </button>
          </div>
        </Link>

        {/* Info */}
        <div style={{ padding: size === 'sm' ? '12px 14px 14px' : '16px 18px 18px' }}>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: size === 'sm' ? 13 : 15,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              marginBottom: 4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
            >
              {product.title}
            </h3>
          </Link>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.artist}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: size === 'sm' ? 15 : 17,
              color: 'var(--text-primary)',
            }}>
              ${product.price.toFixed(2)}
            </span>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: isOutOfStock ? 'var(--bg-secondary)' : 'var(--accent)',
                color: isOutOfStock ? 'var(--text-muted)' : '#000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-dim)';
              }}
              onMouseLeave={e => {
                if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
              }}
            >
              <ShoppingBag size={13} />
              {isOutOfStock ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 28,
              maxWidth: 360,
              width: '100%',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <img
                src={product.imgUrl}
                alt={product.title}
                style={{ width: 68, height: 68, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>{product.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{product.artist}</p>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>${product.price.toFixed(2)}</span>
              </div>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}
                  style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: qty <= 1 ? 0.3 : 1 }}>
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 16px', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', minWidth: 32, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(maxAddable, q + 1))} disabled={qty >= maxAddable}
                  style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: qty >= maxAddable ? 0.3 : 1 }}>
                  <Plus size={14} />
                </button>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {currentStock} in stock · {inCartQty} in cart
              </span>
            </div>

            <button
              onClick={confirmAdd}
              style={{
                width: '100%',
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-accent)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-dim)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              Add to Cart — ${(product.price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;