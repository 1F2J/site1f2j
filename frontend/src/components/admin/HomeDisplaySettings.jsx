import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { adminService, productService, categoryService } from '../../services/api';
import { LayoutGrid } from 'lucide-react';

const HomeDisplaySettings = () => {
  const [homeDisplayType, setHomeDisplayType] = useState('default');
  const [homeDisplayTitle, setHomeDisplayTitle] = useState('Produtos em Destaque');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [savingHomeDisplay, setSavingHomeDisplay] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/site/settings');
        const data = await response.json();
        if (data.home_display_type) setHomeDisplayType(data.home_display_type);
        if (data.home_display_title) setHomeDisplayTitle(data.home_display_title);
        if (data.home_display_category_id) setSelectedCategoryId(data.home_display_category_id);
        if (data.home_display_product_ids) {
          try {
            const productIds = JSON.parse(data.home_display_product_ids);
            setSelectedProductIds(productIds);
          } catch (e) {
            console.error('Erro ao processar IDs de produtos:', e);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar configurações do site:', error);
      }
    };
    fetchSiteSettings();

    const fetchCategoriesAndProducts = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoryService.getAll(),
          productService.getAll()
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Erro ao buscar categorias e produtos:', error);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  const handleSaveHomeDisplay = async (e) => {
    e.preventDefault();
    setSavingHomeDisplay(true);
    
    try {
      await adminService.updateHomeDisplay({
        type: homeDisplayType,
        title: homeDisplayTitle,
        categoryId: selectedCategoryId,
        productIds: selectedProductIds
      });
      alert('Configurações de exibição na home atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações de exibição:', error);
      alert('Erro ao atualizar configurações. Tente novamente.');
    } finally {
      setSavingHomeDisplay(false);
    }
  };
  
  const toggleProductSelection = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Produtos na Página Inicial
        </CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Configure quais produtos serão exibidos na seção de destaque da página inicial</p>
            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-sm font-medium text-amber-800 mb-1">Opções de exibição:</p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• <strong>Padrão:</strong> Exibe os produtos mais recentes</li>
                <li>• <strong>Por categoria:</strong> Exibe produtos de uma categoria específica</li>
                <li>• <strong>Personalizado:</strong> Selecione manualmente quais produtos exibir</li>
              </ul>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveHomeDisplay} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayTitle">Título da Seção</Label>
              <Input
                id="displayTitle"
                value={homeDisplayTitle}
                onChange={(e) => setHomeDisplayTitle(e.target.value)}
                placeholder="Ex: Produtos em Destaque"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="displayType">Tipo de Exibição</Label>
              <select
                id="displayType"
                value={homeDisplayType}
                onChange={(e) => setHomeDisplayType(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="default">Padrão (produtos mais recentes)</option>
                <option value="category">Por Categoria</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            {homeDisplayType === 'category' && (
              <div>
                <Label htmlFor="categorySelect">Selecione a Categoria</Label>
                <select
                  id="categorySelect"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {homeDisplayType === 'custom' && (
              <div className="space-y-3">
                <Label>Selecione os Produtos</Label>
                <div className="max-h-60 overflow-y-auto border rounded p-3">
                  {products.length === 0 ? (
                    <p className="text-gray-500">Nenhum produto disponível</p>
                  ) : (
                    <div className="space-y-2">
                      {products.map(product => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4"
                          />
                          <label htmlFor={`product-${product.id}`} className="text-sm">
                            {product.name} - R$ {parseFloat(product.price).toFixed(2)}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedProductIds.length} produto(s) selecionado(s)
                </p>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={savingHomeDisplay}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {savingHomeDisplay ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomeDisplaySettings;