import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

interface ProductFilterBarProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  sortOrder: string;
  onSortChange: (v: string) => void;
  filterOptions?: string[];
  selectedFilter?: string;
  onFilterSelect?: (v: string) => void;
  totalCount?: number;
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price-low' },
  { label: 'Price: High → Low', value: 'price-high' },
  { label: 'A → Z', value: 'az' },
];

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchValue,
  onSearchChange,
  sortOrder,
  onSortChange,
  filterOptions,
  selectedFilter,
  onFilterSelect,
  totalCount,
}) => {
  const [sortOpen, setSortOpen] = useState(false);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortOrder) || SORT_OPTIONS[0];

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Top row: search + controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div className="search-bar" style={{ flex: '1 1 240px', maxWidth: 360 }}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search albums, artists..."
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSortOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '9px 16px',
                fontSize: 13, fontWeight: 500,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <SlidersHorizontal size={15} style={{ color: 'var(--text-muted)' }} />
              {currentSort.label}
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {sortOpen && (
              <>
                <div onClick={() => setSortOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 10,
                  minWidth: 200,
                  overflow: 'hidden',
                }}>
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => { onSortChange(o.value); setSortOpen(false); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '11px 16px', fontSize: 13,
                        color: o.value === sortOrder ? 'var(--accent)' : 'var(--text-primary)',
                        background: o.value === sortOrder ? 'var(--accent-soft)' : 'none',
                        border: 'none', cursor: 'pointer',
                        fontWeight: o.value === sortOrder ? 600 : 400,
                        transition: 'background 0.15s',
                        borderBottom: '1px solid var(--border)',
                      }}
                      onMouseEnter={e => { if (o.value !== sortOrder) (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = o.value === sortOrder ? 'var(--accent-soft)' : 'none'; }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Count */}
          {totalCount !== undefined && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {totalCount} item{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Filter pills */}
      {filterOptions && onFilterSelect && filterOptions.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {filterOptions.map(opt => {
            const isSelected = selectedFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => onFilterSelect(opt)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--accent-soft)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {opt === 'all' ? 'All' : opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductFilterBar;