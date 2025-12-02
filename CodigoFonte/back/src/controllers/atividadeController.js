const AtividadeModel = require('../models/atividadeModel'); 
const UsuarioModel = require('../models/usuarioModel'); 

class AtividadeController {
  
  // --- FUNÇÃO AUXILIAR DE VALIDAÇÃO (Interna) ---
  static async _validarProfissional(id) {
    if (!id) return { valido: true }; // Se não veio ID, segue o fluxo
    
    const usuario = await UsuarioModel.findById(id);
    if (!usuario) {
      return { valido: false, msg: 'Profissional não encontrado no banco de dados.' };
    }
    
    const tiposPermitidos = ['Professor', 'Personal Trainer'];
    if (!tiposPermitidos.includes(usuario.tipo_usuario)) {
      return { 
        valido: false, 
        msg: `O usuário "${usuario.nome}" é do tipo "${usuario.tipo_usuario}". Apenas Professores ou Personal Trainers podem ser responsáveis por atividades.` 
      };
    }
    return { valido: true };
  }

  /**
   * Listar todas as atividades (usando autenticação)
   */
  static async getAll(req, res) {
    try {
      const { tipo_usuario } = req.user;
      let atividades;
      
      if (tipo_usuario === 'Cliente') {
        atividades = await AtividadeModel.findAvailable(); 
      } else {
        atividades = await AtividadeModel.findAll();
      }

      return res.status(200).json({
        success: true,
        message: 'Atividades recuperadas com sucesso',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro no controller ao listar atividades:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Listar atividades disponíveis (para clientes)
   */
  static async getAvailable(req, res) {
    try {
      const atividades = await AtividadeModel.findAvailable();
      return res.status(200).json({
        success: true,
        message: 'Atividades disponíveis recuperadas',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao listar atividades disponíveis:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Criar nova atividade
   */
  static async create(req, res) {
    try {
      const { tipo_usuario, id_usuario } = req.user;
      
      let idProfissionalFinal = id_usuario;

      // Se for Admin E enviou um ID específico, usa o ID enviado
      if (tipo_usuario === 'Administrador' && req.body.id_profissional) {
        idProfissionalFinal = req.body.id_profissional;
      }

      // Valida se o profissional escolhido é válido
      const validacao = await AtividadeController._validarProfissional(idProfissionalFinal);
      if (!validacao.valido) {
        return res.status(400).json({ success: false, message: validacao.msg });
      }

      const atividadeData = {
        ...req.body,
        id_profissional: idProfissionalFinal
      };

      const result = await AtividadeModel.create(atividadeData);

      if (!result) {
        return res.status(400).json({ success: false, message: 'Erro ao criar atividade' });
      }

      return res.status(201).json({
        success: true,
        message: 'Atividade criada com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Buscar atividade por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const atividade = await AtividadeModel.findById(id);

      if (!atividade) {
        return res.status(404).json({ success: false, message: 'Atividade não encontrada' });
      }

      return res.status(200).json({ success: true, data: atividade });
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Atualizar atividade
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { tipo_usuario, id_usuario } = req.user;

      const atividade = await AtividadeModel.findById(id);
      if (!atividade) {
        return res.status(404).json({ success: false, message: 'Atividade não encontrada' });
      }

      if (tipo_usuario !== 'Administrador' && atividade.id_profissional !== id_usuario) {
        return res.status(403).json({ success: false, message: 'Você não tem permissão para editar esta atividade' });
      }

      // Se enviou um novo ID de profissional, valida ele
      if (req.body.id_profissional) {
        const validacao = await AtividadeController._validarProfissional(req.body.id_profissional);
        if (!validacao.valido) {
          return res.status(400).json({ success: false, message: validacao.msg });
        }
      }

      // Se não enviou id_profissional no body, mantém o que já estava (para não quebrar a validação do banco)
      const dadosUpdate = {
        ...req.body,
        id_profissional: req.body.id_profissional || atividade.id_profissional
      };

      const result = await AtividadeModel.update(id, dadosUpdate);

      if (!result) {
        return res.status(400).json({ success: false, message: 'Erro ao atualizar dados' });
      }

      return res.status(200).json({
        success: true,
        message: 'Atividade atualizada com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Buscar atividades por profissional
   */
  static async getByProfissional(req, res) {
    try {
      const { id } = req.params;
      const { tipo_usuario, id_usuario } = req.user;

      if (tipo_usuario !== 'Administrador' && id != id_usuario) {
        return res.status(403).json({ success: false, message: 'Sem permissão' });
      }

      const atividades = await AtividadeModel.findByProfissional(id);

      return res.status(200).json({
        success: true,
        message: 'Atividades recuperadas',
        data: atividades,
        total: atividades.length
      });
    } catch (error) {
      console.error('Erro ao buscar:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Deletar atividade
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { tipo_usuario, id_usuario } = req.user;

      const atividade = await AtividadeModel.findById(id);
      if (!atividade) {
        return res.status(404).json({ success: false, message: 'Atividade não encontrada' });
      }

      if (tipo_usuario !== 'Administrador' && atividade.id_profissional !== id_usuario) {
        return res.status(403).json({ success: false, message: 'Sem permissão para excluir' });
      }

      await AtividadeModel.delete(id);

      return res.status(200).json({ success: true, message: 'Atividade excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir:', error);
      if (error.code === '23503') {
         return res.status(400).json({
            success: false,
            message: 'Não é possível excluir esta atividade pois já existem agendamentos vinculados a ela.'
         });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- MÉTODOS PÚBLICOS (Restaurados para compatibilidade) ---
  static async getAllPublic(req, res) {
    try {
      const atividades = await AtividadeModel.findAll();
      return res.status(200).json({ success: true, data: atividades, total: atividades.length });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAvailablePublic(req, res) {
    try {
      const atividades = await AtividadeModel.findAvailable();
      return res.status(200).json({ success: true, data: atividades, total: atividades.length });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AtividadeController;