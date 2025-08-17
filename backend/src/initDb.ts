import { db } from './config/database';

async function initDb() {
  try {
    // Criar tabela de usuários
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        cpf_hash VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        marketing_consent BOOLEAN DEFAULT FALSE,
        data_usage_consent BOOLEAN DEFAULT FALSE,
        terms_accepted BOOLEAN DEFAULT FALSE,
        privacy_accepted BOOLEAN DEFAULT FALSE,
        terms_version VARCHAR(10),
        privacy_version VARCHAR(10),
        last_login DATETIME,
        account_status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        role ENUM('user', 'admin') DEFAULT 'user'
      )
    `);

    // Inserir usuário admin inicial
    const adminPassword = '$2b$10$your_hash_here';
    await db.execute(`
      INSERT INTO users (name, email, password_hash, marketing_consent, data_usage_consent, terms_accepted, privacy_accepted, terms_version, privacy_version, account_status, role)
      VALUES (?, ?, ?, TRUE, TRUE, TRUE, TRUE, '1.0', '1.0', 'active', 'admin')
      ON DUPLICATE KEY UPDATE id=id
    `, ['Admin', 'admin@1f2j.com.br', adminPassword]);

    console.log('Tabela de usuários criada e admin inserido com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  } finally {
    process.exit(0);
  }
}

initDb();