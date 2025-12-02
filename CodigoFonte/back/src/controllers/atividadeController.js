const AtividadeService = require('../services/atividadeService'); // ← SE EXISTIR
const { UsuarioModel } = require('../models/usuarioModel'); // ← IMPORTAR

class AtividadeController {
  /**
   * Listar todas as atividades (usando autenticação)
   */
  static async getAll(req, res) {
    try {
      // Agora usa req.user do middleware
      const { tipo_usuario } = req.user;

      let atividades;
      
      // Cliente só vê atividades com vagas
      if (tipo_usuario === 'Cliente') {
        atividades = await AtividadeService.getAvailableForClient();
      } 
      // Admin/Professor vê todas
      else {
        atividades = await AtividadeService.getAll();
      }

      return res.status(200).json({
        success: true,
        message: 'Atividades recuperadas com sucesso',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro no controller ao listar atividades:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar atividades'
      });
    }
  }

  /**
   * Listar atividades disponíveis (para clientes)
   */
  static async getAvailable(req, res) {
    try {
      const atividades = await AtividadeService.getAvailableForClient();
      
      return res.status(200).json({
        success: true,
        message: 'Atividades disponíveis recuperadas',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao listar atividades disponíveis:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar atividades disponíveis'
      });
    }
  }

  /**
   * Criar nova atividade (Professor/Personal Trainer/Admin)
   */
  static async create(req, res) {
    try {
      // Adiciona o profissional logado automaticamente
      const atividadeData = {
        ...req.body,
        id_profissional: req.user.id_usuario // ← AUTOMÁTICO
      };

      const result = await AtividadeService.create(atividadeData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao criar atividade'
      });
    }
  }

  /**
   * Buscar atividade por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const atividade = await AtividadeService.getById(id);

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
        message: error.message || 'Erro ao buscar atividade'
      });
    }
  }

  /**
   * Atualizar atividade
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { tipo_usuario } = req.user;

      // Verifica se o usuário tem permissão
      const atividade = await AtividadeService.getById(id);
      if (!atividade) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }

      // Só pode editar se for o professor responsável ou admin
      if (tipo_usuario !== 'Administrador' && atividade.id_profissional !== req.user.id_usuario) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para editar esta atividade'
        });
      }

      const result = await AtividadeService.update(id, req.body);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar atividade'
      });
    }
  }

  /**
   * Buscar atividades por profissional
   */
  static async getByProfissional(req, res) {
    try {
      const { id } = req.params;
      const { tipo_usuario, id_usuario } = req.user;

      // Só pode ver atividades de outros se for admin
      if (tipo_usuario !== 'Administrador' && id != id_usuario) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para ver atividades de outros profissionais'
        });
      }

      const atividades = await AtividadeService.getByProfissional(id);

      return res.status(200).json({
        success: true,
        message: 'Atividades do profissional recuperadas',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao buscar atividades por profissional:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar atividades'
      });
    }
  }

  /**
   * Deletar atividade
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { tipo_usuario, id_usuario } = req.user;

      const atividade = await AtividadeService.getById(id);
      if (!atividade) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }

      // Só admin pode deletar
      if (tipo_usuario !== 'Administrador') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem excluir atividades'
        });
      }

      const result = await AtividadeService.delete(id);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        message: 'Atividade excluída com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao excluir atividade'
      });
    }
  }

  // MÉTODOS PÚBLICOS (para manter compatibilidade com testes antigos - OPCIONAL)
  static async getAllPublic(req, res) {
    try {
      const atividades = await AtividadeService.getAll();
      return res.status(200).json({
        success: true,
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao listar atividades públicas:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar atividades'
      });
    }
  }

  static async getAvailablePublic(req, res) {
    try {
      const atividades = await AtividadeService.getAvailableForClient();
      return res.status(200).json({
        success: true,
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao listar atividades disponíveis públicas:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao consultar atividades disponíveis'
      });
    }
  }
}

module.exports = AtividadeController;
