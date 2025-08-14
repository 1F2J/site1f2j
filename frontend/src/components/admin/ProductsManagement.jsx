import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { adminService } from '../../services/api';
import { ArrowLeft, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    promo_price: '',
    category_id: '',
    is_active: true,
  });
  const [imageFiles, setImageFiles] = useState({ main: null, secondary: [] });
  const [options, setOptions] = useState([]);

  const navigate = useNavigate();

  const addOption = () => {
    setOptions(prev => [...prev, { key: '', type: 'select', options: [] }]);
  };

  const updateOption = (index, field, value) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOptionValue = (index) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[index].options.push('');
      return updated;
    });
  };

  const updateOptionValue = (optIndex, valIndex, value) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[optIndex].options[valIndex] = value;
      return updated;
    });
  };

  const removeOption = (index) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const removeOptionValue = (optIndex, valIndex) => {
    setOptions(prev => {
      const updated = [...prev];
      updated[optIndex].options = updated[optIndex].options.filter((_, i) => i !== valIndex);
      return updated;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsRes = await adminService.getAllProducts();
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }

    try {
      const categoriesRes = await adminService.getAllCategories();
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, key === 'is_active' ? (value ? '1' : '0') : value);
      });

      if (imageFiles.main) {
        formDataToSend.append('main_image', imageFiles.main);
      }

      imageFiles.secondary.forEach(file => {
        formDataToSend.append('secondary_images', file);
      });

      const optionsObj = options.reduce((acc, opt) => {
        acc[opt.key] = { type: opt.type, options: opt.options };
        return acc;
      }, {});

      formDataToSend.append('options', JSON.stringify(optionsObj));

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, formDataToSend);
      } else {
        await adminService.createProduct(formDataToSend);
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      promo_price: product.promo_price ? String(product.promo_price) : '',
      category_id: String(product.category_id),
      is_active: product.is_active,
    });

    let parsedOptions = {};
    if (product.options) {
      if (typeof product.options === 'string') {
        try {
          parsedOptions = JSON.parse(product.options);
        } catch {
          parsedOptions = {};
        }
      } else {
        parsedOptions = product.options;
      }
    }

    setOptions(Object.entries(parsedOptions).map(([key, value]) => ({ key, ...value })));
    setImageFiles({ main: null, secondary: [] });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await adminService.deleteProduct(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      promo_price: '',
      category_id: '',
      is_active: true,
    });
    setImageFiles({ main: null, secondary: [] });
    setOptions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-[#EB2590] animate-spin" />
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="mr-2" /> Voltar
        </Button>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2" /> Novo Produto
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
            <CardDescription>
              Preencha os dados do produto abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="promo_price">Preço Promocional</Label>
                  <Input
                    id="promo_price"
                    type="number"
                    step="0.01"
                    value={formData.promo_price}
                    onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="main_image">Imagem Principal</Label>
                <Input
                  id="main_image"
                  type="file"
                  onChange={(e) => setImageFiles({ ...imageFiles, main: e.target.files[0] })}
                  accept="image/*"
                />
              </div>

              <div>
                <Label htmlFor="secondary_images">Imagens Secundárias</Label>
                <Input
                  id="secondary_images"
                  type="file"
                  multiple
                  onChange={(e) => setImageFiles({ ...imageFiles, secondary: Array.from(e.target.files) })}
                  accept="image/*"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Opções do Produto</Label>
                  <Button type="button" onClick={addOption} variant="outline" size="sm">
                    <Plus className="mr-2" /> Adicionar Opção
                  </Button>
                </div>

                {options.map((option, optIndex) => (
                  <div key={optIndex} className="border p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Nome da opção"
                          value={option.key}
                          onChange={(e) => updateOption(optIndex, 'key', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOption(optIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {option.options.map((value, valIndex) => (
                        <div key={valIndex} className="flex gap-2">
                          <Input
                            placeholder="Valor da opção"
                            value={value}
                            onChange={(e) => updateOptionValue(optIndex, valIndex, e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOptionValue(optIndex, valIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOptionValue(optIndex)}
                      >
                        <Plus className="mr-2" /> Adicionar Valor
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Visualização do Produto</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-auto">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    {imageFiles.main ? (
                      <img
                        src={URL.createObjectURL(imageFiles.main)}
                        alt="Preview"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    ) : editingProduct?.main_image ? (
                      <img
                        src={editingProduct.main_image}
                        alt={formData.name}
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                        <Package className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{formData.name || 'Nome do Produto'}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {formData.description || 'Descrição do produto'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#EB2590]">
                        R$ {formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                      </span>
                      {formData.promo_price && (
                        <span className="text-sm text-green-600">
                          Promo: R$ {parseFloat(formData.promo_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="aspect-w-1 aspect-h-1 w-full">
                {product.main_image ? (
                  <img
                    src={product.main_image}
                    alt={product.name}
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    <Package className="h-12 w-12" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{product.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{product.category_name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#EB2590]">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.promo_price && (
                      <span className="text-sm text-green-600">
                        Promo: R$ {parseFloat(product.promo_price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;