import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { adminService, categoryService, productService } from '../../services/api';
import { Home } from 'lucide-react';

const HomeSectionsSettings = () => {
  const [homeSections, setHomeSections] = useState([]);
  const [newSection, setNewSection] = useState({ title: '', type: 'default', category_id: null, product_ids: [], order_position: 0 });
  const [editingSection, setEditingSection] = useState(null);
  const [savingSection, setSavingSection] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchHomeSections();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchHomeSections = async () => {
    try {
      const response = await adminService.getHomeSections();
      setHomeSections(response.data);
    } catch (error) {
      console.error('Erro ao buscar seções da home:', error);
    }
  };

  const saveSection = async (e) => {
    e.preventDefault();
    if (!newSection.title || (newSection.type === 'category' && !newSection.category_id) || (newSection.type === 'custom' && newSection.product_ids.length === 0)) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    setSavingSection(true);
    try {
      if (editingSection) {
        await adminService.updateHomeSection(editingSection.id, newSection);
      } else {
        await adminService.createHomeSection(newSection);
      }
      setNewSection({ title: '', type: 'default', category_id: null, product_ids: [], order_position: 0 });
      setEditingSection(null);
      fetchHomeSections();
      alert('Seção salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
      alert('Erro ao salvar seção. Tente novamente.');
    } finally {
      setSavingSection(false);
    }
  };

  const deleteSection = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) return;
    
    try {
      await adminService.deleteHomeSection(id);
      setHomeSections(prev => prev.filter(section => section.id !== id));
      alert('Seção excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir seção:', error);
      alert('Erro ao excluir seção. Tente novamente.');
    }
  };

  const startEditing = (section) => {
    setEditingSection(section);
    setNewSection({ title: section.title, type: section.type, category_id: section.category_id, product_ids: section.product_ids ? JSON.parse(section.product_ids) : [], order_position: section.order_position });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Seções da Página Inicial
        </CardTitle>
        <CardDescription>
          Adicione e gerencie múltiplas seções dinâmicas na página inicial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveSection} className="space-y-6 mb-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sectionTitle">Título da Seção *</Label>
              <Input
                id="sectionTitle"
                value={newSection.title}
                onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                placeholder="Ex: Produtos em Destaque"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="sectionType">Tipo de Exibição *</Label>
              <select
                id="sectionType"
                value={newSection.type}
                onChange={(e) => setNewSection({...newSection, type: e.target.value, category_id: null, product_ids: []})}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="default">Mais recentes</option>
                <option value="category">Por categoria</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            
            {newSection.type === 'category' && (
              <div>
                <Label htmlFor="categoryId">Categoria *</Label>
                <select
                  id="categoryId"
                  value={newSection.category_id || ''}
                  onChange={(e) => setNewSection({...newSection, category_id: parseInt(e.target.value) || null})}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {newSection.type === 'custom' && (
              <div>
                <Label>Produtos *</Label>
                <div className="max-h-40 overflow-y-auto border p-2 rounded mt-1">
                  {products.map(prod => (
                    <div key={prod.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`prod-${prod.id}`}
                        checked={newSection.product_ids.includes(prod.id)}
                        onChange={() => {
                          const updated = newSection.product_ids.includes(prod.id)
                            ? newSection.product_ids.filter(id => id !== prod.id)
                            : [...newSection.product_ids, prod.id];
                          setNewSection({...newSection, product_ids: updated});
                        }}
                      />
                      <label htmlFor={`prod-${prod.id}`}>{prod.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="orderPosition">Ordem de Exibição *</Label>
              <Input
                id="orderPosition"
                type="number"
                value={newSection.order_position}
                onChange={(e) => setNewSection({...newSection, order_position: parseInt(e.target.value) || 0})}
                className="mt-1"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={savingSection}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {savingSection ? 'Salvando...' : (editingSection ? 'Atualizar Seção' : 'Adicionar Seção')}
          </Button>
        </form>
        
        <div className="space-y-4">
          {homeSections.sort((a, b) => a.order_position - b.order_position).map(section => (
            <div key={section.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{section.title}</h4>
                  <p className="text-sm text-gray-500">Tipo: {section.type}</p>
                  <p className="text-sm text-gray-500">Ordem: {section.order_position}</p>
                  {section.type === 'category' && <p className="text-sm text-gray-500">Categoria ID: {section.category_id}</p>}
                  {section.type === 'custom' && <p className="text-sm text-gray-500">Produtos: {section.product_ids}</p>}
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => startEditing(section)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteSection(section.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {homeSections.length === 0 && (
            <p className="text-center text-gray-500">Nenhuma seção adicionada ainda</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeSectionsSettings;