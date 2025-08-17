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
    <div className="py-12 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
      {Array.isArray(sections) ? sections.map((section) => (
        <section key={section.id} className="container mx-auto px-4 mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#EB2590]/5 via-[#00AFEF]/5 to-[#FFF212]/5 rounded-xl"></div>
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#EB2590] via-[#00AFEF] to-[#FFF212]">{section.title}</h2>
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