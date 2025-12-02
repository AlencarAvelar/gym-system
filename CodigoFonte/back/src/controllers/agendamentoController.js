const AgendamentoService = require('../services/agendamentoService');

class AgendamentoController {
  /**
   * [RF006] Criar agendamento (AUTENTICADO)
   */
  static async create(req, res) {
    try {
      // id_cliente vem do token (req.user)
      const agendamentoData = {
        id_cliente: req.user.id_usuario, // ← AUTOMÁTICO
        ...req.body
      };

      const result = await AgendamentoService.createAgendamento(agendamentoData);

      if (result.conflict) {
        return res.status(400).json({
          success: false,
          message: 'Conflito de horário. Você já tem um agendamento neste horário.',
          conflict: true
        });
      }

      if (result.noVacancy) {
        return res.status(400).json({
          success: false,
          message: 'Sem vagas disponíveis para este horário.',
          noVacancy: true
        });
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro no controller ao criar agendamento:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar agendamento'
      });
    }
  }

  /**
   * [RF007] Consultar agendamentos (AUTENTICADO)
   */
  static async getAll(req, res) {
    try {
      // Usa dados do usuário logado
      const { id_usuario, tipo_usuario } = req.user;

      const result = await AgendamentoService.getAgendamentos(id_usuario, tipo_usuario);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao consultar agendamentos:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar agendamentos'
      });
    }
  }

  /**
   * Buscar agendamento por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await AgendamentoService.getAgendamentoById(id);

      if (result.notFound) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao buscar agendamento:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar agendamento'
      });
    }
  }

  /**
   * [RF008] Atualizar agendamento (AUTENTICADO)
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const idCliente = req.user.id_usuario; // ← DO TOKEN

      const result = await AgendamentoService.updateAgendamento(id, req.body, idCliente);

      if (result.notFound) {
        return res.status(404).json(result);
      }

      if (result.forbidden) {
        return res.status(403).json(result);
      }

      if (result.pastSchedule) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível editar um agendamento que já ocorreu',
          pastSchedule: true
        });
      }

      if (result.conflict) {
        return res.status(400).json({
          success: false,
          message: 'Conflito de horário no novo horário solicitado',
          conflict: true
        });
      }

      if (result.noVacancy) {
        return res.status(400).json({
          success: false,
          message: 'Sem vagas disponíveis no novo horário',
          noVacancy: true
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao atualizar agendamento:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar agendamento'
      });
    }
  }

  /**
   * [RF009] Cancelar agendamento (AUTENTICADO)
   */
  static async cancel(req, res) {
    try {
      const { id } = req.params;
      const idCliente = req.user.id_usuario; // ← DO TOKEN

      const result = await AgendamentoService.cancelAgendamento(id, idCliente);

      if (result.notFound) {
        return res.status(404).json(result);
      }

      if (result.forbidden) {
        return res.status(403).json(result);
      }

      if (result.pastSchedule) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível cancelar um agendamento que já ocorreu',
          pastSchedule: true
        });
      }

      if (result.alreadyCancelled) {
        return res.status(400).json({
          success: false,
          message: 'Este agendamento já foi cancelado',
          alreadyCancelled: true
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao cancelar agendamento:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao cancelar agendamento'
      });
    }
  }

  // MÉTODOS PÚBLICOS (para manter compatibilidade - OPCIONAL)
  static async createPublic(req, res) {
    try {
      const agendamentoData = {
        ...req.body,
        id_cliente: req.body.id_cliente // ← DO BODY (para testes)
      };

      const result = await AgendamentoService.createAgendamento(agendamentoData);

      if (result.conflict || result.noVacancy) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao criar agendamento público:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar agendamento'
      });
    }
  }

  static async getAllPublic(req, res) {
    try {
      const { userId, userType } = req.query;
      
      if (!userId || !userType) {
        return res.status(400).json({
          success: false,
          message: 'userId e userType são obrigatórios para teste público'
        });
      }

      const result = await AgendamentoService.getAgendamentos(userId, userType);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao listar agendamentos públicos:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar agendamentos'
      });
    }
  }

  static async updatePublic(req, res) {
    try {
      const { id } = req.params;
      const idCliente = req.body.id_cliente; // ← DO BODY

      if (!idCliente) {
        return res.status(400).json({
          success: false,
          message: 'id_cliente é obrigatório para teste público'
        });
      }

      const result = await AgendamentoService.updateAgendamento(id, req.body, idCliente);

      if (result.notFound || result.forbidden || result.pastSchedule || 
          result.conflict || result.noVacancy) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao atualizar agendamento público:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar agendamento'
      });
    }
  }

  static async cancelPublic(req, res) {
    try {
      const { id } = req.params;
      const idCliente = req.body.id_cliente; // ← DO BODY

      if (!idCliente) {
        return res.status(400).json({
          success: false,
          message: 'id_cliente é obrigatório para teste público'
        });
      }

      const result = await AgendamentoService.cancelAgendamento(id, idCliente);

      if (result.notFound || result.forbidden || result.pastSchedule || result.alreadyCancelled) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao cancelar agendamento público:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao cancelar agendamento'
      });
    }
  }
}

module.exports = AgendamentoController;
