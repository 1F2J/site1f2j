import { Request, Response } from 'express';
import { preferenceClient, paymentClient } from '../config/mercadopago';
import { db } from '../config/database';
import { RowDataPacket } from 'mysql2';

// Criar uma preferência de pagamento
export const createPreference = async (req: Request, res: Response) => {
  try {
    const { orderId, address } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório.' });
    }

    try {
      // Buscar informações do pedido
      const [orderRows] = await db.execute<RowDataPacket[]>(
        `SELECT o.*, u.email as user_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );

      const order = orderRows[0];
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      // Adicionar informações de endereço ao pedido
      await db.execute(
        'UPDATE orders SET shipping_address = ? WHERE id = ?',
        [JSON.stringify(address), orderId]
      );

      // Buscar itens do pedido
      const [itemRows] = await db.execute<RowDataPacket[]>(
        `SELECT oi.*, p.name as title
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      if (!itemRows.length) {
        return res.status(400).json({ error: 'Pedido não possui itens.' });
      }

      const preference = await preferenceClient.create({
      body: {
        items: itemRows.map(item => ({
          id: item.id.toString(),
          title: item.title,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price),
          currency_id: 'BRL'
        })),
        external_reference: orderId.toString(),
        payer: {
          email: order.user_email
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/pending`
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/payments/webhook`
      }
    });

      // Atualizar pedido com ID da preferência
      await db.execute(
        'UPDATE orders SET payment_preference_id = ? WHERE id = ?',
        [preference.id, orderId]
      );

      return res.json({
        id: preference.id,
        init_point: preference.init_point
      });
    } catch (dbError) {
      console.error('Erro ao processar pedido no banco:', dbError);
      return res.status(500).json({ error: 'Erro ao processar pedido no banco de dados.' });
    }
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return res.status(500).json({ error: 'Erro ao criar preferência de pagamento.' });
  }
};

// Buscar status de um pagamento pelo ID
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await paymentClient.get({ id });
    const orderId = payment.external_reference;

    // Atualizar status do pagamento no banco
    await db.execute(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [payment.status, orderId]
    );

    return res.json({
      id: payment.id,
      status: payment.status,
      external_reference: orderId
    });
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    return res.status(500).json({ error: 'Erro ao buscar pagamento.' });
  }
};

// Webhook para receber notificações do Mercado Pago
export const webhook = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = await paymentClient.get({ id: data.id });
      const orderId = payment.external_reference;

      // Atualizar status do pagamento no banco
      await db.execute(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        [payment.status, orderId]
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.sendStatus(500);
  }
};

// Processar pagamento com cartão
export const processCardPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, cardData } = req.body;

    if (!orderId || !cardData) {
      return res.status(400).json({ error: 'Dados do cartão e ID do pedido são obrigatórios.' });
    }

    try {
      // Buscar informações do pedido
      const [orderRows] = await db.execute<RowDataPacket[]>(
        `SELECT o.*, u.email as user_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );

      const order = orderRows[0];
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      // Criar pagamento com cartão
      const payment = await paymentClient.create({
        body: {
          transaction_amount: parseFloat(order.total_amount),
          description: `Pedido #${orderId}`,
          payment_method_id: cardData.payment_method.id,
          token: cardData.token,
          installments: cardData.installments,
          payer: {
            email: order.user_email,
            identification: {
              type: cardData.payer.identification.type,
              number: cardData.payer.identification.number
            }
          }
        }
      });

      // Atualizar status do pagamento no pedido
      await db.execute(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        [payment.status, orderId]
      );

      return res.json({
        status: payment.status,
        detail: payment.status_detail
      });
    } catch (dbError) {
      console.error('Erro ao processar pagamento no banco:', dbError);
      return res.status(500).json({ error: 'Erro ao processar pagamento no banco de dados.' });
    }
  } catch (error) {
    console.error('Erro ao processar pagamento com cartão:', error);
    return res.status(500).json({ error: 'Erro ao processar pagamento com cartão.' });
  }
};
