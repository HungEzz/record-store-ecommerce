import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, X, Sun, Moon, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const allProducts = useSelector((state: RootState) => state.products.items);
  const { isLoggedIn, profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSuggestions([]); return; }
    const q = searchQuery.toLowerCase();
    setSuggestions(allProducts.filter(p =>
      p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q)
    ).slice(0, 6));
  }, [searchQuery, allProducts]);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { to: '/vinyl', label: 'Vinyl' },
    { to: '/cd', label: 'CDs' },
    { to: '/merch', label: 'Merch' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'var(--bg-glass)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: '0 32px',
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {/* Mini vinyl icon */}
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #333 0%, #333 28%, var(--accent) 28%, var(--accent) 32%, #1a1a1a 32%, #1a1a1a 50%, #222 50%, #222 52%, #1a1a1a 52%)',
              boxShadow: '0 0 12px rgba(29,185,84,0.4)',
              flexShrink: 0,
              animation: 'spin-slow 8s linear infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              Record<span style={{ color: 'var(--accent)' }}>.</span>Store
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
                style={{ padding: '8px 16px', textDecoration: 'none', borderRadius: 'var(--radius-full)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          {isSearchOpen ? (
            <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
              <div className="search-bar">
                <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search albums, artists..."
                  style={{ fontSize: 14 }}
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                >
                  <X size={16} />
                </button>
              </div>

              {suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0, right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  overflow: 'hidden',
                  zIndex: 200,
                }}>
                  {suggestions.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { navigate(`/product/${p.id}`); setIsSearchOpen(false); setSearchQuery(''); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <img
                        src={p.imgUrl}
                        alt={p.title}
                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: 'var(--bg-secondary)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.artist}</div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>${p.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Search toggle */}
            {!isSearchOpen && (
              <button
                className="btn-icon btn"
                onClick={() => setIsSearchOpen(true)}
                title="Search"
              >
                <Search size={18} />
              </button>
            )}

            {/* Theme toggle */}
            <button
              className="btn-icon btn"
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Account */}
            <Link to="/account" style={{ display: 'flex' }}>
              <button className="btn-icon btn" title="Account">
                {isLoggedIn && profile ? (
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User size={18} />
                )}
              </button>
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ display: 'flex' }}>
              <button className="btn btn-primary btn-sm" style={{ position: 'relative', gap: 8, borderRadius: 'var(--radius-full)', padding: '8px 16px' }}>
                <ShoppingBag size={16} />
                {cartItemCount > 0 && (
                  <span style={{
                    background: '#000',
                    color: 'var(--accent)',
                    borderRadius: '50%',
                    width: 18, height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {cartItemCount}
                  </span>
                )}
                {cartItemCount === 0 && <span style={{ fontSize: 13, fontWeight: 600 }}>Cart</span>}
              </button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="btn-icon btn mobile-menu-btn"
              onClick={() => setMobileOpen(o => !o)}
              style={{ display: 'none' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px 24px',
          }}>
            <div className="search-bar" style={{ marginBottom: 16 }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
              />
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`nav-link ${isActive(to) ? 'active' : ''}`}
                  style={{ padding: '12px 16px', textDecoration: 'none', borderRadius: 'var(--radius-md)', display: 'block' }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div style={{ height: 68 }} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;