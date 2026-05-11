import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  columns?: 2 | 3 | 4 | 5;
  cardSize?: 'sm' | 'md' | 'lg';
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  title,
  subtitle,
  viewAllLink = '/vinyl',
  viewAllLabel = 'View All',
  columns = 4,
  cardSize = 'md',
}) => {
  return (
    <section>
      {/* Header */}
      {(title || subtitle) && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
          <div>
            {subtitle && <span className="section-label">{subtitle}</span>}
            {title && <h2 className="section-title">{title}</h2>}
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'var(--accent)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'gap 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = '10px')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = '6px')}
            >
              {viewAllLabel} <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}

      {/* Grid */}
      {products.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 20,
        }}>
          {products.map((product, i) => (
            <div
              key={product.id}
              style={{
                opacity: 0,
                animation: `fadeUp 0.5s ease forwards`,
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <ProductCard product={product} size={cardSize} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          color: 'var(--text-muted)',
          fontSize: 14,
        }}>
          No products found.
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          section > div:last-child[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 800px) {
          section > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          section > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;