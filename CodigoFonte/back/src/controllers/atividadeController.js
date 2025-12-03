const AtividadeModel = require('../models/atividadeModel');
const UsuarioModel = require('../models/usuarioModel');

class AtividadeController {

    /**
     * Método auxiliar interno para validar a qualificação do profissional.
     * Verifica se o usuário existe e se possui perfil de 'Professor' ou 'Personal Trainer'.
     * @param {string} id - ID do usuário a ser validado.
     */
    static async _validarProfissional(id) {
        // Se o ID não for fornecido, a validação é ignorada (fluxos opcionais)
        if (!id) return {
            valido: true
        };

        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            return {
                valido: false,
                msg: 'Profissional não encontrado no banco de dados.'
            };
        }

        // Verifica se o tipo do usuário está na lista de permitidos para conduzir atividades
        const tiposPermitidos = ['Professor', 'Personal Trainer'];
        if (!tiposPermitidos.includes(usuario.tipo_usuario)) {
            return {
                valido: false,
                msg: `O usuário "${usuario.nome}" é do tipo "${usuario.tipo_usuario}". Apenas Professores ou Personal Trainers podem ser responsáveis por atividades.`
            };
        }
        return {
            valido: true
        };
    }

    /**
     * Lista atividades baseadas no contexto do usuário autenticado.
     * Clientes visualizam apenas atividades disponíveis (vagas abertas/futuras).
     * Staff/Admin visualizam o histórico completo.
     */
    static async getAll(req, res) {
        try {
            const {
                tipo_usuario
            } = req.user;
            let atividades;

            // Filtra a query baseada no nível de acesso
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
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Endpoint específico para listar apenas atividades disponíveis.
     * Geralmente utilizado para preencher dropdowns ou listas de agendamento.
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
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Cria uma nova atividade no sistema.
     * Define automaticamente o profissional responsável ou permite override por Administradores.
     */
    static async create(req, res) {
        try {
            const {
                tipo_usuario,
                id_usuario
            } = req.user;

            // Por padrão, o criador da atividade é o responsável profissional
            let idProfissionalFinal = id_usuario;

            // Se o usuário for Administrador, ele pode designar outro profissional via body
            if (tipo_usuario === 'Administrador' && req.body.id_profissional) {
                idProfissionalFinal = req.body.id_profissional;
            }

            // Valida se o ID final pertence a um profissional qualificado
            const validacao = await AtividadeController._validarProfissional(idProfissionalFinal);
            if (!validacao.valido) {
                return res.status(400).json({
                    success: false,
                    message: validacao.msg
                });
            }

            // Prepara o objeto de dados garantindo o ID correto do profissional
            const atividadeData = {
                ...req.body,
                id_profissional: idProfissionalFinal
            };

            const result = await AtividadeModel.create(atividadeData);

            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: 'Erro ao criar atividade'
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Atividade criada com sucesso',
                data: result
            });
        } catch (error) {
            console.error('Erro ao criar atividade:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Busca os detalhes de uma atividade específica pelo seu ID.
     */
    static async getById(req, res) {
        try {
            const {
                id
            } = req.params;
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
                message: error.message
            });
        }
    }

    /**
     * Atualiza os dados de uma atividade existente.
     * Inclui verificações de propriedade (apenas o dono ou admin pode editar)
     * e revalidação do profissional caso este seja alterado.
     */
    static async update(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                tipo_usuario,
                id_usuario
            } = req.user;

            // Verifica existência da atividade
            const atividade = await AtividadeModel.findById(id);
            if (!atividade) {
                return res.status(404).json({
                    success: false,
                    message: 'Atividade não encontrada'
                });
            }

            // Controle de Acesso: Apenas Admin ou o próprio criador podem editar
            if (tipo_usuario !== 'Administrador' && atividade.id_profissional !== id_usuario) {
                return res.status(403).json({
                    success: false,
                    message: 'Você não tem permissão para editar esta atividade'
                });
            }

            // Se houver tentativa de troca de profissional, valida o novo ID
            if (req.body.id_profissional) {
                const validacao = await AtividadeController._validarProfissional(req.body.id_profissional);
                if (!validacao.valido) {
                    return res.status(400).json({
                        success: false,
                        message: validacao.msg
                    });
                }
            }

            // Mantém o id_profissional original caso não tenha sido enviado um novo
            const dadosUpdate = {
                ...req.body,
                id_profissional: req.body.id_profissional || atividade.id_profissional
            };

            const result = await AtividadeModel.update(id, dadosUpdate);

            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: 'Erro ao atualizar dados'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Atividade atualizada com sucesso',
                data: result
            });
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Retorna todas as atividades vinculadas a um ID de profissional específico.
     * Possui trava de segurança para impedir que um usuário veja dados de outro (exceto Admin).
     */
    static async getByProfissional(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                tipo_usuario,
                id_usuario
            } = req.user;

            // Segurança: Garante que o usuário só busca as próprias atividades, salvo se for Admin
            if (tipo_usuario !== 'Administrador' && id != id_usuario) {
                return res.status(403).json({
                    success: false,
                    message: 'Sem permissão'
                });
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
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Remove uma atividade do sistema.
     * Trata restrições de chave estrangeira (FK) para evitar orfãos no banco.
     */
    static async delete(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                tipo_usuario,
                id_usuario
            } = req.user;

            const atividade = await AtividadeModel.findById(id);
            if (!atividade) {
                return res.status(404).json({
                    success: false,
                    message: 'Atividade não encontrada'
                });
            }

            // Controle de Acesso para exclusão
            if (tipo_usuario !== 'Administrador' && atividade.id_profissional !== id_usuario) {
                return res.status(403).json({
                    success: false,
                    message: 'Sem permissão para excluir'
                });
            }

            await AtividadeModel.delete(id);

            return res.status(200).json({
                success: true,
                message: 'Atividade excluída com sucesso'
            });
        } catch (error) {
            console.error('Erro ao excluir:', error);
            // Tratamento específico para erro de Foreign Key do PostgreSQL
            // Isso ocorre se tentarmos apagar uma atividade que já tem agendamentos marcados
            if (error.code === '23503') {
                return res.status(400).json({
                    success: false,
                    message: 'Não é possível excluir esta atividade pois já existem agendamentos vinculados a ela.'
                });
            }
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // --- MÉTODOS PÚBLICOS (Sem autenticação obrigatória) ---

    static async getAllPublic(req, res) {
        try {
            const atividades = await AtividadeModel.findAll();
            return res.status(200).json({
                success: true,
                data: atividades,
                total: atividades.length
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getAvailablePublic(req, res) {
        try {
            const atividades = await AtividadeModel.findAvailable();
            return res.status(200).json({
                success: true,
                data: atividades,
                total: atividades.length
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = AtividadeController;