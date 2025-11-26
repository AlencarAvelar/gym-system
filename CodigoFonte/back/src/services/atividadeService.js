const AtividadeModel = require('../models/atividadeModel');

class AtividadeService {
  /**
   * [RF002] Criar nova atividade
   * Regra de negócio: Validar dados e criar atividade no banco
   */
  static async createAtividade(atividadeData) {
    try {
      const novaAtividade = await AtividadeModel.create(atividadeData);
      return {
        success: true,
        message: 'Atividade cadastrada com sucesso!',
        data: novaAtividade
      };
    } catch (error) {
      console.error('Erro no service ao criar atividade:', error);
      throw new Error('Falha ao cadastrar atividade');
    }
  }

  /**
   * [RF003] Listar todas as atividades
   */
  static async getAllAtividades() {
    try {
      const atividades = await AtividadeModel.findAll();
      return {
        success: true,
        message: 'Atividades recuperadas com sucesso',
        data: atividades,
        total: atividades.length
      };
    } catch (error) {
      console.error('Erro no service ao listar atividades:', error);
      throw new Error('Falha ao recuperar atividades');
    }
  }

  /**
   * Buscar atividade por ID
   * Regra de negócio: Verificar se atividade existe
   */
  static async getAtividadeById(id) {
    try {
      const atividade = await AtividadeModel.findById(id);
      
      if (!atividade) {
        return {
          success: false,
          message: 'Atividade não encontrada',
          notFound: true
        };
      }

      return {
        success: true,
        data: atividade
      };
    } catch (error) {
      console.error('Erro no service ao buscar atividade por ID:', error);
      throw new Error('Falha ao buscar atividade');
    }
  }

  /**
   * Buscar atividades por profissional
   */
  static async getAtividadesByProfissional(idProfissional) {
    try {
      const atividades = await AtividadeModel.findByProfissional(idProfissional);
      
      return {
        success: true,
        data: atividades,
        total: atividades.length
      };
    } catch (error) {
      console.error('Erro no service ao buscar atividades por profissional:', error);
      throw new Error('Falha ao buscar atividades do profissional');
    }
  }

  /**
   * [RF004] Atualizar atividade
   * Regra de negócio: Verificar existência antes de atualizar
   */
  static async updateAtividade(id, atividadeData) {
    try {
      // Verifica se a atividade existe
      const atividadeExistente = await AtividadeModel.findById(id);
      
      if (!atividadeExistente) {
        return {
          success: false,
          message: 'Atividade não encontrada',
          notFound: true
        };
      }

      // Atualiza a atividade
      const atividadeAtualizada = await AtividadeModel.update(id, atividadeData);
      
      return {
        success: true,
        message: 'Atividade atualizada com sucesso!',
        data: atividadeAtualizada
      };
    } catch (error) {
      console.error('Erro no service ao atualizar atividade:', error);
      throw new Error('Falha ao atualizar atividade');
    }
  }

  /**
   * [RF005] Excluir atividade
   * Regra de negócio: 
   * - Verificar se existe
   * - Não pode excluir se tiver agendamentos ativos vinculados
   */
  static async deleteAtividade(id) {
    try {
      // Verifica se a atividade existe
      const atividadeExistente = await AtividadeModel.findById(id);
      
      if (!atividadeExistente) {
        return {
          success: false,
          message: 'Atividade não encontrada',
          notFound: true
        };
      }

      // Tenta excluir (model valida agendamentos)
      await AtividadeModel.delete(id);
      
      return {
        success: true,
        message: 'Atividade excluída com sucesso!'
      };
    } catch (error) {
      console.error('Erro no service ao excluir atividade:', error);
      
      // Tratamento de regra de negócio específica
      if (error.message.includes('agendamentos vinculados')) {
        return {
          success: false,
          message: error.message,
          businessRuleViolation: true
        };
      }
      
      throw new Error('Falha ao excluir atividade');
    }
  }

  /**
   * Buscar atividades disponíveis (com vagas)
   */
  static async getAvailableAtividades() {
    try {
      const atividades = await AtividadeModel.findAvailable();
      
      return {
        success: true,
        message: 'Atividades disponíveis recuperadas com sucesso',
        data: atividades,
        total: atividades.length
      };
    } catch (error) {
      console.error('Erro no service ao buscar atividades disponíveis:', error);
      throw new Error('Falha ao buscar atividades disponíveis');
    }
  }
}

module.exports = AtividadeService;
