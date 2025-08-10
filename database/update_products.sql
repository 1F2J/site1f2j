-- Script para atualizar a tabela products
-- ATENÇÃO: Isso irá dropar a tabela existente e recriá-la. Faça backup antes!

DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  promo_price DECIMAL(10,2),
  is_promo BOOLEAN DEFAULT FALSE,
  stock INT DEFAULT 0,
  category_id INT,
  images JSON,  -- Array JSON de caminhos de imagens, ex: ["/uploads/img1.jpg", "/uploads/img2.jpg"]
  options JSON, -- Objeto JSON para opções flexíveis, ex: {"material": {"type": "select", "options": ["Vinil Branco", "Vinil Transparente"]}}
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Exemplo de inserção:
-- INSERT INTO products (name, description, price, category_id, images, options) 
-- VALUES ('Produto Exemplo', 'Descrição', 10.00, 1, '["/uploads/img1.jpg"]', '{"material": {"type": "select", "options": ["Vinil Branco", "Vinil Transparente"]}}');