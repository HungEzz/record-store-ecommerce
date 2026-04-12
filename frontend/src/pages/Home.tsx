import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Home: React.FC = () => {
  const allProducts = useSelector((state: RootState) => state.products.items);
  const featuredProducts = allProducts.filter(p => p.category === 'vinyl').slice(0, 4);
  return (
    <div className="flex flex-col w-full">
      <section className="relative h-[85vh] flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 bg-rs-gray-light -z-10" />
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 text-gray-400">Limited Edition Vinyl</span>
        <h1 className="text-7xl md:text-9xl font-bold mb-8 uppercase tracking-tighter font-display leading-[0.85]">
          Classic<br />Records
        </h1>
        <Link 
          to="/vinyl" 
          className="border border-black px-12 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-black hover:text-white transition-all duration-500"
        >
          Khám phá bộ sưu tập
        </Link>
      </section>

      <div className="border-t border-rs-border">
        <FeaturedProducts products={featuredProducts} title="Bản phát hành mới" />
      </div>
    </div>
  );
};

export default Home;