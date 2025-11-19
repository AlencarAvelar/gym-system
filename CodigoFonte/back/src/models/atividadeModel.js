const pool = require('../config/database');

class AtividadeModel {
  // Criar nova atividade
  static async create(atividade) {
    const { nome_atividade, tipo_atividade, descricao, duracao, capacidade_max, id_profissional } = atividade;
    
    const query = `
      INSERT INTO atividade (nome_atividade, tipo_atividade, descricao, duracao, capacidade_max, id_profissional)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const values = [nome_atividade, tipo_atividade, descricao, duracao, capacidade_max, id_profissional];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as atividades
  static async findAll() {
    const query = `
      SELECT a.*, u.nome as nome_profissional
      FROM atividade a
      INNER JOIN usuario u ON a.id_profissional = u.id_usuario
      ORDER BY a.id_atividade DESC;
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar atividade por ID
  static async findById(id) {
    const query = `
      SELECT a.*, u.nome as nome_profissional
      FROM atividade a
      INNER JOIN usuario u ON a.id_profissional = u.id_usuario
      WHERE a.id_atividade = $1;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar atividades por profissional
  static async findByProfissional(idProfissional) {
    const query = `
      SELECT a.*, u.nome as nome_profissional
      FROM atividade a
      INNER JOIN usuario u ON a.id_profissional = u.id_usuario
      WHERE a.id_profissional = $1
      ORDER BY a.id_atividade DESC;
    `;
    
    try {
      const result = await pool.query(query, [idProfissional]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar atividade
  static async update(id, atividade) {
    const { nome_atividade, tipo_atividade, descricao, duracao, capacidade_max } = atividade;
    
    const query = `
      UPDATE atividade
      SET nome_atividade = $1, tipo_atividade = $2, descricao = $3, duracao = $4, capacidade_max = $5
      WHERE id_atividade = $6
      RETURNING *;
    `;
    
    const values = [nome_atividade, tipo_atividade, descricao, duracao, capacidade_max, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Deletar atividade
  static async delete(id) {
    // Primeiro verifica se há agendamentos vinculados
    const checkQuery = `
      SELECT COUNT(*) as total FROM agendamento 
      WHERE id_atividade = $1 AND status = 'Ativo';
    `;
    
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (parseInt(checkResult.rows[0].total) > 0) {
      throw new Error('Não é possível excluir atividade com agendamentos vinculados!');
    }
    
    const deleteQuery = `DELETE FROM atividade WHERE id_atividade = $1 RETURNING *;`;
    
    try {
      const result = await pool.query(deleteQuery, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar atividades disponíveis (com vagas)
  static async findAvailable() {
    const query = `
      SELECT a.*, u.nome as nome_profissional,
        (a.capacidade_max - COALESCE(
          (SELECT COUNT(*) FROM agendamento ag 
           WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo'), 0
        )) as vagas_disponiveis
      FROM atividade a
      INNER JOIN usuario u ON a.id_profissional = u.id_usuario
      HAVING vagas_disponiveis > 0
      ORDER BY a.id_atividade DESC;
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AtividadeModel;
