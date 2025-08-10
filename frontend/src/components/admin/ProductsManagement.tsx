import { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { adminService } from '../../services/api';
import { ArrowLeft, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';

const ProductsManagement = () => {
  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    promo_price?: number;
    category_id: number;
    category_name: string;
    is_active: boolean;
    image_url?: string;
    options?: Record<string, { type: string; options: string[] }> | string;
  }

  interface Category {
    id: number;
    name: string;
  }

  // Renomeado para evitar conflito com FormData nativo
  interface ProductFormData {
    name: string;
    description: string;
    price: string;
    promo_price: string;
    category_id: string;
    is_active: boolean;
  }

  interface ImageFiles {
    main: File | null;
    secondary: File[];
  }

  interface Option {
    key: string;
    type: string;
    options: string[];
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    promo_price: '',
    category_id: '',
    is_active: true,
  });
  const [imageFiles, setImageFiles] = useState<ImageFiles>({ main: null, secondary: [] });
  const [options, setOptions] = useState<Option[]>([]);

  const navigate = useNavigate();

  const addOption = () => {
    setOptions(prev => [...prev, { key: '', type: 'select', options: [] }]);
  };

  const updateOption = (index: number, field: keyof Option, value: string) => {
    setOptions(prev => {
      const newOptions = [...prev];
      (newOptions[index] as any)[field] = value;
      return newOptions;
    });
  };

  const addOptionValue = (index: number) => {
    setOptions(prev => {
      const newOptions = [...prev];
      newOptions[index].options.push('');
      return newOptions;
    });
  };

  const updateOptionValue = (optIndex: number, valIndex: number, value: string) => {
    setOptions(prev => {
      const newOptions = [...prev];
      newOptions[optIndex].options[valIndex] = value;
      return newOptions;
    });
  };

  const removeOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const removeOptionValue = (optIndex: number, valIndex: number) => {
    setOptions(prev => {
      const newOptions = [...prev];
      newOptions[optIndex].options = newOptions[optIndex].options.filter((_, i) => i !== valIndex);
      return newOptions;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsRes: AxiosResponse<{ products: Product[] }> = await adminService.getAllProducts();
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }

    try {
      const categoriesRes: AxiosResponse<Category[]> = await adminService.getAllCategories();
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      (Object.keys(formData) as (keyof ProductFormData)[]).forEach(key => {
        if (key === 'is_active') {
          formDataToSend.append(key, formData[key] ? '1' : '0');
        } else {
          formDataToSend.append(key, formData[key]);
        }
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
      }, {} as Record<string, { type: string; options: string[] }>);

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      promo_price: product.promo_price ? product.promo_price.toString() : '',
      category_id: product.category_id.toString(),
      is_active: product.is_active,
    });

    let parsedOptions: Record<string, { type: string; options: string[] }> = {};
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

  const handleDelete = async (id: number) => {
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

  // ... resto do JSX exatamente como estava
};

export default ProductsManagement;
