import { Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { deleteFile } from '../utils/upload';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Estatísticas básicas do dashboard com crescimento
    const [productsCount] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM products WHERE is_active = 1'
    );
    const [productsLastMonth] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM products WHERE is_active = 1 AND created_at < ?',
      [firstDayOfMonth]
    );

    const [ordersCount] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count, SUM(total) as revenue FROM orders WHERE created_at >= ?',
      [firstDayOfMonth]
    );
    const [ordersLastMonth] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count, SUM(total) as revenue FROM orders WHERE created_at >= ? AND created_at < ?',
      [lastMonthStart, lastMonthEnd]
    );

    const [usersCount] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= ?',
      [firstDayOfMonth]
    );
    const [usersLastMonth] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= ? AND created_at < ?',
      [lastMonthStart, lastMonthEnd]
    );

    // Calcular crescimento
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return 100;
      return ((current - previous) / previous) * 100;
    };

    const currentProducts = (productsCount as any[])[0].count;
    const lastMonthProducts = (productsLastMonth as any[])[0].count;
    const productsGrowth = calculateGrowth(currentProducts, lastMonthProducts);

    const currentOrders = (ordersCount as any[])[0].count;
    const lastMonthOrders = (ordersLastMonth as any[])[0].count;
    const ordersGrowth = calculateGrowth(currentOrders, lastMonthOrders);

    const currentRevenue = (ordersCount as any[])[0].revenue || 0;
    const lastMonthRevenue = (ordersLastMonth as any[])[0].revenue || 0;
    const revenueGrowth = calculateGrowth(currentRevenue, lastMonthRevenue);

    const currentUsers = (usersCount as any[])[0].count;
    const lastMonthUsers = (usersLastMonth as any[])[0].count;
    const usersGrowth = calculateGrowth(currentUsers, lastMonthUsers);

    res.json({
      stats: {
        products: {
          total: currentProducts,
          growth: productsGrowth.toFixed(1)
        },
        orders: {
          total: currentOrders,
          growth: ordersGrowth.toFixed(1)
        },
        revenue: {
          total: currentRevenue,
          growth: revenueGrowth.toFixed(1)
        },
        users: {
          total: currentUsers,
          growth: usersGrowth.toFixed(1)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { page: pageStr = '1', limit: limitStr = '10', search = '' } = req.query;
    const parsedPage = parseInt(pageStr as string, 10);
    const pageNum = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const parsedLimit = parseInt(limitStr as string, 10);
    const limitNum = isNaN(parsedLimit) ? 10 : Math.max(1, parsedLimit);
    const offsetNum = (pageNum - 1) * limitNum;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ${limitNum} OFFSET ${offsetNum}`;

    const [products] = await db.execute<RowDataPacket[]>(query, params);

    // Contar total para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
    const countParams: any[] = [];

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.execute<RowDataPacket[]>(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const [categories] = await db.execute(`
      SELECT c.*, COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), offset);

    const [orders] = await db.execute<RowDataPacket[]>(query, params);

    // Contar total para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM orders o WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' AND o.status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.execute<RowDataPacket[]>(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['novo', 'producao', 'enviado', 'concluido', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    await db.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Status do pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getSiteSettings = async (req: AuthRequest, res: Response) => {
  try {
    const [settings] = await db.execute('SELECT * FROM site_settings');
    
    const settingsObj: any = {};
    (settings as any[]).forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Erro ao buscar configurações do site:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateSiteLogo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    // Buscar logo atual para deletar
    const [currentSettings] = await db.execute(
      'SELECT setting_value FROM site_settings WHERE setting_key = ?',
      ['site_logo']
    );

    const currentLogo = (currentSettings as any[])[0]?.setting_value;

    // Atualizar logo no banco
    const newLogoPath = `/uploads/${req.file.filename}`;
    
    await db.execute(
      'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
      [newLogoPath, 'site_logo']
    );

    // Deletar logo anterior se existir
    if (currentLogo && currentLogo !== '/uploads/logo.png') {
      const filename = currentLogo.replace('/uploads/', '');
      deleteFile(filename);
    }

    res.json({ 
      message: 'Logo atualizado com sucesso',
      logoPath: newLogoPath
    });
  } catch (error) {
    console.error('Erro ao atualizar logo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// CRUD para Produtos (Admin)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, promo_price, is_promo, stock, category_id, options, is_active = 1 } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImage = files['main_image']?.[0] ? `/uploadprod/${files['main_image'][0].filename}` : null;
    const secondaryImages = files['secondary_images'] ? JSON.stringify(files['secondary_images'].map(f => `/uploadprod/${f.filename}`)) : '[]';
    const optionsJson = options ? JSON.stringify(options) : '{}';

    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, promo_price, is_promo, stock, category_id, main_image, secondary_images, options, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, promo_price || null, is_promo || 0, stock || 0, category_id || null, mainImage, secondaryImages, optionsJson, is_active]
    );

    res.status(201).json({ message: 'Produto criado com sucesso', id: (result as any).insertId });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, promo_price, is_promo, stock, category_id, options, is_active } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Buscar produto atual
    const [currentProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if ((currentProduct as any[]).length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    const current = (currentProduct as any[])[0];

    // Processar main_image
    let mainImage = current.main_image;
    if (files['main_image']?.[0]) {
      if (mainImage) deleteFile(mainImage.replace('/uploadprod/', ''));
      mainImage = `/uploadprod/${files['main_image'][0].filename}`;
    }

    // Processar secondary_images
    let secondaryImages = current.secondary_images ? JSON.parse(current.secondary_images) : [];
    if (files['secondary_images'] && files['secondary_images'].length > 0) {
      // Deletar antigas
      secondaryImages.forEach((img: string) => deleteFile(img.replace('/uploadprod/', '')));
      // Novas
      secondaryImages = files['secondary_images'].map(f => `/uploadprod/${f.filename}`);
    }
    const secondaryJson = JSON.stringify(secondaryImages);

    const optionsJson = options ? JSON.stringify(options) : current.options;

    await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, promo_price = ?, is_promo = ?, stock = ?, category_id = ?, main_image = ?, secondary_images = ?, options = ?, is_active = ? WHERE id = ?',
      [name, description, price, promo_price ?? current.promo_price, is_promo ?? current.is_promo, stock ?? current.stock, category_id ?? current.category_id, mainImage, secondaryJson, optionsJson, is_active ?? current.is_active, id]
    );

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [product] = await db.execute('SELECT main_image, secondary_images FROM products WHERE id = ?', [id]);
    if ((product as any[]).length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    const productData = (product as any[])[0];

    await db.execute('DELETE FROM products WHERE id = ?', [id]);

    // Deletar main_image
    if (productData.main_image) deleteFile(productData.main_image.replace('/uploadprod/', ''));

    // Deletar secondary_images
    let secondary: string[] = [];
    try { secondary = JSON.parse(productData.secondary_images || '[]'); } catch {}
    secondary.forEach(img => deleteFile(img.replace('/uploadprod/', '')));

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// CRUD para Categorias (Admin)
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, is_active = 1 } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const [result] = await db.execute(
      'INSERT INTO categories (name, slug, description, is_active) VALUES (?, ?, ?, ?)',
      [name, slug, description, is_active]
    );

    res.status(201).json({ 
      message: 'Categoria criada com sucesso',
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    await db.execute(
      'UPDATE categories SET name = ?, slug = ?, description = ?, is_active = ? WHERE id = ?',
      [name, slug, description, is_active, id]
    );

    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se existem produtos associados
    const [products] = await db.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if ((products as any[])[0].count > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir categoria com produtos associados' 
      });
    }

    await db.execute('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// CRUD para Banners (Admin)
export const getBanners = async (req: AuthRequest, res: Response) => {
  try {
    const [banners] = await db.execute(`
      SELECT * FROM banners 
      ORDER BY order_position ASC, created_at DESC
    `);

    res.json(banners);
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const uploadBanners = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    const insertPromises = files.map(async (file, index) => {
      // Buscar a maior ordem atual
      const [maxOrder] = await db.execute(
        'SELECT MAX(order_position) as max_order FROM banners'
      );
      const nextOrder = ((maxOrder as any[])[0].max_order || 0) + index + 1;

      return db.execute(`
        INSERT INTO banners (title, image, order_position, is_active) 
        VALUES (?, ?, ?, ?)
      `, [
        file.originalname.split('.')[0], // Usar nome do arquivo como título
        `/uploads/${file.filename}`,
        nextOrder,
        1 // Ativo por padrão
      ]);
    });

    await Promise.all(insertPromises);

    res.json({ 
      message: `${files.length} banner(s) enviado(s) com sucesso`,
      count: files.length 
    });
  } catch (error) {
    console.error('Erro ao enviar banners:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const toggleBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await db.execute(
      'UPDATE banners SET is_active = ? WHERE id = ?',
      [is_active ? 1 : 0, id]
    );

    res.json({ message: 'Status do banner atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do banner:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar banner para deletar arquivo
    const [banner] = await db.execute(
      'SELECT image FROM banners WHERE id = ?',
      [id]
    );

    if ((banner as any[]).length === 0) {
      return res.status(404).json({ message: 'Banner não encontrado' });
    }

    const bannerData = (banner as any[])[0];
    
    // Deletar arquivo físico
    if (bannerData.image) {
      const filename = bannerData.image.replace('/uploads/', '');
      deleteFile(filename);
    }

    // Deletar do banco
    await db.execute('DELETE FROM banners WHERE id = ?', [id]);

    res.json({ message: 'Banner excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir banner:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateHomeDisplay = async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, categoryId, productIds } = req.body;
    await db.execute('REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)', ['home_display_type', type]);
    await db.execute('REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)', ['home_display_title', title]);
    if (type === 'category') {
      await db.execute('REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)', ['home_display_category_id', categoryId]);
    } else if (type === 'custom') {
      await db.execute('REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)', ['home_display_product_ids', JSON.stringify(productIds)]);
    }
    res.json({ message: 'Configurações de exibição na home atualizadas' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getHomeSections = async (req: AuthRequest, res: Response) => {
  try {
    const [sections] = await db.execute(`
      SELECT * FROM home_sections 
      ORDER BY order_position ASC, created_at DESC
    `);

    res.json(sections);
  } catch (error) {
    console.error('Erro ao buscar seções da home:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const createHomeSection = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, category_id, product_ids } = req.body;
    const productIdsJson = product_ids ? JSON.stringify(product_ids) : null;

    const [maxOrder] = await db.execute('SELECT MAX(order_position) as max_order FROM home_sections');
    const nextOrder = ((maxOrder as any[])[0].max_order || 0) + 1;

    const [result] = await db.execute(
      'INSERT INTO home_sections (title, type, category_id, product_ids, order_position) VALUES (?, ?, ?, ?, ?)',
      [title, type, category_id || null, productIdsJson, nextOrder]
    );

    res.status(201).json({ 
      message: 'Seção criada com sucesso',
      id: (result as any).insertId 
    });
  } catch (error) {
    console.error('Erro ao criar seção:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateHomeSection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, type, category_id, product_ids, order_position, is_active } = req.body;
    const productIdsJson = product_ids ? JSON.stringify(product_ids) : null;

    await db.execute(
      'UPDATE home_sections SET title = ?, type = ?, category_id = ?, product_ids = ?, order_position = ?, is_active = ? WHERE id = ?',
      [title, type, category_id || null, productIdsJson, order_position, is_active, id]
    );

    res.json({ message: 'Seção atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar seção:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteHomeSection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM home_sections WHERE id = ?', [id]);
    res.json({ message: 'Seção excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir seção:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Analytics - usado pelo dashboard admin
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { range = '30d' } = req.query;
    const daysToSubtract = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Vendas por dia
    const [salesData] = await db.execute<RowDataPacket[]>(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m-%d') as day,
        COUNT(*) as vendas,
        SUM(o.total) as receita
      FROM orders o
      WHERE o.created_at >= ?
      GROUP BY DATE_FORMAT(o.created_at, '%Y-%m-%d')
      ORDER BY day ASC
    `, [startDate]);

    // Vendas por categoria
    const [categoryData] = await db.execute<RowDataPacket[]>(`
      SELECT 
        c.name,
        COUNT(o.id) as value
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= ?
      GROUP BY c.id
      ORDER BY value DESC
    `, [startDate]);

    // Pedidos recentes
    const [recentOrders] = await db.execute<RowDataPacket[]>(`
      SELECT 
        o.id,
        u.name as customer,
        o.total,
        o.status,
        DATE_FORMAT(o.created_at, '%Y-%m-%d') as date
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // Produtos mais vendidos
    const [topProducts] = await db.execute<RowDataPacket[]>(`
      SELECT 
        p.name,
        COUNT(oi.id) as sales,
        SUM(oi.price * oi.quantity) as revenue
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= ?
      GROUP BY p.id
      ORDER BY sales DESC
      LIMIT 5
    `, [startDate]);

    // Receita mensal
    const [monthlyRevenue] = await db.execute<RowDataPacket[]>(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(o.total) as receita,
        COUNT(*) as pedidos
      FROM orders o
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Crescimento de usuários
    const [userGrowth] = await db.execute<RowDataPacket[]>(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as usuarios
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({
      salesData,
      categoryData: categoryData.map((cat: any) => ({
        ...cat,
        color: cat.name === 'Impressão Digital' ? '#EB2590' :
               cat.name === 'Adesivos' ? '#00AFEF' : '#FFF212'
      })),
      recentOrders,
      topProducts,
      monthlyRevenue,
      userGrowth,
      range
    });
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

