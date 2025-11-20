const AtividadeModel = require('../models/atividadeModel');

class AtividadeController {
  // [RF002] Cadastrar atividade
  static async create(req, res) {
    try {
      const novaAtividade = await AtividadeModel.create(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Atividade cadastrada com sucesso!',
        data: novaAtividade
      });
    } catch (error) {
      console.error('Erro ao cadastrar atividade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao cadastrar atividade',
        error: error.message
      });
    }
  }

  // [RF003] Consultar todas as atividades
  static async getAll(req, res) {
    try {
      const atividades = await AtividadeModel.findAll();
      
      return res.status(200).json({
        success: true,
        message: 'Atividades recuperadas com sucesso',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao consultar atividades:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao consultar atividades',
        error: error.message
      });
    }
  }

  // Buscar atividade por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const atividade = await AtividadeModel.findById(id);
      
      if (!atividade) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: atividade
      });
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar atividade',
        error: error.message
      });
    }
  }

  // Buscar atividades por profissional
  static async getByProfissional(req, res) {
    try {
      const { idProfissional } = req.params;
      const atividades = await AtividadeModel.findByProfissional(idProfissional);
      
      return res.status(200).json({
        success: true,
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao buscar atividades do profissional:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar atividades',
        error: error.message
      });
    }
  }

  // [RF004] Atualizar atividade
  static async update(req, res) {
    try {
      const { id } = req.params;
      
      // Verifica se a atividade existe
      const atividadeExistente = await AtividadeModel.findById(id);
      if (!atividadeExistente) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }
      
      const atividadeAtualizada = await AtividadeModel.update(id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Atividade atualizada com sucesso!',
        data: atividadeAtualizada
      });
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar atividade',
        error: error.message
      });
    }
  }

  // [RF005] Excluir atividade
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verifica se a atividade existe
      const atividadeExistente = await AtividadeModel.findById(id);
      if (!atividadeExistente) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }
      
      await AtividadeModel.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Atividade excluída com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      
      // Tratamento especial para a regra de negócio
      if (error.message.includes('agendamentos vinculados')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir atividade',
        error: error.message
      });
    }
  }

  // Consultar atividades disponíveis
  static async getAvailable(req, res) {
    try {
      const atividades = await AtividadeModel.findAvailable();
      
      return res.status(200).json({
        success: true,
        message: 'Atividades disponíveis recuperadas com sucesso',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao buscar atividades disponíveis:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar atividades disponíveis',
        error: error.message
      });
    }
  }
}

module.exports = AtividadeController;