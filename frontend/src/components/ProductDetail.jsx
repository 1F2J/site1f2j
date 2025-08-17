import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { authService, productService } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, 
  Clock, ChevronLeft, ChevronRight, Plus, Minus, Zap, Award,
  MessageCircle, Phone, Mail, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        const foundProduct = response.data;
        
        if (foundProduct) {
          const parsedProduct = {
            ...foundProduct,
            images: typeof foundProduct.images === 'string' ? JSON.parse(foundProduct.images) : foundProduct.images || [],
            options: typeof foundProduct.options === 'string' ? JSON.parse(foundProduct.options) : foundProduct.options || {}
          };
          setProduct(parsedProduct);
          
          // Initialize selected options with first option of each type
          if (parsedProduct.options) {
            const initialOptions = {};
            Object.entries(parsedProduct.options).forEach(([key, value]) => {
              if (value.options && value.options.length > 0) {
                initialOptions[key] = value.options[0];
              }
            });
            setSelectedOptions(initialOptions);
          }
        } else {
          setError('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: value
    }));
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/cart/add', {
        product_id: product.id,
        quantity,
        options: selectedOptions
      });
      // Show success message or notification
      console.log('Produto adicionado ao carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      setError('Erro ao adicionar produto ao carrinho');
    }
  };

  const handleBuyNow = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/cart/add', {
        product_id: product.id,
        quantity,
        options: selectedOptions
      });
      navigate('/cart');
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      setError('Erro ao processar compra');
    }
  };

  const toggleFavorite = () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    setIsFavorite(!isFavorite);
    // Implementar lógica de favoritos
  };

  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Mostrar toast de sucesso
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#EB2590]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Produto não encontrado'}
          </h1>
          <Button onClick={() => navigate('/products')} className="bg-[#EB2590] hover:bg-[#EB2590]/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Produtos
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#EB2590]">
            Início
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-[#EB2590]">
            Produtos
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative h-96 lg:h-[500px]">
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain cursor-zoom-in"
                      onClick={() => setShowImageModal(true)}
                    />
                    
                    {/* Navigation arrows */}
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    
                    {/* Image counter */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex space-x-3 p-4 overflow-x-auto">
                      {product.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                            currentImageIndex === idx 
                              ? 'border-[#EB2590] scale-105' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(idx)}
                        >
                          <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 lg:h-[500px] flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Sem imagem disponível</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Informações do Produto */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="border-[#EB2590] text-[#EB2590]">
                      {product.category_name}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareProduct}
                    className="p-3 rounded-full text-gray-400 hover:text-[#EB2590]"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Preço */}
              <div className="mb-6">
                {product.is_promo && product.promo_price ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl font-bold text-[#EB2590]">
                        R$ {parseFloat(product.promo_price).toFixed(2)}
                      </span>
                      <Badge className="bg-red-100 text-red-800">
                        Promoção
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl text-gray-500 line-through">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {Math.round(((product.price - product.promo_price) / product.price) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Descrição */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Opções do Produto */}
            {product.options && Object.keys(product.options).length > 0 && (
              <>
                <Separator />
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Personalize seu Produto</h3>
                  
                  {Object.entries(product.options).map(([optionType, optionData]) => (
                    <div key={optionType} className="space-y-3">
                      <Label className="text-base font-medium text-gray-700 capitalize">
                        {optionType}:
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {optionData.options.map((option) => (
                          <Button
                            key={option}
                            variant={selectedOptions[optionType] === option ? "default" : "outline"}
                            onClick={() => handleOptionChange(optionType, option)}
                            className={`h-12 text-sm font-medium transition-all ${
                              selectedOptions[optionType] === option
                                ? 'bg-[#EB2590] text-white border-[#EB2590] shadow-lg scale-105'
                                : 'border-2 border-gray-200 hover:border-[#EB2590] hover:text-[#EB2590] hover:scale-105'
                            }`}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Separator />

            {/* Quantidade */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-gray-700">Quantidade:</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold text-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-600">unidades disponíveis</span>
              </div>
            </div>

            <Separator />

            {/* Botões de Ação */}
            <div className="space-y-4">
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-[#EB2590] to-[#00AFEF] hover:from-[#EB2590]/90 hover:to-[#00AFEF]/90 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="mr-2 h-5 w-5" />
                Comprar Agora
              </Button>
              
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="w-full h-14 border-2 border-[#EB2590] text-[#EB2590] hover:bg-[#EB2590] hover:text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>

            {/* Garantias e Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-2 border-gray-100 hover:border-[#EB2590]/30 transition-colors">
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 text-[#EB2590] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Entrega Rápida</p>
                  <p className="text-xs text-gray-600">Em até 24h</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100 hover:border-[#00AFEF]/30 transition-colors">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-[#00AFEF] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Garantia</p>
                  <p className="text-xs text-gray-600">100% Qualidade</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-gray-100 hover:border-yellow-500/30 transition-colors">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Suporte</p>
                  <p className="text-xs text-gray-600">Especializado</p>
                </CardContent>
              </Card>
            </div>

            {/* Contato */}
            <Card className="bg-gradient-to-r from-[#EB2590]/5 to-[#00AFEF]/5 border-2 border-[#EB2590]/20">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Precisa de ajuda?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="ghost" className="flex items-center justify-start space-x-2 h-auto p-3">
                    <MessageCircle className="h-5 w-5 text-[#EB2590]" />
                    <span className="text-sm">Chat Online</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center justify-start space-x-2 h-auto p-3">
                    <Phone className="h-5 w-5 text-[#00AFEF]" />
                    <span className="text-sm">(11) 9999-9999</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center justify-start space-x-2 h-auto p-3">
                    <Mail className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm">contato@1f2j.com</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal de Imagem */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              >
                ✕
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default ProductDetail;
