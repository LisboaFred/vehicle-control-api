# Vehicle Control API

WebAPI RESTful para controle de utilização de automóveis corporativos.

## Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** como framework HTTP
- **Zod** para validação de dados
- **Jest** + **Supertest** para testes
- **Swagger** para documentação da API
- **Docker** para containerização

## Pré-requisitos

- Node.js >= 20
- npm >= 10

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/LisboaFred/vehicle-control-api.git
cd vehicle-control-api

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
```

## Executando

```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Build de produção
npm run build
npm start
```

A API estará disponível em `http://localhost:3000`.

## Testes

```bash
# Executar todos os testes
npm test

# Testes com watch mode
npm run test:watch

# Testes com cobertura
npm run test:cov
```

## Docker

```bash
# Build da imagem
docker build -t vehicle-control-api .

# Executar o container
docker run -p 3000:3000 vehicle-control-api
```

## Documentação da API

Após iniciar o servidor, acesse a documentação interativa Swagger em:

```
http://localhost:3000/api-docs
```

## Endpoints

### Automóveis (`/api/automobiles`)

| Método   | Rota                    | Descrição                                    |
| -------- | ----------------------- | -------------------------------------------- |
| `POST`   | `/api/automobiles`      | Cadastrar novo automóvel                     |
| `GET`    | `/api/automobiles`      | Listar automóveis (filtro: `color`, `brand`) |
| `GET`    | `/api/automobiles/:id`  | Buscar automóvel por ID                      |
| `PUT`    | `/api/automobiles/:id`  | Atualizar automóvel                          |
| `DELETE` | `/api/automobiles/:id`  | Excluir automóvel                            |

### Motoristas (`/api/drivers`)

| Método   | Rota               | Descrição                              |
| -------- | ------------------ | -------------------------------------- |
| `POST`   | `/api/drivers`     | Cadastrar novo motorista               |
| `GET`    | `/api/drivers`     | Listar motoristas (filtro: `name`)     |
| `GET`    | `/api/drivers/:id` | Buscar motorista por ID                |
| `PUT`    | `/api/drivers/:id` | Atualizar motorista                    |
| `DELETE` | `/api/drivers/:id` | Excluir motorista                      |

### Utilizações (`/api/usages`)

| Método  | Rota                     | Descrição                          |
| ------- | ------------------------ | ---------------------------------- |
| `POST`  | `/api/usages`            | Criar registro de utilização       |
| `PATCH` | `/api/usages/:id/finish` | Finalizar utilização               |
| `GET`   | `/api/usages`            | Listar utilizações                 |

## Regras de Negócio

- Um automóvel só pode ser utilizado por **um motorista por vez**.
- Um motorista que já esteja utilizando um automóvel **não pode utilizar outro ao mesmo tempo**.
- Não é permitido cadastrar automóveis com **placas duplicadas**.
- Automóveis e motoristas com **utilização ativa não podem ser excluídos**.

## Estrutura do Projeto

```
src/
├── app.ts                    # Configuração do Express
├── server.ts                 # Entry point
├── config/                   # Configurações
├── controllers/              # Camada de controle (HTTP)
├── services/                 # Camada de regras de negócio
├── repositories/             # Camada de persistência
├── models/                   # Interfaces/tipos
├── schemas/                  # Schemas de validação (Zod)
├── middlewares/              # Middlewares Express
├── errors/                   # Classes de erro customizadas
└── utils/                    # Utilitários
```

## Scripts Disponíveis

| Script            | Descrição                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor em modo dev (hot-reload)  |
| `npm run build`   | Compila TypeScript                 |
| `npm start`       | Inicia servidor de produção        |
| `npm test`        | Executa todos os testes            |
| `npm run test:cov`| Testes com relatório de cobertura  |
| `npm run lint`    | Verifica código com ESLint         |
| `npm run format`  | Formata código com Prettier        |

## Licença

ISC
