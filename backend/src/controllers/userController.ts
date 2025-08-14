import { Response } from 'express';
import { db } from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { RowDataPacket, OkPacket } from 'mysql2';
import bcrypt from 'bcrypt';

// Buscar perfil do usuário
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const [users] = await db.execute<RowDataPacket[]>(
      `SELECT id, name, email, phone, marketing_consent, data_usage_consent, 
       terms_accepted, privacy_accepted, terms_version, privacy_version
       FROM users WHERE id = ? AND account_status != 'deleted'`,
      [userId]
    );

    if (!users[0]) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = users[0];
    delete user.password_hash;

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar perfil do usuário
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const { name, email, phone, current_password, new_password } = req.body;

    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const [existingUsers] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existingUsers[0]) {
        return res.status(400).json({ message: 'Este e-mail já está em uso' });
      }
    }

    // Se estiver alterando a senha, verificar a senha atual
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ message: 'Senha atual é obrigatória para alterar a senha' });
      }

      const [users] = await db.execute<RowDataPacket[]>(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );

      const isValidPassword = await bcrypt.compare(current_password, users[0].password_hash);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Senha atual incorreta' });
      }
    }

    // Construir query de atualização
    let updateFields = [];
    let params = [];

    if (name) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      params.push(email);
    }
    if (phone) {
      updateFields.push('phone = ?');
      params.push(phone);
    }
    if (new_password) {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updateFields.push('password_hash = ?');
      params.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    params.push(userId);
    await db.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Buscar endereços do usuário
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const [addresses] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM user_addresses WHERE user_id = ?',
      [userId]
    );

    res.json(addresses);
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Adicionar novo endereço
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const {
      type,
      is_default,
      recipient_name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      postal_code: zip_code // Renomeando postal_code para zip_code
    } = req.body;

    // Se for endereço padrão, remover o padrão dos outros endereços do mesmo tipo
    if (is_default) {
      await db.execute(
        'UPDATE user_addresses SET is_default = 0 WHERE user_id = ? AND type = ?',
        [userId, type]
      );
    }

    const [result] = await db.execute<OkPacket>(
      `INSERT INTO user_addresses (
        user_id, type, is_default, recipient_name, street, number,
        complement, neighborhood, city, state, zip_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, type, is_default, recipient_name, street, number, complement,
       neighborhood, city, state, zip_code]
    );

    res.status(201).json({
      message: 'Endereço adicionado com sucesso',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar endereço
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const addressId = req.params.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const {
      type,
      is_default,
      recipient_name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      postal_code: zip_code // Renomeando postal_code para zip_code
    } = req.body;

    // Verificar se o endereço pertence ao usuário
    const [addresses] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    if (!addresses[0]) {
      return res.status(404).json({ message: 'Endereço não encontrado' });
    }

    // Se for endereço padrão, remover o padrão dos outros endereços do mesmo tipo
    if (is_default) {
      await db.execute(
        'UPDATE user_addresses SET is_default = 0 WHERE user_id = ? AND type = ? AND id != ?',
        [userId, type, addressId]
      );
    }

    await db.execute(
      `UPDATE user_addresses SET
        type = ?, is_default = ?, recipient_name = ?, street = ?,
        number = ?, complement = ?, neighborhood = ?, city = ?,
        state = ?, zip_code = ?
       WHERE id = ? AND user_id = ?`,
      [type, is_default, recipient_name, street, number, complement,
       neighborhood, city, state, zip_code, addressId, userId]
    );

    res.json({ message: 'Endereço atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Excluir endereço
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const addressId = req.params.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const [result] = await db.execute<OkPacket>(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Endereço não encontrado' });
    }

    res.json({ message: 'Endereço excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir endereço:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar consentimentos LGPD
export const updateConsents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    const { marketing_consent, data_usage_consent } = req.body;
    const ip_address = req.ip;
    const user_agent = req.headers['user-agent'];

    // Atualizar consentimentos
    await db.execute(
      `UPDATE users SET
        marketing_consent = ?,
        data_usage_consent = ?
       WHERE id = ?`,
      [marketing_consent, data_usage_consent, userId]
    );

    // Registrar alterações no log
    if (marketing_consent !== undefined) {
      await db.execute(
        `INSERT INTO user_consent_log (
          user_id, consent_type, consent_value, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?)`,
        [userId, 'marketing', marketing_consent, ip_address, user_agent]
      );
    }

    if (data_usage_consent !== undefined) {
      await db.execute(
        `INSERT INTO user_consent_log (
          user_id, consent_type, consent_value, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?)`,
        [userId, 'data_usage', data_usage_consent, ip_address, user_agent]
      );
    }

    res.json({ message: 'Consentimentos atualizados com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar consentimentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Solicitar exclusão da conta
export const requestAccountDeletion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuário não autenticado' });

    // Registrar solicitação de exclusão
    await db.execute(
      `UPDATE users SET
        account_status = 'deleted',
        deleted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userId]
    );

    // Anonimizar dados pessoais
    await db.execute(
      `UPDATE users SET
        name = 'Usuário Removido',
        email = ?,
        phone = NULL,
        cpf_hash = NULL
       WHERE id = ?`,
      [`deleted_${userId}@deleted.com`, userId]
    );

    res.json({ message: 'Solicitação de exclusão processada com sucesso' });
  } catch (error) {
    console.error('Erro ao processar solicitação de exclusão:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};