import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { Product } from '../types';

interface HeroBannerProps {
  products: Product[];
}

const SLIDE_INTERVAL = 4500;

const HeroBanner: React.FC<HeroBannerProps> = ({ products }) => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('left');

  const slides = products.slice(0, 5);

  const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'left') => {
    setAnimDir(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 'left');
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'right');
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (!isPlaying || slides.length < 2) return;
    const id = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [isPlaying, next, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  // Gradient overlays per slide
  const gradients = [
    'linear-gradient(135deg, rgba(29,185,84,0.2) 0%, rgba(0,0,0,0) 60%)',
    'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 60%)',
    'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(0,0,0,0) 60%)',
    'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(0,0,0,0) 60%)',
    'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 60%)',
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'min(85vh, 680px)',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 12,
      }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background image */}
      <div
        key={current}
        style={{
          position: 'absolute', inset: 0,
          animation: `${animDir === 'left' ? 'slideLeft' : 'slideRight'} 0.55s cubic-bezier(0.4,0,0.2,1) forwards`,
        }}
      >
        <img
          src={slide.imgUrl}
          alt={slide.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)',
        }} />
        {/* Color tint */}
        <div style={{ position: 'absolute', inset: 0, background: gradients[current % gradients.length] }} />
      </div>

      {/* Vinyl decorative */}
      <div style={{
        position: 'absolute',
        right: '8%', top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(360px, 38vw)',
        height: 'min(360px, 38vw)',
        opacity: 0.5,
        pointerEvents: 'none',
      }}>
        <div className="vinyl-disc animate-spin-slow" style={{ width: '100%', height: '100%' }}>
          <div className="vinyl-label">
            <img src={slide.imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        key={`content-${current}`}
        style={{
          position: 'relative', zIndex: 2,
          height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(24px, 5vw, 72px)',
          maxWidth: '55%',
          animation: 'fadeUp 0.5s ease 0.1s both',
        }}
      >
        <span className="section-label" style={{ marginBottom: 16, color: 'var(--accent)' }}>
          {slide.category?.toUpperCase()} · Featured
        </span>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5.5vw, 72px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.05,
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          {slide.title}
        </h1>

        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(14px, 1.5vw, 17px)',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 8,
          fontStyle: 'italic',
        }}>
          {slide.artist}
        </p>

        {slide.description && (
          <p style={{
            fontSize: 'clamp(12px, 1.2vw, 14px)',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 32,
            lineHeight: 1.7,
            maxWidth: 420,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {slide.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link
            to={`/product/${slide.id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--accent)', color: '#000',
              borderRadius: 'var(--radius-full)',
              padding: '14px 28px',
              fontWeight: 700, fontSize: 14,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-accent)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <Play size={15} fill="#000" />
            Shop Now — ${slide.price.toFixed(2)}
          </Link>

          <Link
            to={`/${slide.category}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              borderRadius: 'var(--radius-full)',
              padding: '13px 24px',
              fontWeight: 600, fontSize: 13,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
          >
            Browse Collection
          </Link>
        </div>
      </div>

      {/* Nav arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 3, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 3, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 3,
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 'left' : 'right')}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-40px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;