const AtividadeModel = require('../models/atividadeModel');

class AtividadeService {
  /**
   * Listar todas as atividades
   */
  static async getAll() {
    try {
      const atividades = await AtividadeModel.findAll();
      return atividades;
    } catch (error) {
      console.error('Erro no service ao listar atividades:', error);
      throw error;
    }
  }

  /**
   * Listar atividades disponíveis para clientes (com vagas)
   */
  static async getAvailableForClient() {
    try {
      const atividades = await AtividadeModel.findAvailable();
      return atividades;
    } catch (error) {
      console.error('Erro no service ao listar atividades disponíveis:', error);
      throw error;
    }
  }

  /**
   * Criar atividade
   */
  static async create(atividadeData) {
    try {
      const novaAtividade = await AtividadeModel.create(atividadeData);
      return {
        success: true,
        message: 'Atividade criada com sucesso',
        data: novaAtividade
      };
    } catch (error) {
      console.error('Erro no service ao criar atividade:', error);
      
      if (error.code === '23503') { // Foreign key violation
        return {
          success: false,
          message: 'Profissional não encontrado'
        };
      }
      
      throw error;
    }
  }

  /**
   * Buscar por ID
   */
  static async getById(id) {
    try {
      const atividade = await AtividadeModel.findById(id);
      return atividade;
    } catch (error) {
      console.error('Erro no service ao buscar atividade:', error);
      throw error;
    }
  }

  /**
   * Atualizar atividade
   */
  static async update(id, atividadeData) {
    try {
      const atividadeAtualizada = await AtividadeModel.update(id, atividadeData);
      
      if (!atividadeAtualizada) {
        return {
          success: false,
          message: 'Atividade não encontrada'
        };
      }

      return {
        success: true,
        message: 'Atividade atualizada com sucesso',
        data: atividadeAtualizada
      };
    } catch (error) {
      console.error('Erro no service ao atualizar atividade:', error);
      throw error;
    }
  }

  /**
   * Buscar por profissional
   */
  static async getByProfissional(idProfissional) {
    try {
      const atividades = await AtividadeModel.findByProfissional(idProfissional);
      return atividades;
    } catch (error) {
      console.error('Erro no service ao buscar atividades por profissional:', error);
      throw error;
    }
  }

  /**
   * Deletar atividade
   */
  static async delete(id) {
    try {
      const resultado = await AtividadeModel.delete(id);
      
      if (resultado.rowCount === 0) {
        return {
          success: false,
          message: 'Atividade não encontrada ou já foi excluída'
        };
      }

      return {
        success: true,
        message: 'Atividade excluída com sucesso'
      };
    } catch (error) {
      console.error('Erro no service ao deletar atividade:', error);
      
      // Se há agendamentos ativos, não pode deletar
      if (error.code === '23503') {
        return {
          success: false,
          message: 'Não é possível excluir atividade com agendamentos ativos'
        };
      }
      
      throw error;
    }
  }
}

module.exports = AtividadeService;
