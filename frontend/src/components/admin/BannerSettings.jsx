import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { adminService } from '../../services/api';
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react';

const BannerSettings = () => {
  const [bannerFiles, setBannerFiles] = useState([]);
  const [uploadingBanners, setUploadingBanners] = useState(false);
  const [existingBanners, setExistingBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await adminService.getBanners();
        setExistingBanners(response.data);
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  const handleBannerUpload = async (e) => {
    e.preventDefault();
    if (bannerFiles.length === 0) return;

    setUploadingBanners(true);
    try {
      const formData = new FormData();
      Array.from(bannerFiles).forEach((file) => {
        formData.append(`banners`, file);
      });
      
      await adminService.uploadBanners(formData);
      alert('Banners enviados com sucesso!');
      setBannerFiles([]);
      // Recarregar lista de banners
      const response = await adminService.getBanners();
      setExistingBanners(response.data);
    } catch (error) {
      console.error('Erro ao enviar banners:', error);
      alert('Erro ao enviar banners. Tente novamente.');
    } finally {
      setUploadingBanners(false);
    }
  };

  const handleBannerToggle = async (bannerId, isActive) => {
    try {
      await adminService.toggleBanner(bannerId, !isActive);
      // Recarregar lista
      const response = await adminService.getBanners();
      setExistingBanners(response.data);
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
      alert('Erro ao alterar status do banner.');
    }
  };

  const handleBannerDelete = async (bannerId) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;
    
    try {
      await adminService.deleteBanner(bannerId);
      alert('Banner excluído com sucesso!');
      // Recarregar lista
      const response = await adminService.getBanners();
      setExistingBanners(response.data);
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      alert('Erro ao excluir banner.');
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Banners do Site
        </CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Gerencie os banners que aparecerão no carrossel da página inicial</p>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm font-medium text-green-800 mb-1">Especificações para banners:</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Tamanho:</strong> 1920x600px (proporção 16:5)</li>
                <li>• <strong>Formato:</strong> JPG ou PNG</li>
                <li>• <strong>Tamanho máximo:</strong> 5MB por arquivo</li>
                <li>• <strong>Carrossel:</strong> Se houver múltiplos banners ativos, será criado um carrossel automático</li>
              </ul>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBannerUpload} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="banners">Selecionar banners</Label>
            <Input
              id="banners"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setBannerFiles(e.target.files)}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Você pode selecionar múltiplos arquivos
            </p>
          </div>
          
          {bannerFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Arquivos selecionados:</p>
              {Array.from(bannerFiles).map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {file.name}
                </div>
              ))}
              <Button 
                type="submit" 
                disabled={uploadingBanners}
                className="bg-magenta-1f2j hover:bg-pink-600"
              >
                {uploadingBanners ? 'Enviando...' : `Enviar ${bannerFiles.length} Banner(s)`}
              </Button>
            </div>
          )}
        </form>

        {/* Lista de banners existentes */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Banners Existentes</h3>
          {loading ? (
            <p>Carregando banners...</p>
          ) : existingBanners.length === 0 ? (
            <p className="text-gray-500">Nenhum banner encontrado</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingBanners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100">
                    <img 
                      src={`http://localhost:3001${banner.image}`} 
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {banner.title || 'Banner sem título'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        banner.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBannerToggle(banner.id, banner.is_active)}
                        className="flex-1"
                      >
                        {banner.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Ativar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBannerDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerSettings;