import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import HeroBanner from '../components/HeroBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import { Disc3, Headphones, TrendingUp, Star, ChevronRight, Zap } from 'lucide-react';

/* Simple intersection observer hook */
function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

/* Section wrapper with fade-up on scroll */
const Section: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const allProducts = useSelector((state: RootState) => state.products.items);

  const heroBannerProducts = allProducts.filter(p => p.category === 'vinyl').slice(0, 5);
  const featuredVinyl   = allProducts.filter(p => p.category === 'vinyl').slice(0, 8);
  const featuredCDs     = allProducts.filter(p => p.category === 'cd').slice(0, 4);
  const featuredMerch   = allProducts.filter(p => p.category === 'merch').slice(0, 4);
  const trendingAll     = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 4);

  /* Categories */
  const categories = [
    { label: 'Vinyl Records', to: '/vinyl', icon: <Disc3 size={28} />, count: allProducts.filter(p => p.category === 'vinyl').length, color: 'var(--warm-purple)', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Compact Discs', to: '/cd', icon: <Star size={28} />, count: allProducts.filter(p => p.category === 'cd').length, color: 'var(--accent)', bg: 'var(--accent-soft)' },
    { label: 'Merchandise', to: '/merch', icon: <Headphones size={28} />, count: allProducts.filter(p => p.category === 'merch').length, color: 'var(--warm-amber)', bg: 'rgba(245,158,11,0.1)' },
  ];

  /* Stats */
  const stats = [
    { label: 'Albums in Stock', value: allProducts.length + '+ titles' },
    { label: 'Happy Customers', value: '10k+' },
    { label: 'Artists Featured', value: '200+' },
    { label: 'Years of Music', value: '7+ yrs' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div className="container-main" style={{ paddingTop: 24 }}>
        <HeroBanner products={heroBannerProducts.length ? heroBannerProducts : allProducts.slice(0, 5)} />
      </div>

      {/* ── CATEGORY CARDS ──────────────────────────────────────────── */}
      <div className="container-main section-sm">
        <Section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {categories.map(({ label, to, icon, count, color, bg }) => (
              <Link
                key={to}
                to={to}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card"
                  style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer' }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} products</p>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </div>

      {/* ── NEW RELEASES (VINYL) ─────────────────────────────────────── */}
      {featuredVinyl.length > 0 && (
        <div className="container-main section">
          <Section>
            <FeaturedProducts
              products={featuredVinyl}
              title="New Releases"
              subtitle="🎵 Vinyl Records"
              viewAllLink="/vinyl"
              columns={4}
            />
          </Section>
        </div>
      )}

      {/* ── TRENDING BANNER ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-main section">
          <Section>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={12} /> Trending Now
              </span>
              <h2 className="section-title">What Everyone's Playing</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {trendingAll.map((p, i) => (
                <div key={p.id} style={{ opacity: 0, animation: `fadeUp 0.5s ease ${i * 0.08}s forwards` }}>
                  <Link to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 16px',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 700, minWidth: 24 }}>#{i + 1}</span>
                      <img src={p.imgUrl} alt={p.title} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.artist}</p>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginLeft: 'auto', flexShrink: 0 }}>${p.price.toFixed(2)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── CDs ─────────────────────────────────────────────────────── */}
      {featuredCDs.length > 0 && (
        <div className="container-main section">
          <Section>
            <FeaturedProducts
              products={featuredCDs}
              title="Compact Discs"
              subtitle="💿 Digital Audio"
              viewAllLink="/cd"
              columns={4}
            />
          </Section>
        </div>
      )}

      {/* ── STATS BANNER ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container-main" style={{ padding: '56px 32px' }}>
          <Section>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
              {stats.map(({ label, value }, i) => (
                <div key={i}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>{value}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{label}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── MERCH ───────────────────────────────────────────────────── */}
      {featuredMerch.length > 0 && (
        <div className="container-main section">
          <Section>
            <FeaturedProducts
              products={featuredMerch}
              title="Official Merch"
              subtitle="👕 Merchandise"
              viewAllLink="/merch"
              columns={4}
            />
          </Section>
        </div>
      )}

      {/* ── PROMO STRIP ─────────────────────────────────────────────── */}
      <div className="container-main" style={{ paddingBottom: 80 }}>
        <Section>
          <div style={{
            background: 'linear-gradient(135deg, rgba(29,185,84,0.15) 0%, rgba(139,92,246,0.08) 50%, rgba(245,158,11,0.08) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(32px, 5vw, 56px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Zap size={20} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)' }}>Limited Time</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 8 }}>
                Free Shipping on Orders<br />Over $100
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Delivered anywhere in Vietnam — 3–7 business days</p>
            </div>
            <Link
              to="/vinyl"
              style={{
                background: 'var(--accent)', color: '#000',
                borderRadius: 'var(--radius-full)',
                padding: '16px 32px',
                fontWeight: 700, fontSize: 15,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              Shop Now
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Home;