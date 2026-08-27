# 🚗 Vehicle Control API

WebAPI RESTful para controle de utilização de automóveis corporativos, construída com **Node.js**, **TypeScript** e **Express**.

---

## ✨ Destaques

- **Arquitetura em camadas** — Routes → Controllers → Services → Repositories
- **Validação de entrada** com Zod (runtime type-checking)
- **Hierarquia de erros** semântica (400, 404, 409, 422, 500)
- **50 testes** automatizados (unitários + integração) com Jest & Supertest
- **Documentação interativa** via Swagger UI
- **Interface Web** (bônus) consumindo a API em tempo real
- **Docker** multi-stage pronto para produção

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Linguagem | TypeScript (strict mode) |
| Framework HTTP | Express 5 |
| Validação | Zod |
| Testes | Jest + Supertest |
| Documentação | Swagger UI |
| Linting | ESLint 9 (flat config) + Prettier |
| Containerização | Docker (multi-stage) |
| Segurança | Helmet + CORS |

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js ≥ 20
- npm ≥ 10

### Instalação

```bash
git clone https://github.com/LisboaFred/vehicle-control-api.git
cd vehicle-control-api
npm install
cp .env.example .env
```

### Executando

```bash
# Desenvolvimento (hot-reload)
npm run dev

# Produção
npm run build
npm start
```

A aplicação estará disponível em **http://localhost:3000**.

### Docker

```bash
docker build -t vehicle-control-api .
docker run -p 3000:3000 vehicle-control-api
```

---

## 📖 Documentação da API

Com o servidor rodando, acesse a documentação interativa:

| Recurso | URL |
|---|---|
| **Swagger UI** | http://localhost:3000/api-docs |
| **Health Check** | http://localhost:3000/api/health |
| **Interface Web** (bônus) | http://localhost:3000 |

---

## 🔌 Endpoints

### Automóveis — `/api/automobiles`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/automobiles` | Cadastrar automóvel |
| `GET` | `/api/automobiles` | Listar (filtros: `color`, `brand`) |
| `GET` | `/api/automobiles/:id` | Buscar por ID |
| `PUT` | `/api/automobiles/:id` | Atualizar |
| `DELETE` | `/api/automobiles/:id` | Excluir |

### Motoristas — `/api/drivers`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/drivers` | Cadastrar motorista |
| `GET` | `/api/drivers` | Listar (filtro: `name`) |
| `GET` | `/api/drivers/:id` | Buscar por ID |
| `PUT` | `/api/drivers/:id` | Atualizar |
| `DELETE` | `/api/drivers/:id` | Excluir |

### Utilizações — `/api/usages`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/usages` | Iniciar utilização |
| `PATCH` | `/api/usages/:id/finish` | Finalizar utilização |
| `GET` | `/api/usages` | Listar (com dados populados) |

---

## 📏 Regras de Negócio

- Um automóvel só pode ser utilizado por **um motorista por vez**
- Um motorista com uso ativo **não pode utilizar outro automóvel**
- **Placas duplicadas** não são permitidas
- Automóveis e motoristas com **uso ativo não podem ser excluídos**

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Watch mode
npm run test:watch

# Com relatório de cobertura
npm run test:cov
```

**Cobertura atual:** 88%+ Statements · 91%+ Functions · 50 testes em 6 suites

---

## 🎨 Interface Web (Bônus)

Como diferencial, o projeto inclui uma **interface web premium** acessível em `http://localhost:3000` que permite testar visualmente todos os fluxos da API:

- Dashboard com contadores em tempo real
- CRUD completo de automóveis e motoristas (criar, editar, excluir)
- Controle de utilização com selects inteligentes (itens em uso ficam desabilitados)
- Aba de histórico de utilizações finalizadas
- Modal de confirmação para exclusões
- Notificações toast para feedback visual
- Design responsivo (mobile-friendly)
- Construído com **HTML, CSS e JavaScript puro** — sem frameworks externos

---

## 📁 Estrutura do Projeto

```
├── public/                   # Interface Web (HTML/CSS/JS)
├── src/
│   ├── app.ts                # Configuração do Express
│   ├── server.ts             # Entry point
│   ├── config/               # Variáveis de ambiente
│   ├── controllers/          # Camada HTTP
│   ├── services/             # Regras de negócio
│   ├── repositories/         # Persistência (in-memory)
│   ├── models/               # Interfaces TypeScript
│   ├── schemas/              # Schemas Zod
│   ├── middlewares/          # Error handler, validação
│   ├── errors/               # Classes de erro tipadas
│   ├── docs/                 # Swagger spec
│   └── utils/                # Logger
├── Dockerfile                # Multi-stage build
├── jest.config.js            # Configuração de testes
├── eslint.config.mjs         # ESLint 9 flat config
└── tsconfig.json             # TypeScript config
```

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor em modo dev (hot-reload) |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia servidor de produção |
| `npm test` | Executa todos os testes |
| `npm run test:cov` | Testes com relatório de cobertura |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |

---

## 📄 Licença

ISC
