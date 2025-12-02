const pool = require('../config/database');

class AtividadeModel {
  /**
     * Listar todas as atividades (Com nome do profissional)
     */
  static async findAll() {
    const query = `
      SELECT 
        a.id_atividade,
        a.nome_atividade,
        a.tipo_atividade,
        a.descricao,
        a.duracao,
        a.capacidade_max,
        a.id_profissional,
        u.nome as nome_profissional, -- AQUI ESTÁ A MÁGICA
        (SELECT COUNT(*) FROM agendamento ag 
         WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo') as agendamentos_ativos,
        (a.capacidade_max - COALESCE((SELECT COUNT(*) FROM agendamento ag 
         WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo'), 0)) as vagas_disponiveis
      FROM atividade a
      LEFT JOIN usuario u ON a.id_profissional = u.id_usuario -- CRUZAMENTO COM USUÁRIO
      ORDER BY a.nome_atividade;
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      throw error;
    }
  }

  /**
   * Listar atividades disponíveis (com vagas)
   */
  static async findAvailable() {
    const query = `
      SELECT 
        id_atividade,
        nome_atividade,
        tipo_atividade,
        descricao,
        duracao,
        capacidade_max,
        id_profissional,
        u.nome as nome_profissional,
        (SELECT COUNT(*) FROM agendamento ag 
         WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo') as agendamentos_ativos,
        (capacidade_max - COALESCE((SELECT COUNT(*) FROM agendamento ag 
         WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo'), 0)) as vagas_disponiveis
      FROM atividade a
      INNER JOIN usuario u ON a.id_profissional = u.id_usuario
      WHERE (capacidade_max - COALESCE((SELECT COUNT(*) FROM agendamento ag 
        WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo'), 0)) > 0
      ORDER BY nome_atividade;
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao listar atividades disponíveis:', error);
      throw error;
    }
  }

  /**
   * Criar nova atividade
   */
  static async create(atividade) {
    const {
      nome_atividade,
      tipo_atividade,
      descricao,
      duracao,
      capacidade_max,
      id_profissional
    } = atividade;

    const query = `
      INSERT INTO atividade (
        nome_atividade, 
        tipo_atividade, 
        descricao, 
        duracao, 
        capacidade_max, 
        id_profissional
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      nome_atividade,
      tipo_atividade,
      descricao,
      duracao,
      capacidade_max,
      id_profissional
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      throw error;
    }
  }

  /**
   * Buscar por ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        a.*,
        u.nome as nome_profissional,
        u.email as email_profissional
      FROM atividade a
      LEFT JOIN usuario u ON a.id_profissional = u.id_usuario
      WHERE a.id_atividade = $1;
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar atividade por ID:', error);
      throw error;
    }
  }

  /**
   * Atualizar atividade
   */
  /**
     * Atualizar atividade
     */
  static async update(id, atividadeData) {
    const {
      nome_atividade,
      tipo_atividade,
      descricao,
      duracao,
      capacidade_max,
      id_profissional // <--- NOVO: Extraímos o ID daqui
    } = atividadeData;

    // CORREÇÃO: Adicionamos id_profissional = $6 no SQL
    const query = `
      UPDATE atividade
      SET 
        nome_atividade = $1,
        tipo_atividade = $2,
        descricao = $3,
        duracao = $4,
        capacidade_max = $5,
        id_profissional = $6
      WHERE id_atividade = $7
      RETURNING *;
    `;

    // CORREÇÃO: Adicionamos o valor no array e mudamos o ID para a posição 7
    const values = [
      nome_atividade,
      tipo_atividade,
      descricao,
      duracao,
      capacidade_max,
      id_profissional,
      id
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      throw error;
    }
  }

  /**
   * Buscar por profissional
   */
  static async findByProfissional(idProfissional) {
    const query = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM agendamento ag 
         WHERE ag.id_atividade = a.id_atividade AND ag.status = 'Ativo') as agendamentos_ativos
      FROM atividade a
      WHERE a.id_profissional = $1
      ORDER BY a.nome_atividade;
    `;

    try {
      const result = await pool.query(query, [idProfissional]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar atividades por profissional:', error);
      throw error;
    }
  }

  /**
   * Deletar atividade
   */
  static async delete(id) {
    const query = `DELETE FROM atividade WHERE id_atividade = $1`;

    try {
      const result = await pool.query(query, [id]);
      return result;
    } catch (error) {
      console.error('Erro ao deletar atividade:', error);
      throw error;
    }
  }
}

module.exports = AtividadeModel;
