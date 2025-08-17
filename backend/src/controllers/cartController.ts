import { Request, Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const [cart] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    );

    let cartId = cart[0]?.id;
    if (!cartId) {
      const [result] = await db.execute<OkPacket>(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
      );
      cartId = result.insertId;
    }

    const [items] = await db.execute<RowDataPacket[]>(
      `SELECT ci.*, p.name, p.price, p.images
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    res.json({ items });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const { product_id, quantity = 1, options } = req.body;

    const [cart] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    );

    let cartId = cart[0]?.id;
    if (!cartId) {
      const [result] = await db.execute<OkPacket>(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
      );
      cartId = result.insertId;
    }

    await db.execute(
      `INSERT INTO cart_items (cart_id, product_id, quantity, options)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [cartId, product_id, quantity, JSON.stringify(options || {})]
    );

    res.status(201).json({ message: 'Produto adicionado ao carrinho' });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const [updated] = await db.execute<OkPacket>(
      `UPDATE cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       SET ci.quantity = ?
       WHERE ci.id = ? AND c.user_id = ?`,
      [quantity, id, userId]
    );

    if (updated.affectedRows === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.json({ message: 'Item atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const [deleted] = await db.execute<OkPacket>(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [id, userId]
    );

    if (deleted.affectedRows === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.json({ message: 'Item removido' });
  } catch (error) {
    console.error('Erro ao remover item:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const { payment_method, address_data } = req.body;
    if (!payment_method) return res.status(400).json({ message: 'Método de pagamento não selecionado' });
    if (!address_data || !address_data.cep || !address_data.street) {
      return res.status(400).json({ message: 'Dados do endereço incompletos' });
    }

    // Iniciar transação
    await db.beginTransaction();

    try {
      // Buscar carrinho
      const [cart] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );
      const cartId = cart[0]?.id;
      if (!cartId) {
        await db.rollback();
        return res.status(400).json({ message: 'Carrinho vazio' });
      }

      // Buscar itens do carrinho com informações do produto
      const [items] = await db.execute<RowDataPacket[]>(
        `SELECT ci.*, p.price, p.name, p.stock
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = ?`,
        [cartId]
      );

      if (items.length === 0) {
        await db.rollback();
        return res.status(400).json({ message: 'Carrinho vazio' });
      }

      // Verificar estoque
      for (const item of items) {
        if (item.quantity > item.stock) {
          await db.rollback();
          return res.status(400).json({
            message: `Produto ${item.name} não possui estoque suficiente`
          });
        }
      }

      // Calcular total
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = 0; // Implementar cálculo de frete
      const total = subtotal + shipping;

      // Criar pedido
      const [orderResult] = await db.execute<OkPacket>(
        `INSERT INTO orders (
          user_id,
          status,
          total_amount,
          payment_method,
          payment_status,
          shipping_address
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'pending', total, payment_method, 'pending', JSON.stringify(address_data)]
      );
      const orderId = orderResult.insertId;

      // Inserir itens do pedido
      for (const item of items) {
        await db.execute(
          `INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            unit_price,
            selected_options
          ) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price, item.options]
        );

        // Atualizar estoque
        await db.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Limpar carrinho
      await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

      // Confirmar transação
      await db.commit();

      res.status(201).json({
        message: 'Pedido criado com sucesso',
        orderId,
        total
      });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Erro ao finalizar compra:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};