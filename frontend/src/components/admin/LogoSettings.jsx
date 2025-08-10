import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { adminService } from '../../services/api';
import { Image } from 'lucide-react';

const LogoSettings = () => {
  const [currentLogo, setCurrentLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/site/settings');
        const data = await response.json();
        setCurrentLogo(`http://localhost:3001${data.site_logo || '/uploads/default-logo.svg'}`);
      } catch (error) {
        console.error('Erro ao buscar configurações do site:', error);
      }
    };
    fetchSiteSettings();
  }, []);

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      await adminService.updateSiteLogo(formData);
      alert('Logo atualizada com sucesso!');
      setLogoFile(null);
    } catch (error) {
      console.error('Erro ao atualizar logo:', error);
      alert('Erro ao atualizar logo. Tente novamente.');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Logo do Site
        </CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Faça upload de uma nova logo para substituir em todas as páginas do site</p>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-800 mb-1">Tamanhos recomendados para melhor visualização:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Desktop:</strong> 200x60px (proporção 3:1)</li>
                <li>• <strong>Mobile:</strong> 150x45px (proporção 3:1)</li>
                <li>• <strong>Formato:</strong> PNG com fundo transparente (recomendado)</li>
                <li>• <strong>Tamanho máximo:</strong> 2MB</li>
              </ul>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentLogo && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Logo Atual</h3>
            <img 
              src={currentLogo} 
              alt="Logo Atual" 
              className="max-h-20 object-contain border rounded" 
            />
          </div>
        )}
        <form onSubmit={handleLogoUpload} className="space-y-4">
          <div>
            <Label htmlFor="logo">Selecionar nova logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="mt-2"
            />
          </div>
          
          {logoFile && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Arquivo selecionado: {logoFile.name}
              </span>
              <Button 
                type="submit" 
                disabled={uploadingLogo}
                className="bg-cyan-1f2j hover:bg-cyan-600"
              >
                {uploadingLogo ? 'Enviando...' : 'Atualizar Logo'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LogoSettings;