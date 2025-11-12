# 🏋️ Sistema de Agendamento para Academia

## 📌 Descrição do Problema
As academias enfrentam dificuldades na organização de horários de aulas e treinos, principalmente quando o agendamento ocorre de forma manual ou presencial. Isso causa conflitos de horários, falta de controle de vagas e sobrecarga na administração. Professores e personal trainers também possuem pouca visibilidade da ocupação de suas aulas/treinos, o que dificulta seu planejamento.

## ✅ Descrição da Solução
A proposta é desenvolver um sistema web que permitirá automatizar o processo de agendamento de treinos e aulas. O sistema contará com diferentes níveis de acesso:

- **Administrador**: gerenciamento geral do sistema (usuários, horários, aulas e relatórios)
- **Professor**: criação e gerenciamento das aulas sob sua responsabilidade
- **Personal Trainer**: gerenciamento de treinos personalizados
- **Cliente**: visualização da agenda e inscrição em aulas/treinos

Essa solução tornará o processo mais eficiente, reduzindo erros operacionais e proporcionando uma melhor experiência para todos os envolvidos.

---

## 💻 Stack Tecnológico


| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| **Front-End** | React | v19.1.1 |
| **Back-End** | Node.js | v22.21.0 |
| **Banco de Dados** | PostgreSQL | v18.0 |
| **IDE** | Visual Studio Code | - |
| **Gerenciador de Pacotes** | npm | -2.0+ |
| **Containerização (Futuro)** | Docker | - |


---

## 📁 Estrutura do Diretório
> *Ainda em desenvolvimento*

```
gym-system/
|-- Documentacao/
|-- front/
|-- back/
|-- README.md
```

---


## 🚀 Quick Start (Início Rápido)

### ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v22.21.0 ou superior) - [Download](https://nodejs.org/)
- **npm** (v10.0.0 ou superior) - Incluído no Node.js
- **PostgreSQL** (v18.0 ou superior) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### 📥 Clonando o Repositório

```bash
git clone https://github.com/AlencarAvelar/gym-system.git
cd gym-system
```

---

## 👨‍💻 Instruções para Desenvolvedores

### 1️⃣ Configuração do Banco de Dados PostgreSQL

#### **Linux/macOS**
```bash
# Iniciar serviço PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Acessar psql
psql -U postgres

# Criar banco de dados
CREATE DATABASE gym_system;

# Criar usuário
CREATE USER gym_user WITH PASSWORD 'sua_senha_segura';

# Conceder permissões
ALTER ROLE gym_user SET client_encoding TO 'utf8';
ALTER ROLE gym_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE gym_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE gym_system TO gym_user;

# Sair
\q
```

#### **Windows**
```bash
# Inicie o PostgreSQL via Services (Windows + R: services.msc)
# Ou através da prompt (com acesso de administrador)

net start postgresql-x64-18

# Acesse psql
psql -U postgres

# Siga os comandos acima (criação de BD, usuário, etc)
```

---

### 2️⃣ Configuração do Back-End (Node.js/Express)

```bash
# Navegue até o diretório do back-end
cd back

# Instale as dependências
npm install

# Crie arquivo .env na raiz do projeto back/
# Copie e configure:
cp .env.example .env
```

**Arquivo `.back/.env` (exemplo)**
```
# Servidor
PORT=5000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=gym_user
DB_PASSWORD=sua_senha_segura
DB_NAME=gym_system

# JWT (Autenticação)
JWT_SECRET=sua_chave_secreta_muito_segura_aqui

# Email (Opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# URL do Front-End
REACT_APP_URL=http://localhost:3000
```

**Instale e configure o banco de dados:**
```bash
# Execute migrations (quando implementadas)
npm run migrate

# Seed do banco (dados iniciais)
npm run seed
```

**Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:5000`

---

### 3️⃣ Configuração do Front-End (React)

```bash
# Navegue até o diretório do front-end
cd front

# Instale as dependências
npm install

# Crie arquivo .env na raiz do projeto front/
cp .env.example .env
```

**Arquivo `front/.env` (exemplo)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

**Inicie o servidor de desenvolvimento:**
```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

---

## 👥 Equipe de Desenvolvimento
- **Alencar Henrique Lage Avelar**
- **Letícia Gabriella Nascimento de Morais**
- **Lídio Júnior Pereira Batista**

---

## 🚀 Status do Projeto
Sprint 1 — *Especificação do Produto*

---

## 📝 Licença
Este projeto é de uso acadêmico para a disciplina de Engenharia de Software.
