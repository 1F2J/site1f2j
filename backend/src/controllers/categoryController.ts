import { Request, Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const [categories] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY name'
    );

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [categories] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE slug = ? AND is_active = 1',
      [slug]
    );

    const category = (categories as any[])[0];

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const [products] = await db.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       INNER JOIN categories c ON p.category_id = c.id 
       WHERE c.slug = ? AND p.is_active = 1 AND c.is_active = 1
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [slug, parseInt(limit as string), parseInt(offset as string)]
    );

    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos da categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description } = req.body;
    const image = req.file ? req.file.filename : null;

    // Verificar se o slug já existe
    const [existingCategory] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM categories WHERE slug = ?',
      [slug]
    );

    if ((existingCategory as any[]).length > 0) {
      return res.status(400).json({ message: 'Slug já existe' });
    }

    const [result] = await db.execute<OkPacket>(
      'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, slug, description || null, image]
    );

    const categoryId = (result as any).insertId;

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      id: categoryId
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    // Verificar se a categoria existe
    const [currentCategories] = await db.execute<RowDataPacket[]>(
      'SELECT image FROM categories WHERE id = ?',
      [id]
    );

    const currentCategory = (currentCategories as any[])[0];

    if (!currentCategory) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Verificar se o slug já existe em outra categoria
    const [existingCategory] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM categories WHERE slug = ? AND id != ?',
      [slug, id]
    );

    if ((existingCategory as any[]).length > 0) {
      return res.status(400).json({ message: 'Slug já existe' });
    }

    let updateQuery = 'UPDATE categories SET name = ?, slug = ?, description = ?';
    let params = [name, slug, description || null];

    // Se uma nova imagem foi enviada
    if (req.file) {
      updateQuery += ', image = ?';
      params.push(req.file.filename);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.execute<OkPacket>(updateQuery, params);

    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se a categoria existe
    const [categories] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    );

    if ((categories as any[]).length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Soft delete - marcar como inativa
    await db.execute<OkPacket>(
      'UPDATE categories SET is_active = 0 WHERE id = ?',
      [id]
    );

    res.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

