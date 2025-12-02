const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UsuarioModel {
  /**
   * Buscar usuário por email para login
   */
  static async findByEmail(email) {
    const query = `
      SELECT 
        id_usuario, 
        nome, 
        email, 
        senha, 
        tipo_usuario
      FROM usuario 
      WHERE email = $1;
    `;
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  /**
   * Buscar usuário por ID (para middleware de proteção)
   */
  static async findById(id) {
    const query = `
      SELECT 
        id_usuario, 
        nome, 
        email, 
        tipo_usuario
      FROM usuario 
      WHERE id_usuario = $1;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  /**
   * Criar novo usuário (cadastro)
   */
  static async create(usuarioData) {
    const { nome, email, senha, tipo_usuario } = usuarioData;
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const query = `
      INSERT INTO usuario (nome, email, senha, tipo_usuario)
      VALUES ($1, $2, $3, $4)
      RETURNING id_usuario, nome, email, tipo_usuario;
    `;
    
    const values = [nome, email, senhaHash, tipo_usuario];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      // Tratamento específico para email duplicado
      if (error.code === '23505') {
        if (error.constraint === 'usuario_email_key') {
          throw new Error('Email já está cadastrado');
        }
      }
      
      throw error;
    }
  }

  /**
   * Listar usuários por tipo (para admin)
   */
  static async findByTipo(tipo) {
    const query = `
      SELECT 
        id_usuario, 
        nome, 
        email, 
        tipo_usuario,
        (SELECT COUNT(*) FROM agendamento ag 
         WHERE ag.id_cliente = u.id_usuario AND ag.status = 'Ativo') as total_agendamentos
      FROM usuario u
      WHERE tipo_usuario = $1
      ORDER BY nome;
    `;
    
    try {
      const result = await pool.query(query, [tipo]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao listar usuários por tipo:', error);
      throw error;
    }
  }

  /**
   * Atualizar usuário (perfil)
   */
  static async update(id, usuarioData) {
    const { nome, email } = usuarioData;
    
    const query = `
      UPDATE usuario
      SET nome = $1, email = $2
      WHERE id_usuario = $3
      RETURNING id_usuario, nome, email, tipo_usuario;
    `;
    
    const values = [nome, email, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      // Tratamento para email duplicado
      if (error.code === '23505' && error.constraint === 'usuario_email_key') {
        throw new Error('Email já está sendo usado por outro usuário');
      }
      
      throw error;
    }
  }

  /**
   * Verificar se email já existe
   */
  static async emailExists(email) {
    const query = `SELECT COUNT(*) as total FROM usuario WHERE email = $1`;
    
    try {
      const result = await pool.query(query, [email]);
      return parseInt(result.rows[0].total) > 0;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }
}

module.exports = UsuarioModel;
