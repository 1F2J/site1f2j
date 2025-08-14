-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS 1f2j_renovado;
USE 1f2j_renovado;

-- Tabela de usuários com campos LGPD
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  cpf_hash VARCHAR(255) UNIQUE,  -- Hash do CPF para segurança
  phone VARCHAR(20),
  marketing_consent BOOLEAN DEFAULT FALSE,  -- Consentimento para marketing
  data_usage_consent BOOLEAN DEFAULT FALSE,  -- Consentimento para uso de dados
  terms_accepted BOOLEAN DEFAULT FALSE,  -- Aceitação dos termos
  privacy_accepted BOOLEAN DEFAULT FALSE,  -- Aceitação da política de privacidade
  terms_version VARCHAR(10),  -- Versão dos termos aceitos
  privacy_version VARCHAR(10),  -- Versão da política de privacidade aceita
  last_login DATETIME,  -- Registro do último login
  account_status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL  -- Para soft delete
);

-- Tabela de log de consentimentos (histórico LGPD)
CREATE TABLE IF NOT EXISTS user_consent_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  consent_type ENUM('marketing', 'data_usage', 'terms', 'privacy') NOT NULL,
  consent_value BOOLEAN NOT NULL,
  version VARCHAR(10),  -- Versão do documento aceito
  ip_address VARCHAR(45),  -- IPv4 ou IPv6
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  promo_price DECIMAL(10,2),
  category_id INT,
  main_image VARCHAR(255),  -- Imagem principal
  secondary_images JSON,  -- Array de URLs das imagens secundárias
  options JSON,  -- Opções do produto (tamanho, cor, etc)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabela de carrinhos
CREATE TABLE IF NOT EXISTS carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de itens do carrinho
CREATE TABLE IF NOT EXISTS cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selected_options JSON,  -- Opções selecionadas (tamanho, cor, etc)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de arquivos
CREATE TABLE IF NOT EXISTS files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  original_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de banners
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  order_position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  selected_options JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir configurações iniciais
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', '1F2J'),
('site_description', 'Loja de roupas e acessórios'),
('contact_email', 'contato@1f2j.com.br'),
('contact_phone', '11953179798'),
('privacy_policy_version', '1.0'),
('terms_version', '1.0'),
('whatsapp_number', '11953179798');

-- Inserir usuário admin inicial
INSERT INTO users (name, email, password_hash, marketing_consent, data_usage_consent, terms_accepted, privacy_accepted, terms_version, privacy_version, account_status) VALUES
('Administrador', 'admin@1f2j.com.br', '$2b$10$17BvWHCRwaqmvAYXXZJnxOFPFUf.DcBB5rcA8raZQKBmHPY.qKzV2', TRUE, TRUE, TRUE, TRUE, '1.0', '1.0', 'active');

-- Inserir categorias iniciais
INSERT INTO categories (name, slug, description) VALUES
('Camisetas', 'camisetas', 'Camisetas masculinas e femininas'),
('Calças', 'calcas', 'Calças masculinas e femininas'),
('Acessórios', 'acessorios', 'Acessórios diversos');