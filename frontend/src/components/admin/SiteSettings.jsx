import React from 'react';
import LogoSettings from './LogoSettings';
import BannerSettings from './BannerSettings';
import HomeSectionsSettings from './HomeSectionsSettings';

const SiteSettings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações do Site</h1>
        <p className="text-gray-600">Gerencie a logo, banners e seções da página inicial do seu site.</p>
      </div>
      <LogoSettings />
      <BannerSettings />
      <HomeSectionsSettings />
    </div>
  );
};

export default SiteSettings;