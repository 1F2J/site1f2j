import { Request, Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { deleteFile } from '../utils/upload';
import { RowDataPacket, OkPacket, FieldPacket } from 'mysql2';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const [products] = await db.execute<RowDataPacket[]>(
      `SELECT p.id, p.name, p.description, p.price, p.promo_price, p.main_image, p.is_active, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.is_active = 1
       ORDER BY p.created_at DESC`
    ) as [RowDataPacket[], FieldPacket[]];
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
       JSON_UNQUOTE(p.secondary_images) as secondary_images
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.is_active = 1`,
      [id]
    ) as [RowDataPacket[], FieldPacket[]];
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, promo_price, is_promo, stock, category_id } = req.body;
    const image = req.file ? `/uploadprod/${req.file.filename}` : null;

    const [result] = await db.execute<OkPacket>(
      `INSERT INTO products (name, description, price, promo_price, is_promo, stock, category_id, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, promo_price || null, is_promo || false, stock || 0, category_id || null, image]
    ) as [OkPacket, FieldPacket[]];

    const productId = (result as any).insertId;

    res.status(201).json({
      message: 'Produto criado com sucesso',
      id: productId
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, promo_price, is_promo, stock, category_id } = req.body;

    // Buscar produto atual para verificar se existe e obter imagem atual
    const [currentProducts] = await db.execute<RowDataPacket[]>(
      'SELECT image FROM products WHERE id = ?',
      [id]
    ) as [RowDataPacket[], FieldPacket[]];

    const currentProduct = currentProducts[0];

    if (!currentProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    let updateQuery = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, promo_price = ?, is_promo = ?, stock = ?, category_id = ?
    `;
    let params = [name, description, price, promo_price || null, is_promo || false, stock || 0, category_id || null];

    // Se uma nova imagem foi enviada, atualizar e deletar a anterior
    if (req.file) {
  updateQuery += ', image = ?';
  params.push(`/uploadprod/${req.file.filename}`);

  // Deletar imagem anterior se existir
  if (currentProduct.image) {
    deleteFile(currentProduct.image);
  }
}

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.execute<OkPacket>(updateQuery, params) as [OkPacket, FieldPacket[]];

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar produto para obter imagem antes de deletar
    const [products] = await db.execute<RowDataPacket[]>(
      'SELECT image FROM products WHERE id = ?',
      [id]
    ) as [RowDataPacket[], FieldPacket[]];

    const product = products[0];

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Soft delete - marcar como inativo
    await db.execute<OkPacket>(
      'UPDATE products SET is_active = 0 WHERE id = ?',
      [id]
    ) as [OkPacket, FieldPacket[]];

    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Notes for updates:
// In getProducts, update the query:
// const products = await db.query(
//   'SELECT id, name, description, price, promotional_price, main_image, active FROM products WHERE active = true'
// );

// In getProductById, update the query:
// const [product] = await db.query(
//   'SELECT *, JSON_UNQUOTE(secondary_images) as secondary_images FROM products WHERE id = ?',
//   [req.params.id]
// );
// if (!product) {
//   return res.status(404).json({ message: 'Produto não encontrado' });
// }
// Remove any unnecessary parsing, frontend handles JSON

// In createProduct and updateProduct, adjust to insert main_image and secondary_images
// But as adminController handles creation/update, it might already be covered

