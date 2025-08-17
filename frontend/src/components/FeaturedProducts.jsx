import React, { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../services/siteService';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState({ title: '', products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProducts();
        const parsedProducts = (data.products || []).map(p => ({
          ...p,
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
          options: typeof p.options === 'string' ? JSON.parse(p.options) : p.options || {}
        }));
        setFeatured({ title: data.title || '', products: parsedProducts });
      } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
        setFeatured({ title: '', products: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!featured.products || featured.products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{featured.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;