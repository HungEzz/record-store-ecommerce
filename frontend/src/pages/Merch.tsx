import React, { useMemo, useState } from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductFilterBar from '../components/ProductFilterBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import PageHeader from './PageHeader';

export const Merch: React.FC = () => {
  const [sortOrder, setSortOrder] = useState('featured');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
 
  const filterOptions = ['all', 'Record Store Exclusive', 'Eco-friendly', 'Premium Care', 'Turntable Essentials', 'Accessories', 'Home Decor'];
  const allProducts = useSelector((state: RootState) => state.products.items);
 
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => p.category === 'merch');
    if (searchQuery.trim()) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedBrand !== 'all') result = result.filter(p => p.artist === selectedBrand);
    if (sortOrder === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortOrder === 'az') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [allProducts, sortOrder, selectedBrand, searchQuery]);
 
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <PageHeader eyebrow="Official Collection" title="Merchandise" subtitle="Exclusive apparel and accessories for music lovers" icon={<span style={{ fontSize: 32 }}>👕</span>} color="var(--warm-amber)" />
      <div className="container-main section">
        <ProductFilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} sortOrder={sortOrder} onSortChange={setSortOrder} filterOptions={filterOptions} selectedFilter={selectedBrand} onFilterSelect={setSelectedBrand} totalCount={filteredProducts.length} />
        <FeaturedProducts products={filteredProducts} columns={4} />
 
        {/* Shipping note */}
        <div style={{
          marginTop: 64,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 40px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>Shipping Policy</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            All merchandise ships nationwide. Check the size chart before ordering. We support exchanges within 7 days for manufacturer defects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Merch;