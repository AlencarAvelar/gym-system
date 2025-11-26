const AgendamentoService = require('../services/agendamentoService');

class AgendamentoController {
  /**
   * [RF006] Criar agendamento
   */
  static async create(req, res) {
    try {
      // id_cliente virá do middleware de autenticação (req.user.id)
      const agendamentoData = {
        ...req.body,
        id_cliente: req.user?.id_usuario || req.body.id_cliente // Fallback para testes
      };

      const result = await AgendamentoService.createAgendamento(agendamentoData);

      if (result.conflict || result.noVacancy) {
        return res.status(400).json(result);
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
   * [RF007] Consultar agendamentos
   */
  static async getAll(req, res) {
    try {
      // userId e userType virão do middleware de autenticação
      const userId = req.user?.id_usuario || req.query.userId; // Fallback para testes
      const userType = req.user?.tipo_usuario || req.query.userType; // Fallback para testes

      const result = await AgendamentoService.getAgendamentos(userId, userType);

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
   * [RF008] Atualizar agendamento
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const idCliente = req.user?.id_usuario || req.body.id_cliente; // Fallback para testes

      const result = await AgendamentoService.updateAgendamento(id, req.body, idCliente);

      if (result.notFound) {
        return res.status(404).json(result);
      }

      if (result.forbidden) {
        return res.status(403).json(result);
      }

      if (result.conflict || result.noVacancy || result.pastSchedule) {
        return res.status(400).json(result);
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
   * [RF009] Cancelar agendamento
   */
  static async cancel(req, res) {
    try {
      const { id } = req.params;
      const idCliente = req.user?.id_usuario || req.body.id_cliente; // Fallback para testes

      const result = await AgendamentoService.cancelAgendamento(id, idCliente);

      if (result.notFound) {
        return res.status(404).json(result);
      }

      if (result.forbidden) {
        return res.status(403).json(result);
      }

      if (result.pastSchedule || result.alreadyCancelled) {
        return res.status(400).json(result);
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
}

module.exports = AgendamentoController;
