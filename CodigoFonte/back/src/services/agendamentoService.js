const AgendamentoModel = require('../models/agendamentoModel');

class AgendamentoService {
  /**
   * [RF006] Criar novo agendamento
   * Regras de negócio:
   * - Verificar disponibilidade de vagas
   * - Verificar conflito de horário
   */
  static async createAgendamento(agendamentoData) {
    try {
      const { id_cliente, id_atividade, data_agendada, horario_agendado } = agendamentoData;

      // Verifica conflito de horário
      const temConflito = await AgendamentoModel.checkConflito(
        id_cliente,
        data_agendada,
        horario_agendado
      );

      if (temConflito) {
        return {
          success: false,
          message: 'Você já possui um agendamento neste horário.',
          conflict: true
        };
      }

      // Verifica disponibilidade de vagas
      const temVaga = await AgendamentoModel.checkDisponibilidade(
        id_atividade,
        data_agendada,
        horario_agendado
      );

      if (!temVaga) {
        return {
          success: false,
          message: 'Atividade sem vagas disponíveis para este horário.',
          noVacancy: true
        };
      }

      // Cria o agendamento
      const novoAgendamento = await AgendamentoModel.create(agendamentoData);

      return {
        success: true,
        message: 'Agendamento criado com sucesso!',
        data: novoAgendamento
      };
    } catch (error) {
      console.error('Erro no service ao criar agendamento:', error);
      throw new Error('Falha ao criar agendamento');
    }
  }

  /**
   * [RF007] Consultar agendamentos
   * Regras de negócio:
   * - Cliente vê apenas seus agendamentos
   * - Profissional vê agendamentos das atividades que ministra
   */
  /**
     * [RF007] Consultar agendamentos
     */
  static async getAgendamentos(userId, userType) {
    try {
      let agendamentos;

      console.log(`🔍 DEBUG Service: Buscando para tipo '${userType}'`);

      if (userType === 'Cliente') {
        agendamentos = await AgendamentoModel.findByCliente(userId);
      } else if (userType === 'Professor' || userType === 'Personal Trainer') {
        agendamentos = await AgendamentoModel.findByProfissional(userId);
      } else if (userType === 'Administrador') {
        console.log("   ✅ Entrou no bloco Administrador");
        agendamentos = await AgendamentoModel.findAll();
      } else {
        console.log("   ❌ Tipo inválido detectado");
        return {
          success: false,
          message: 'Tipo de usuário inválido para esta operação'
        };
      }

      console.log(`   📦 Registros encontrados no Banco: ${agendamentos.length}`);

      if (agendamentos.length === 0) {
        return {
          success: true, // Retorna sucesso mesmo vazio, para não dar erro 400 no front
          message: 'Nenhum agendamento encontrado!',
          data: [],
          total: 0
        };
      }

      return {
        success: true,
        message: 'Agendamentos recuperados com sucesso',
        data: agendamentos,
        total: agendamentos.length
      };
    } catch (error) {
      console.error('Erro no service ao consultar agendamentos:', error);
      throw new Error('Falha ao consultar agendamentos');
    }
  }

  /**
   * Buscar agendamento por ID
   */
  static async getAgendamentoById(id) {
    try {
      const agendamento = await AgendamentoModel.findById(id);

      if (!agendamento) {
        return {
          success: false,
          message: 'Agendamento não encontrado',
          notFound: true
        };
      }

      return {
        success: true,
        data: agendamento
      };
    } catch (error) {
      console.error('Erro no service ao buscar agendamento por ID:', error);
      throw new Error('Falha ao buscar agendamento');
    }
  }

  /**
   * [RF008] Atualizar agendamento
   * Regras de negócio:
   * - Só pode editar agendamentos futuros
   * - Verificar conflito de horário
   * - Verificar disponibilidade de vagas
   */
  static async updateAgendamento(id, agendamentoData, idCliente) {
    try {
      // Verifica se o agendamento existe
      const agendamentoExistente = await AgendamentoModel.findById(id);

      if (!agendamentoExistente) {
        return {
          success: false,
          message: 'Agendamento não encontrado',
          notFound: true
        };
      }

      // Verifica se o agendamento pertence ao cliente
      if (agendamentoExistente.id_cliente !== idCliente) {
        return {
          success: false,
          message: 'Você não tem permissão para editar este agendamento',
          forbidden: true
        };
      }

      // Verifica se o agendamento já passou
      const agendamentoPassou = await AgendamentoModel.isAgendamentoPassado(id);

      if (agendamentoPassou) {
        return {
          success: false,
          message: 'Não é possível editar um agendamento que já ocorreu',
          pastSchedule: true
        };
      }

      const { data_agendada, horario_agendado } = agendamentoData;

      // Verifica conflito de horário (excluindo o próprio agendamento)
      const temConflito = await AgendamentoModel.checkConflito(
        idCliente,
        data_agendada,
        horario_agendado,
        id
      );

      if (temConflito) {
        return {
          success: false,
          message: 'Não é possível reservar esse horário! Informe outro horário ou data.',
          conflict: true
        };
      }

      // Verifica disponibilidade de vagas
      const temVaga = await AgendamentoModel.checkDisponibilidade(
        agendamentoExistente.id_atividade,
        data_agendada,
        horario_agendado
      );

      if (!temVaga) {
        return {
          success: false,
          message: 'Atividade sem vagas! Escolha outro horário.',
          noVacancy: true
        };
      }

      // Atualiza o agendamento
      const agendamentoAtualizado = await AgendamentoModel.update(id, agendamentoData);

      return {
        success: true,
        message: 'Agendamento atualizado com sucesso!',
        data: agendamentoAtualizado
      };
    } catch (error) {
      console.error('Erro no service ao atualizar agendamento:', error);
      throw new Error('Falha ao atualizar agendamento');
    }
  }

  /**
   * [RF009] Cancelar agendamento
   * Regras de negócio:
   * - Só pode cancelar agendamentos futuros
   */
  static async cancelAgendamento(id, idCliente) {
    try {
      // Verifica se o agendamento existe
      const agendamentoExistente = await AgendamentoModel.findById(id);

      if (!agendamentoExistente) {
        return {
          success: false,
          message: 'Agendamento não encontrado',
          notFound: true
        };
      }

      // Verifica se o agendamento pertence ao cliente
      if (agendamentoExistente.id_cliente !== idCliente) {
        return {
          success: false,
          message: 'Você não tem permissão para cancelar este agendamento',
          forbidden: true
        };
      }

      // Verifica se o agendamento já passou
      const agendamentoPassou = await AgendamentoModel.isAgendamentoPassado(id);

      if (agendamentoPassou) {
        return {
          success: false,
          message: 'Não é possível cancelar um agendamento que já ocorreu.',
          pastSchedule: true
        };
      }

      // Verifica se já foi cancelado
      if (agendamentoExistente.status === 'Cancelado') {
        return {
          success: false,
          message: 'Este agendamento já foi cancelado',
          alreadyCancelled: true
        };
      }

      // Cancela o agendamento
      await AgendamentoModel.cancel(id);

      return {
        success: true,
        message: 'Agendamento cancelado com sucesso!'
      };
    } catch (error) {
      console.error('Erro no service ao cancelar agendamento:', error);
      throw new Error('Falha ao cancelar agendamento');
    }
  }
}

module.exports = AgendamentoService;
