import { Router } from 'express';
import { db } from '../config/database';
import { RowDataPacket, FieldPacket } from 'mysql2';

const router = Router();

// Rota pública para buscar banners ativos
router.get('/banners', async (req, res) => {
  try {
    const [banners] = await db.execute<RowDataPacket[]>(`
      SELECT id, title, image, link, order_position 
      FROM banners 
      WHERE is_active = 1 
      ORDER BY order_position ASC, created_at DESC
    `) as [RowDataPacket[], FieldPacket[]];

    res.json(banners);
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota pública para buscar configurações do site (logo, etc)
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await db.execute<RowDataPacket[]>('SELECT * FROM site_settings') as [RowDataPacket[], FieldPacket[]];
    
    const settingsObj: any = {};
    (settings).forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota pública para buscar categorias ativas
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute<RowDataPacket[]>(`
      SELECT * FROM categories 
      WHERE is_active = 1 
      ORDER BY name ASC
    `) as [RowDataPacket[], FieldPacket[]];

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota pública para buscar produtos ativos
router.get('/products', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1
    `;
    const params: any[] = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), offset);

    const [products] = await db.execute<RowDataPacket[]>(query, params) as [RowDataPacket[], FieldPacket[]];

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = 1';
    const countParams: any[] = [];

    if (category) {
      countQuery += ' AND category_id = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.execute<RowDataPacket[]>(countQuery, countParams) as [RowDataPacket[], FieldPacket[]];
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para seções de produtos na home
router.get('/home-sections', async (req, res) => {
  try {
    const [sections] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM home_sections WHERE is_active = 1 ORDER BY order_position ASC`
    ) as [RowDataPacket[], FieldPacket[]];

    const homeSections = await Promise.all(sections.map(async (section) => {
      let products: RowDataPacket[] = [];
      if (section.type === 'category' && section.category_id) {
        const result = await db.execute<RowDataPacket[]>(
          `SELECT p.*, c.name as category_name, c.slug as category_slug 
           FROM products p 
           LEFT JOIN categories c ON p.category_id = c.id 
           WHERE p.category_id = ? AND p.is_active = 1 
           ORDER BY p.created_at DESC`,
          [section.category_id]
        ) as [RowDataPacket[], FieldPacket[]];
        products = result[0];
      } else if (section.type === 'custom' && section.product_ids) {
        let productIds;
        try {
          productIds = JSON.parse(section.product_ids);
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          console.error(`Erro ao parsear product_ids para seção ${section.id}: ${errorMessage}`);
          productIds = [];
        }
        if (Array.isArray(productIds) && productIds.length > 0) {
          const result = await db.execute<RowDataPacket[]>(
            `SELECT p.*, c.name as category_name, c.slug as category_slug 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.id IN (?) AND p.is_active = 1 
             ORDER BY FIELD(p.id, ?)`,
            [productIds, productIds]
          ) as [RowDataPacket[], FieldPacket[]];
        products = result[0];
        }
      } else {
        const result = await db.execute<RowDataPacket[]>(
          `SELECT p.*, c.name as category_name, c.slug as category_slug 
           FROM products p 
           LEFT JOIN categories c ON p.category_id = c.id 
           WHERE p.is_active = 1 
           ORDER BY p.created_at DESC`
        ) as [RowDataPacket[], FieldPacket[]];
        products = result[0];
      }
      return {
        id: section.id,
        title: section.title,
        products
      };
    }));

    res.json(homeSections);
  } catch (error) {
    console.error('Erro ao buscar seções da home:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para produtos em destaque baseada nas configurações
router.get('/featured-products', async (req, res) => {
  try {
    const [settingsRows] = await db.execute<RowDataPacket[]>('SELECT * FROM site_settings') as [RowDataPacket[], FieldPacket[]];
    
    const settingsObj: any = {};
    settingsRows.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    const type = settingsObj.home_display_type || 'default';
    const title = settingsObj.home_display_title || 'Produtos em Destaque';
    const categoryId = settingsObj.home_display_category_id;
    const productIdsStr = settingsObj.home_display_product_ids;

    let products: RowDataPacket[] = [];

    if (type === 'category' && categoryId) {
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT p.*, c.name as category_name, c.slug as category_slug 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.category_id = ? AND p.is_active = 1 
         ORDER BY p.created_at DESC`,
        [categoryId]
      ) as [RowDataPacket[], FieldPacket[]];
      products = rows;
    } else if (type === 'custom' && productIdsStr) {
      let productIds;
      try {
        productIds = JSON.parse(productIdsStr);
      } catch (e) {
        console.error('Erro ao parsear product_ids:', e);
        productIds = [];
      }
      if (productIds.length > 0) {
        const [rows] = await db.execute<RowDataPacket[]>(
          `SELECT p.*, c.name as category_name, c.slug as category_slug 
           FROM products p 
           LEFT JOIN categories c ON p.category_id = c.id 
           WHERE p.id IN (?) AND p.is_active = 1 
           ORDER BY FIELD(p.id, ?)`,
          [productIds, productIds]
        ) as [RowDataPacket[], FieldPacket[]];
        products = rows;
      }
    }

    // Fallback to default if no products found
    if (products.length === 0) {
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT p.*, c.name as category_name, c.slug as category_slug 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.is_active = 1 
         ORDER BY p.created_at DESC`
      ) as [RowDataPacket[], FieldPacket[]];
      products = rows;
    }

    res.json({ title, products });
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;