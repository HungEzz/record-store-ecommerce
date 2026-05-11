import React, { useMemo, useState } from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductFilterBar from '../components/ProductFilterBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import PageHeader from './PageHeader';

export const CD: React.FC = () => {
  const [sortOrder, setSortOrder] = useState('featured');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
 
  const filterOptions = ['all', 'The Weeknd', 'Dua Lipa', 'Olivia Rodrigo', 'Daft Punk'];
  const allProducts = useSelector((state: RootState) => state.products.items);
 
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => p.category === 'cd');
    if (searchQuery.trim()) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedArtist !== 'all') result = result.filter(p => p.artist === selectedArtist);
    if (sortOrder === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortOrder === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortOrder === 'az') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [allProducts, sortOrder, selectedArtist, searchQuery]);
 
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <PageHeader eyebrow="Digital Audio" title="Compact Discs" subtitle="Crystal-clear digital audio in physical form" icon={<span style={{ fontSize: 32 }}>💿</span>} color="var(--accent)" />
      <div className="container-main section">
        <ProductFilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} sortOrder={sortOrder} onSortChange={setSortOrder} filterOptions={filterOptions} selectedFilter={selectedArtist} onFilterSelect={setSelectedArtist} totalCount={filteredProducts.length} />
        <FeaturedProducts products={filteredProducts} columns={4} />
      </div>
    </div>
  );
};

export default CD;