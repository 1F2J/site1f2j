import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { siteService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Search, Filter, ChevronLeft, ChevronRight, Tag, X, Grid, List, SlidersHorizontal, Star, Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'newest'
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

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
      
      // Ajustar conforme estrutura de resposta do backend
      const productsData = prodsRes.data.products || prodsRes.data;
      const parsedProducts = productsData.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || [],
        options: typeof p.options === 'string' ? JSON.parse(p.options || '{}') : p.options || {}
      }));
      setProducts(parsedProducts);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory && selectedCategory !== 'all' ? product.category_id === parseInt(selectedCategory) : true;
    const matchesSearch = searchTerm ? 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    
    const price = product.is_promo && product.promo_price ? parseFloat(product.promo_price) : parseFloat(product.price);
    const matchesPrice = (!priceRange.min || price >= parseFloat(priceRange.min)) && 
                        (!priceRange.max || price <= parseFloat(priceRange.max));
    
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        const priceA = a.is_promo && a.promo_price ? parseFloat(a.promo_price) : parseFloat(a.price);
        const priceB = b.is_promo && b.promo_price ? parseFloat(b.promo_price) : parseFloat(b.price);
        return priceA - priceB;
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleProductSelect = (product) => {
    navigate(`/products/${product.id}`);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EB2590]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nossos Produtos</h1>
          <p className="text-gray-600 text-lg">Descubra nossa linha completa de soluções em impressão digital</p>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative">
              <Input 
                placeholder="Buscar produtos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-[#EB2590] rounded-xl"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-2 border-gray-200 hover:border-[#EB2590] text-gray-700 hover:text-[#EB2590] h-12 px-6"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            
            {/* View Mode */}
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className={`h-12 px-4 rounded-none ${viewMode === 'grid' ? 'bg-[#EB2590] text-white' : 'text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className={`h-12 px-4 rounded-none ${viewMode === 'list' ? 'bg-[#EB2590] text-white' : 'text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#EB2590]">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#EB2590]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nome A-Z</SelectItem>
                        <SelectItem value="price">Menor Preço</SelectItem>
                        <SelectItem value="newest">Mais Recentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço Mínimo</label>
                    <Input
                      type="number"
                      placeholder="R$ 0,00"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="h-12 border-2 border-gray-200 focus:border-[#EB2590]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço Máximo</label>
                    <Input
                      type="number"
                      placeholder="R$ 999,00"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="h-12 border-2 border-gray-200 focus:border-[#EB2590]"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-[#EB2590]"
                  >
                    Limpar Filtros
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    {filteredProducts.length} produto(s) encontrado(s)
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Products Grid/List */}
        <motion.div 
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className={viewMode === 'grid' ? '' : 'w-full'}
              >
                <Card 
                  className={`cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#EB2590]/30 ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                    <div className={`relative bg-gray-100 overflow-hidden ${
                      viewMode === 'list' ? 'h-full' : 'h-48'
                    } ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'}`}>
                      {product.main_image ? (
                        <img 
                          src={product.main_image} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {product.is_promo && product.promo_price ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-[#EB2590]">
                                R$ {parseFloat(product.promo_price).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                R$ {parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              R$ {parseFloat(product.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        <Button 
                          size="sm"
                          className="bg-[#EB2590] hover:bg-[#EB2590]/90 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductSelect(product);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                      
                      {product.category_name && (
                        <Badge variant="outline" className="text-xs">
                          {product.category_name}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar os filtros ou termos de busca</p>
            <Button onClick={clearFilters} className="bg-[#EB2590] hover:bg-[#EB2590]/90 text-white">
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;