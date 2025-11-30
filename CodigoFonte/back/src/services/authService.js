const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  /**
   * Autenticar usuário (login)
   */
  static async login(email, senha) {
    try {
      // Buscar usuário por email
      const usuario = await UsuarioModel.findByEmail(email);
      
      if (!usuario) {
        return {
          success: false,
          message: 'Email ou senha incorretos'
        };
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        return {
          success: false,
          message: 'Email ou senha incorretos'
        };
      }

      // Gerar JWT token
      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario
        },
        process.env.JWT_SECRET || 'secret_key_fallback', // Use variável de ambiente
        { expiresIn: '7d' } // Token válido por 7 dias
      );

      return {
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token,
          usuario: {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario,
            painel: this.getPainelByTipo(usuario.tipo_usuario)
          }
        }
      };
    } catch (error) {
      console.error('Erro no service de login:', error);
      throw new Error('Falha no processo de autenticação');
    }
  }

  /**
   * Verificar token JWT (middleware de proteção)
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_fallback');
      return {
        success: true,
        user: decoded
      };
    } catch (error) {
      console.error('Token inválido:', error);
      return {
        success: false,
        message: 'Token inválido ou expirado'
      };
    }
  }

  /**
   * Registrar novo usuário (cadastro)
   */
  static async register(usuarioData) {
    try {
      const { nome, email, senha, tipo_usuario } = usuarioData;

      // Validar tipo de usuário permitido para cadastro
      const tiposPermitidos = ['Cliente', 'Professor', 'Personal Trainer'];
      if (!tiposPermitidos.includes(tipo_usuario)) {
        return {
          success: false,
          message: 'Tipo de usuário não permitido para cadastro. Contate o administrador.'
        };
      }

      // Verificar se email já existe
      const emailExiste = await UsuarioModel.emailExists(email);
      if (emailExiste) {
        return {
          success: false,
          message: 'Email já está cadastrado'
        };
      }

      // Criar usuário
      const novoUsuario = await UsuarioModel.create(usuarioData);

      // Gerar token para login automático após cadastro
      const token = jwt.sign(
        {
          id_usuario: novoUsuario.id_usuario,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          tipo_usuario: novoUsuario.tipo_usuario
        },
        process.env.JWT_SECRET || 'secret_key_fallback',
        { expiresIn: '7d' }
      );

      return {
        success: true,
        message: 'Cadastro realizado com sucesso',
        data: {
          token,
          usuario: {
            id: novoUsuario.id_usuario,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            tipo_usuario: novoUsuario.tipo_usuario,
            painel: this.getPainelByTipo(novoUsuario.tipo_usuario)
          }
        }
      };
    } catch (error) {
      console.error('Erro no service de registro:', error);
      
      if (error.message === 'Email já está cadastrado') {
        return {
          success: false,
          message: error.message
        };
      }
      
      throw new Error('Falha no processo de cadastro');
    }
  }

  /**
   * Obter painel baseado no tipo de usuário
   */
  static getPainelByTipo(tipoUsuario) {
    const paineis = {
      'Cliente': {
        painel: 'cliente',
        nome: 'Painel do Cliente',
        rotas: {
          agendamentos: '/cliente/agendamentos',
          atividades: '/cliente/atividades'
        },
        permissoes: ['consultar_agendamentos_proprios', 'agendar_atividade']
      },
      'Professor': {
        painel: 'profissional',
        nome: 'Painel do Professor',
        rotas: {
          atividades: '/profissional/atividades',
          agendamentos: '/profissional/agendamentos'
        },
        permissoes: ['gerenciar_atividades', 'consultar_agendamentos_ministrados']
      },
      'Personal Trainer': {
        painel: 'profissional',
        nome: 'Painel do Personal Trainer',
        rotas: {
          atividades: '/profissional/atividades',
          agendamentos: '/profissional/agendamentos'
        },
        permissoes: ['gerenciar_atividades', 'consultar_agendamentos_ministrados']
      },
      'Administrador': {
        painel: 'admin',
        nome: 'Painel do Administrador',
        rotas: {
          usuarios: '/admin/usuarios',
          atividades: '/admin/atividades',
          agendamentos: '/admin/agendamentos',
          relatorios: '/admin/relatorios'
        },
        permissoes: ['gerenciar_tudo', 'criar_usuarios', 'gerar_relatorios']
      }
    };

    return paineis[tipoUsuario] || paineis['Cliente'];
  }

  /**
   * Verificar se usuário tem permissão para rota
   */
  static hasPermission(userType, requiredPermission) {
    const painel = this.getPainelByTipo(userType);
    return painel.permissoes.includes(requiredPermission);
  }
}

module.exports = AuthService;
