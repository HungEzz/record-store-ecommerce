import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', paddingTop: 14, paddingBottom: 12, marginTop: 'auto' }}>
      <div className="container-main">
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'radial-gradient(circle, #333 0%, #333 28%, var(--accent) 28%, var(--accent) 32%, #1a1a1a 32%)',
                boxShadow: '0 0 16px rgba(29,185,84,0.3)',
              }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                Record<span style={{ color: 'var(--accent)' }}>.</span>Store
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, maxWidth: 260 }}>
              Your destination for premium vinyl records, CDs, and exclusive music merchandise.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { Icon: FaInstagram, href: '#' },
                { Icon: FaTwitter, href: '#' },
                { Icon: FaYoutube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: 45, height: 45,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#000';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-card)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.04em' }}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/vinyl', label: 'Vinyl Records' },
                { to: '/cd', label: 'CDs' },
                { to: '/merch', label: 'Merchandise' },
                { to: '/cart', label: 'Shopping Cart' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.04em' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/shipping-returns', label: 'Shipping & Returns' },
                { to: '/faq', label: 'FAQ' },
                { to: '/account', label: 'My Account' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.04em' }}>Get in Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { Icon: Mail, text: 'support@recordstore.vn' },
                { Icon: Phone, text: '+84 123 456 789' },
                { Icon: MapPin, text: '123 Music St, District 1, HCMC' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Newsletter mini */}
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Subscribe for new releases</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 14px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'var(--accent)')}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'var(--border)')}
                />
                <button
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#000',
                    cursor: 'pointer',
                  }}
                >
                  <Music size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Bottom row */}
        <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>© {year} Record Store. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <a key={t} href="#" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
          footer > div > div:first-child > div:first-child {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 560px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;