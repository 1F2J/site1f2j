import { db } from './config/database';
import { RowDataPacket } from 'mysql2';

async function migrateImages() {
  try {
    // Verificar e adicionar main_image
    const [mainImageCheck] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'main_image'`
    );
    if (mainImageCheck[0].count === 0) {
      await db.execute('ALTER TABLE products ADD COLUMN main_image VARCHAR(255)');
    }

    // Verificar e adicionar secondary_images
    const [secondaryCheck] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'secondary_images'`
    );
    if (secondaryCheck[0].count === 0) {
      await db.execute('ALTER TABLE products ADD COLUMN secondary_images TEXT');
    }

    // Migrar dados existentes
    const [products] = await db.execute<RowDataPacket[]>('SELECT id, images FROM products WHERE images IS NOT NULL');
    for (const product of products) {
      try {
        let images: string[];
        if (typeof product.images === 'string' && product.images.trim() !== '') {
          try {
            images = JSON.parse(product.images);
          } catch {
            images = [product.images];
          }
        } else {
          images = [];
        }
        if (images.length > 0) {
          const main = images[0];
          const secondary = images.slice(1);
          await db.execute(
            'UPDATE products SET main_image = ?, secondary_images = ? WHERE id = ?',
            [main, JSON.stringify(secondary), product.id]
          );
        }
      } catch (err) {
        console.error(`Erro ao migrar produto ${product.id}:`, err);
      }
    }

    console.log('Migração de imagens concluída com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
  } finally {
    process.exit(0);
  }
}

migrateImages();