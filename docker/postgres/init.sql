-- docker/postgres/init.sql
-- Script executado automaticamente na primeira inicialização do PostgreSQL

-- Criar database (se não existir)
CREATE DATABASE gym_system;

-- Conectar ao database
\c gym_system;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('Cliente', 'Professor', 'Personal Trainer', 'Administrador')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de atividades
CREATE TABLE IF NOT EXISTS atividade (
  id_atividade SERIAL PRIMARY KEY,
  nome_atividade VARCHAR(255) NOT NULL,
  descricao TEXT,
  duracao INTEGER NOT NULL, -- em minutos
  capacidade_maxima INTEGER NOT NULL,
  categoria VARCHAR(100),
  id_profissional INTEGER REFERENCES usuario(id_usuario),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamento (
  id_agendamento SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL REFERENCES usuario(id_usuario),
  id_atividade INTEGER NOT NULL REFERENCES atividade(id_atividade),
  data_agendamento DATE NOT NULL,
  horario TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Cancelado', 'Concluído')),
  presente BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuários de teste (senhas em texto plano - apenas para desenvolvimento)
INSERT INTO usuario (nome, email, senha, tipo_usuario) VALUES
('Admin Sistema', 'admin@gym.com', 'senha123', 'Administrador'),
('Carlos Oliveira', 'carlos@gym.com', 'senha123', 'Professor'),
('Roberto Fitness', 'roberto@gym.com', 'senha123', 'Personal Trainer'),
('João Silva', 'joao@gym.com', 'senha123', 'Cliente'),
('Maria Santos', 'maria@gym.com', 'senha123', 'Cliente')
ON CONFLICT (email) DO NOTHING;

-- Inserir atividades de exemplo
INSERT INTO atividade (nome_atividade, descricao, duracao, capacidade_maxima, categoria, id_profissional) VALUES
('Yoga Iniciante', 'Aula de yoga para iniciantes', 60, 15, 'Relaxamento', 2),
('Musculação Avançada', 'Treino de musculação para alunos experientes', 90, 20, 'Força', 2),
('Personal Training', 'Treino personalizado individual', 60, 1, 'Personal', 3)
ON CONFLICT DO NOTHING;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_agendamento_cliente ON agendamento(id_cliente);
CREATE INDEX IF NOT EXISTS idx_agendamento_atividade ON agendamento(id_atividade);
CREATE INDEX IF NOT EXISTS idx_agendamento_data ON agendamento(data_agendamento);

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Banco de dados gym_system inicializado com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas: usuario, atividade, agendamento';
  RAISE NOTICE '👥 Usuários de teste criados (senha: senha123)';
END $$;
