const pool = require('../config/database');

class AgendamentoModel {
  /**
   * Criar novo agendamento
   */
  static async create(agendamento) {
    const { id_cliente, id_atividade, data_agendada, horario_agendado } = agendamento;
    
    const query = `
      INSERT INTO agendamento (id_cliente, id_atividade, data_agendada, horario_agendado)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    const values = [id_cliente, id_atividade, data_agendada, horario_agendado];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos os agendamentos de um cliente específico
   */
  static async findByCliente(idCliente) {
    const query = `
      SELECT 
        ag.*,
        at.nome_atividade,
        at.tipo_atividade,
        at.duracao,
        u.nome as nome_profissional
      FROM agendamento ag
      INNER JOIN atividade at ON ag.id_atividade = at.id_atividade
      INNER JOIN usuario u ON at.id_profissional = u.id_usuario
      WHERE ag.id_cliente = $1
      ORDER BY ag.data_agendada DESC, ag.horario_agendado DESC;
    `;
    
    try {
      const result = await pool.query(query, [idCliente]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar agendamentos por profissional (atividades que ele ministra)
   */
  static async findByProfissional(idProfissional) {
    const query = `
      SELECT 
        ag.*,
        at.nome_atividade,
        at.tipo_atividade,
        c.nome as nome_cliente,
        c.email as email_cliente
      FROM agendamento ag
      INNER JOIN atividade at ON ag.id_atividade = at.id_atividade
      INNER JOIN usuario c ON ag.id_cliente = c.id_usuario
      WHERE at.id_profissional = $1
      ORDER BY ag.data_agendada DESC, ag.horario_agendado DESC;
    `;
    
    try {
      const result = await pool.query(query, [idProfissional]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar agendamento por ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        ag.*,
        at.nome_atividade,
        at.tipo_atividade,
        at.duracao,
        u.nome as nome_profissional
      FROM agendamento ag
      INNER JOIN atividade at ON ag.id_atividade = at.id_atividade
      INNER JOIN usuario u ON at.id_profissional = u.id_usuario
      WHERE ag.id_agendamento = $1;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar se existe conflito de horário para o cliente
   * Retorna true se houver conflito, false caso contrário
   */
  static async checkConflito(idCliente, dataAgendada, horarioAgendado, idAgendamentoAtual = null) {
    let query = `
      SELECT COUNT(*) as total
      FROM agendamento ag
      INNER JOIN atividade at ON ag.id_atividade = at.id_atividade
      WHERE ag.id_cliente = $1 
        AND ag.data_agendada = $2 
        AND ag.status = 'Ativo'
        AND (
          -- Verifica se o novo horário está dentro do intervalo de uma atividade existente
          (ag.horario_agendado <= $3 AND 
           (ag.horario_agendado + (at.duracao || ' minutes')::INTERVAL) > $3)
          OR
          -- Verifica se o fim do novo horário está dentro de uma atividade existente
          ($3 < ag.horario_agendado AND 
           ($3 + (SELECT duracao FROM atividade WHERE id_atividade = ag.id_atividade) * INTERVAL '1 minute') > ag.horario_agendado)
        )
    `;
    
    const values = [idCliente, dataAgendada, horarioAgendado];
    
    // Se for uma atualização, excluir o próprio agendamento da verificação
    if (idAgendamentoAtual) {
      query += ` AND ag.id_agendamento != $4`;
      values.push(idAgendamentoAtual);
    }
    
    try {
      const result = await pool.query(query, values);
      return parseInt(result.rows[0].total) > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar disponibilidade de vagas na atividade
   * Retorna true se houver vaga, false caso contrário
   */
  static async checkDisponibilidade(idAtividade, dataAgendada, horarioAgendado) {
    const query = `
      SELECT 
        at.capacidade_max,
        COUNT(ag.id_agendamento) as agendamentos_ativos
      FROM atividade at
      LEFT JOIN agendamento ag ON at.id_atividade = ag.id_atividade 
        AND ag.data_agendada = $2 
        AND ag.horario_agendado = $3
        AND ag.status = 'Ativo'
      WHERE at.id_atividade = $1
      GROUP BY at.capacidade_max;
    `;
    
    try {
      const result = await pool.query(query, [idAtividade, dataAgendada, horarioAgendado]);
      
      if (result.rows.length === 0) {
        return false; // Atividade não existe
      }
      
      const { capacidade_max, agendamentos_ativos } = result.rows[0];
      return parseInt(agendamentos_ativos) < parseInt(capacidade_max);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualizar agendamento
   */
  static async update(id, agendamento) {
    const { data_agendada, horario_agendado } = agendamento;
    
    const query = `
      UPDATE agendamento
      SET data_agendada = $1, horario_agendado = $2
      WHERE id_agendamento = $3
      RETURNING *;
    `;
    
    const values = [data_agendada, horario_agendado, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancelar agendamento (soft delete - muda status para 'Cancelado')
   */
  static async cancel(id) {
    const query = `
      UPDATE agendamento
      SET status = 'Cancelado'
      WHERE id_agendamento = $1
      RETURNING *;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar se agendamento já ocorreu (data/hora já passaram)
   */
  static async isAgendamentoPassado(id) {
    const query = `
      SELECT 
        (data_agendada::DATE + horario_agendado::TIME) < NOW() as passou
      FROM agendamento
      WHERE id_agendamento = $1;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0]?.passou || false;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AgendamentoModel;
