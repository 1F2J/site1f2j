-- Atualizar o usuário admin com a senha correta e papel de admin
UPDATE users
SET 
  password_hash = '$2a$10$5QZM1yQmVZYQ.0ETm8TQxuLYwGQoXXeaxYUQwQGJj4Y6HzO0BQp4e', -- Senha: admin123
  role = 'admin'
WHERE email = 'admin@1f2j.com.br';

-- Se o usuário não existir, criar
INSERT INTO users (name, email, password_hash, role, marketing_consent, data_usage_consent, terms_accepted, privacy_accepted, terms_version, privacy_version, account_status)
SELECT 'Admin', 'admin@1f2j.com.br', '$2a$10$5QZM1yQmVZYQ.0ETm8TQxuLYwGQoXXeaxYUQwQGJj4Y6HzO0BQp4e', 'admin', TRUE, TRUE, TRUE, TRUE, '1.0', '1.0', 'active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@1f2j.com.br');