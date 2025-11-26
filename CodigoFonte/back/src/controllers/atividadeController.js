const AtividadeService = require('../services/atividadeService');

class AtividadeController {
  /**
   * [RF002] Cadastrar atividade
   */
  static async create(req, res) {
    try {
      const result = await AtividadeService.createAtividade(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro no controller ao cadastrar atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao cadastrar atividade'
      });
    }
  }

  /**
   * [RF003] Consultar todas as atividades
   */
  static async getAll(req, res) {
    try {
      const result = await AtividadeService.getAllAtividades();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao consultar atividades:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar atividades'
      });
    }
  }

  /**
   * Buscar atividade por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await AtividadeService.getAtividadeById(id);
      
      if (result.notFound) {
        return res.status(404).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao buscar atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar atividade'
      });
    }
  }

  /**
   * Buscar atividades por profissional
   */
  static async getByProfissional(req, res) {
    try {
      const { idProfissional } = req.params;
      const result = await AtividadeService.getAtividadesByProfissional(idProfissional);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao buscar atividades do profissional:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar atividades'
      });
    }
  }

  /**
   * [RF004] Atualizar atividade
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const result = await AtividadeService.updateAtividade(id, req.body);
      
      if (result.notFound) {
        return res.status(404).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao atualizar atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar atividade'
      });
    }
  }

  /**
   * [RF005] Excluir atividade
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await AtividadeService.deleteAtividade(id);
      
      if (result.notFound) {
        return res.status(404).json(result);
      }
      
      if (result.businessRuleViolation) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao excluir atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir atividade'
      });
    }
  }

  /**
   * Consultar atividades disponíveis
   */
  static async getAvailable(req, res) {
    try {
      const result = await AtividadeService.getAvailableAtividades();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller ao buscar atividades disponíveis:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar atividades disponíveis'
      });
    }
  }
}

module.exports = AtividadeController;
