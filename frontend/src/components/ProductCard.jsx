import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, reviewCount = 0 }) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Produto 1 Dia Útil
        </div>
        {product.main_image || (product.images && product.images.length > 0) ? (
          <img
            src={product.main_image || product.images[0]}
            alt={product.name}
            className="w-full h-48 object-contain bg-white"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">({reviewCount} avaliações)</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{product.description.substring(0, 60)}...</p>
          <p className="text-lg font-bold text-purple-600">
            R$ {parseFloat(product.price).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;