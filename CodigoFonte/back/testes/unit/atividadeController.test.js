const AtividadeController = require('../../src/controllers/atividadeController');
const AtividadeModel = require('../../src/models/atividadeModel');
const UsuarioModel = require('../../src/models/usuarioModel');

// --- MOCKS ---
jest.mock('../../src/models/atividadeModel');
jest.mock('../../src/models/usuarioModel');

describe('AtividadeController Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        // Limpa os mocks antes de cada teste
        jest.clearAllMocks();

        // Reseta os objetos req e res
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
     * CENÁRIO 1: Admin cadastra uma atividade para um Professor
     */
    test('Admin deve conseguir cadastrar atividade indicando um profissional', async () => {
        // 1. Configuração (Arrange)
        req.user = { tipo_usuario: 'Administrador', id_usuario: 999 };
        req.body = {
            nome: 'Crossfit Avançado',
            id_profissional: 2 // O Admin está indicando o ID 2
        };

        // Simula que o usuário ID 2 existe e É um Professor
        UsuarioModel.findById.mockResolvedValue({
            id: 2,
            nome: 'Carlos Trainer',
            tipo_usuario: 'Professor'
        });

        // Simula a criação com sucesso no banco
        AtividadeModel.create.mockResolvedValue({ id: 10, ...req.body });

        // 2. Execução (Act)
        await AtividadeController.create(req, res);

        // 3. Validação (Assert)
        
        // Verifica se validou o profissional correto (ID 2, não o ID 999 do admin)
        expect(UsuarioModel.findById).toHaveBeenCalledWith(2);
        
        // Verifica se chamou o model para criar com os dados certos
        expect(AtividadeModel.create).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Crossfit Avançado',
            id_profissional: 2
        }));

        // Verifica a resposta HTTP
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            message: 'Atividade criada com sucesso'
        }));
    });

    /**
     * CENÁRIO 2: Professor cadastra sua própria atividade
     */
    test('Professor deve conseguir cadastrar atividade para si mesmo', async () => {
        // 1. Configuração (Arrange)
        const idProfessor = 5;
        req.user = { tipo_usuario: 'Professor', id_usuario: idProfessor };
        req.body = {
            nome: 'Yoga Matinal'
            // Note: Professor não manda id_profissional no body, o sistema deve pegar do token (req.user)
        };

        // Simula que o usuário ID 5 existe e É um Professor
        UsuarioModel.findById.mockResolvedValue({
            id: idProfessor,
            nome: 'Ana Yoga',
            tipo_usuario: 'Professor'
        });

        AtividadeModel.create.mockResolvedValue({ id: 11, ...req.body, id_profissional: idProfessor });

        // 2. Execução (Act)
        await AtividadeController.create(req, res);

        // 3. Validação (Assert)

        // Deve validar o próprio ID do professor (5)
        expect(UsuarioModel.findById).toHaveBeenCalledWith(idProfessor);

        // Deve criar a atividade vinculada ao ID 5
        expect(AtividadeModel.create).toHaveBeenCalledWith(expect.objectContaining({
            nome: 'Yoga Matinal',
            id_profissional: idProfessor
        }));

        expect(res.status).toHaveBeenCalledWith(201);
    });

    /**
     * CENÁRIO EXTRA: Tentativa de cadastro com profissional inválido (Ex: Admin tenta vincular a um Aluno)
     */
    test('Não deve permitir cadastrar atividade se o profissional indicado não for qualificado', async () => {
        req.user = { tipo_usuario: 'Administrador', id_usuario: 999 };
        req.body = { nome: 'Treino Errado', id_profissional: 3 };

        // Simula que o ID 3 é um CLIENTE (não pode dar aula)
        UsuarioModel.findById.mockResolvedValue({
            id: 3,
            tipo_usuario: 'Cliente' // <--- Tipo inválido para profissional
        });

        await AtividadeController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: expect.stringContaining('Apenas Professores ou Personal Trainers')
        }));
        
        // Garante que NÃO tentou salvar no banco
        expect(AtividadeModel.create).not.toHaveBeenCalled();
    });
});