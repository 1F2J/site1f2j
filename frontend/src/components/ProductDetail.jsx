import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        setProduct(response.data);
        setMainImage(response.data.main_image || '');
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-8">Carregando...</div>;

  const secondaryImages = product.secondary_images ? JSON.parse(product.secondary_images) : [];
  const options = product.options ? JSON.parse(product.options) : {};

  const handleAddToCart = () => {
    console.log('Adicionar ao carrinho com opções:', selectedOptions);
  };

  return (
    <div className="container mx-auto p-4 grid md:grid-cols-2 gap-10">
      {/* Galeria */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-[450px] object-contain"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {secondaryImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Vista ${index + 1}`}
              className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition hover:scale-105 ${
                mainImage === img ? 'border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Detalhes */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p
          className="text-3xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, #EB2590, #00AFEF, #FFF212)',
          }}
        >
          R$ {parseFloat(product.price).toFixed(2)}
        </p>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        {/* Opções */}
        <div className="space-y-4">
          {Object.entries(options).map(([key, opt]) => (
            <div key={key}>
              <Label htmlFor={key} className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
              {opt.type === 'select' ? (
                <Select onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [key]: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={`Selecione ${key}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {opt.options.map((val) => (
                      <SelectItem key={val} value={val}>{val}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={key}
                  className="mt-1"
                  onChange={(e) => setSelectedOptions({ ...selectedOptions, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        {/* Botões estilo Mercado Livre */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            className="w-full py-6 text-lg font-bold text-white rounded-lg shadow-lg transition transform hover:scale-105"
            style={{
              backgroundImage: 'linear-gradient(90deg, #EB2590, #00AFEF)',
            }}
          >
            Comprar agora
          </Button>
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="w-full py-6 text-lg font-bold border-2 rounded-lg shadow-lg transition transform hover:scale-105"
            style={{
              borderColor: '#FFF212',
              color: '#333',
              backgroundColor: '#FFF212',
            }}
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
