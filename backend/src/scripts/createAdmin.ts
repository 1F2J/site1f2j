import bcrypt from 'bcryptjs';
import { db } from '../config/database';

const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@1f2j.com.br';
    const adminPassword = 'admin123';

    // Verificar se o admin já existe
    const [existingAdmin] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );

    if ((existingAdmin as any[]).length > 0) {
      console.log('Usuário admin já existe!');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Inserir usuário admin
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', adminEmail, hashedPassword, 'admin']
    );

    console.log('Usuário admin criado com sucesso!');
    console.log('Email:', adminEmail);
    console.log('Senha:', adminPassword);
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    process.exit(0);
  }
};

createAdminUser();