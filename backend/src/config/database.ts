import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env do diretório raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const databaseUrl = process.env.DATABASE_URL || '';

// Parse da URL do banco de dados
const parseDbUrl = (url: string) => {
  console.log('Parsing database URL:', url ? 'URL provided' : 'No URL provided');
  
  if (!url) {
    throw new Error('DATABASE_URL não encontrada no arquivo .env');
  }
  
  // Regex mais flexível para capturar a URL do MySQL
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/(.+)$/);
  
  if (!match) {
    console.error('Failed to parse database URL. Expected format: mysql://user:password@host:port/database');
    console.error('Received URL:', url);
    throw new Error('URL do banco de dados inválida');
  }
  
  const config = {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: 'default' // Usando o banco de dados 'default' em vez de tentar criar um novo
  };
  
  console.log('Database config parsed successfully:', {
    user: config.user,
    host: config.host,
    port: config.port,
    database: config.database,
    password: '***hidden***'
  });
  
  return config;
};

let dbConfig;
try {
  dbConfig = parseDbUrl(databaseUrl);
} catch (error) {
  console.error('Database configuration error:', error);
  // Fallback configuration for development
  dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'default'
  };
  console.log('Using fallback database configuration for development');
}

export const db = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;

