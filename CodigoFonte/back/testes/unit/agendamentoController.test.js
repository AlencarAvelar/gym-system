const AgendamentoController = require('../../src/controllers/agendamentoController');
const AgendamentoService = require('../../src/services/agendamentoService');

// --- MOCKS ---
jest.mock('../../src/services/agendamentoService');

describe('AgendamentoController Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            user: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    /**
     * CENÁRIO 3: Cliente realiza agendamento com sucesso
     */
    test('Cliente deve conseguir realizar um agendamento com sucesso', async () => {
        // 1. Configuração
        req.user = { id_usuario: 100, tipo_usuario: 'Cliente' };
        req.body = {
            id_atividade: 1,
            data_agendada: '2025-12-20',
            horario_agendado: '09:00'
        };

        // Simula resposta de sucesso do Serviço
        AgendamentoService.createAgendamento.mockResolvedValue({
            success: true,
            message: 'Agendamento criado com sucesso!',
            data: { id: 50, ...req.body, id_cliente: 100 }
        });

        // 2. Execução
        await AgendamentoController.create(req, res);

        // 3. Validação
        
        // Verifica se o Service foi chamado com os dados misturados (Body + ID do Token)
        expect(AgendamentoService.createAgendamento).toHaveBeenCalledWith(expect.objectContaining({
            id_cliente: 100, // Veio do req.user
            id_atividade: 1,
            data_agendada: '2025-12-20'
        }));

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true
        }));
    });

    /**
     * CENÁRIO DE ERRO: Falta de Vagas
     */
    test('Deve retornar erro 400 se não houver vagas (noVacancy)', async () => {
        req.user = { id_usuario: 100 };
        req.body = { id_atividade: 1 };

        // Simula resposta de "Sem Vagas" do Serviço
        AgendamentoService.createAgendamento.mockResolvedValue({
            success: false,
            message: 'Sem vagas',
            noVacancy: true
        });

        await AgendamentoController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            noVacancy: true
        }));
    });

    /**
     * CENÁRIO DE ERRO: Conflito de Horário
     */
    test('Deve retornar erro 400 se houver conflito de horário', async () => {
        req.user = { id_usuario: 100 };
        req.body = { id_atividade: 1 };

        // Simula resposta de "Conflito" do Serviço
        AgendamentoService.createAgendamento.mockResolvedValue({
            success: false,
            message: 'Conflito de horário',
            conflict: true
        });

        await AgendamentoController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            conflict: true
        }));
    });
});