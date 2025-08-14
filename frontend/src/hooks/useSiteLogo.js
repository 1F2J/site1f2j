import { useState, useEffect } from 'react';

const useSiteLogo = () => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/site/settings');
        const data = await response.json();
        setLogoUrl(`http://localhost:3001${data.site_logo || '/uploads/default-logo.svg'}`);
      } catch (error) {
        console.error('Erro ao buscar logo:', error);
      }
    };
    fetchLogo();
  }, []);

  return logoUrl;
};

export default useSiteLogo;