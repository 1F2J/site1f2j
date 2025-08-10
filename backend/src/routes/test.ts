import { Router } from 'express';
import { db } from '../config/database';

const router = Router();

router.get('/products-simple', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products LIMIT 5');
    res.json(products);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: String(error) });
  }
});

export default router;

