import React, { useState, useEffect } from 'react';
import { getHomeSections } from '../services/siteService';
import ProductCard from './ProductCard';

const HomeProductSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getHomeSections();
        const parsedSections = (Array.isArray(data) ? data : []).map(section => ({
          ...section,
          products: section.products.map(p => ({
            ...p,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
            options: typeof p.options === 'string' ? JSON.parse(p.options) : p.options || {}
          }))
        }));
        setSections(parsedSections);
      } catch (error) {
        console.error('Erro ao carregar seções da home:', error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  if (loading) return <div>Carregando seções...</div>;
  if (sections.length === 0) return null;

  return (
    <div className="py-12">
      {Array.isArray(sections) ? sections.map((section) => (
        <section key={section.id} className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )) : null}
    </div>
  );
};

export default HomeProductSections;