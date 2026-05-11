import React from 'react';
 
const PageHeader: React.FC<{ eyebrow: string; title: string; subtitle: string; icon: React.ReactNode; color: string }> = ({ eyebrow, title, subtitle, icon, color }) => (
  <div style={{
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    padding: '48px 0 40px',
    marginBottom: 0,
  }}>
    <div className="container-main">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: 'var(--radius-xl)',
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
          flexShrink: 0,
          border: `1px solid ${color}30`,
        }}>
          {icon}
        </div>
        <div>
          <span className="section-label" style={{ color }}>{eyebrow}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

export default PageHeader;