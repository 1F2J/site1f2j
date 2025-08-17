import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { siteService } from '../services/api';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Troca a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const loadBanners = async () => {
    try {
      const response = await siteService.getBanners();
      setBanners(response.data);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="relative w-full aspect-[16/5] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Carregando banners...</div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return <div className="w-full aspect-[16/5]" />;
  }

  return (
    <div className="relative w-full aspect-[16/5] overflow-hidden rounded-lg shadow-lg">
      {/* Banners */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={`http://localhost:3001${banner.image}`}
              alt="Banner promocional"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Controles de navegação (apenas se houver mais de um banner) */}
      {banners.length > 1 && (
        <>
          {/* Botões anterior/próximo */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#EB2590]/80 hover:bg-[#EB2590] text-white p-3 rounded-full transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#EB2590]/80 hover:bg-[#EB2590] text-white p-3 rounded-full transition-colors"
            aria-label="Próximo banner"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-[#FFF212]' 
                    : 'bg-white hover:bg-[#FFF212]/75'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;