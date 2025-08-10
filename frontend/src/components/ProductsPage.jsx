import { useState, useEffect } from 'react';
import { siteService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Filter, ChevronLeft, ChevronRight, Tag, X } from 'lucide-react';

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        siteService.getCategories(),
        siteService.getProducts()
      ]);
      setCategories(catsRes.data);
      const parsedProducts = prodsRes.data.products.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
        options: typeof p.options === 'string' ? JSON.parse(p.options) : p.options || {}
      }));
      setProducts(parsedProducts);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category_id === parseInt(selectedCategory) : true;
    const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    // Initialize selected options with first option of each type
    if (product.options) {
      const initialOptions = {};
      Object.entries(product.options).forEach(([key, value]) => {
        if (value.options && value.options.length > 0) {
          initialOptions[key] = value.options[0];
        }
      });
      setSelectedOptions(initialOptions);
    }
    setCurrentImageIndex(0);
  };

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: value
    }));
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      {selectedProduct ? (
        // Product Detail View
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedProduct(null)}
              className="text-gray-500"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="relative">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <>
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedProduct.images[currentImageIndex]} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-contain"
                    />
                    
                    {selectedProduct.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <Button 
                          variant="ghost" 
                          onClick={prevImage}
                          className="bg-white/80 rounded-full p-2 hover:bg-white"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={nextImage}
                          className="bg-white/80 rounded-full p-2 hover:bg-white"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex mt-4 space-x-2 overflow-x-auto">
                      {selectedProduct.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${currentImageIndex === idx ? 'border-cyan-600' : 'border-transparent'}`}
                          onClick={() => setCurrentImageIndex(idx)}
                        >
                          <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Sem imagem disponível</p>
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedProduct.is_promo && selectedProduct.promo_price ? (
                    <>
                      <span className="text-red-600">R$ {parseFloat(selectedProduct.promo_price).toFixed(2)}</span>
                      <span className="text-gray-400 line-through ml-2 text-lg">R$ {parseFloat(selectedProduct.price).toFixed(2)}</span>
                    </>
                  ) : (
                    <span>R$ {parseFloat(selectedProduct.price).toFixed(2)}</span>
                  )}
                </h2>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{selectedProduct.category_name}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700">{selectedProduct.description}</p>
              </div>
              
              {/* Product Options */}
              {selectedProduct.options && Object.keys(selectedProduct.options).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Opções</h3>
                  
                  {Object.entries(selectedProduct.options).map(([optionType, optionData]) => (
                    <div key={optionType} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Selecione o {optionType}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {optionData.options.map((option) => (
                          <button
                            key={option}
                            className={`px-4 py-2 rounded-md border ${selectedOptions[optionType] === option ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-800 border-gray-300 hover:border-cyan-600'}`}
                            onClick={() => handleOptionChange(optionType, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg">
                Solicitar Orçamento
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Products List View
        <>
          <h1 className="text-3xl font-bold mb-6">Produtos e Categorias</h1>
          
          <div className="flex gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 relative">
              <Input 
                placeholder="Buscar produtos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => handleProductSelect(product)}
              >
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.category_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Sem imagem</p>
                      </div>
                    )}
                    
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-full">
                        {product.images.length} imagens
                      </div>
                    )}
                  </div>
                  
                  <p className="line-clamp-2 text-sm text-gray-600 mb-3">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {product.is_promo && product.promo_price ? (
                        <div>
                          <p className="font-bold text-red-600">R$ {parseFloat(product.promo_price).toFixed(2)}</p>
                          <p className="text-sm text-gray-500 line-through">R$ {parseFloat(product.price).toFixed(2)}</p>
                        </div>
                      ) : (
                        <p className="font-bold">R$ {parseFloat(product.price).toFixed(2)}</p>
                      )}
                    </div>
                    
                    {product.options && Object.keys(product.options).length > 0 && (
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {Object.keys(product.options).length} opções
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-8">Nenhum produto encontrado.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;