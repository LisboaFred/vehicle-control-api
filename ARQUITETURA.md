# Resumo e Arquitetura do Projeto: Vehicle Control API

Este documento tem como objetivo explicar detalhadamente tudo o que existe no projeto, qual a ideia central, por que as escolhas técnicas foram feitas e como a arquitetura está desenhada.

---

## 🎯 1. A Ideia do Projeto (O quê e Por quê?)

A ideia principal do projeto é ser um sistema de **Controle de Frota de Veículos Corporativos**. O sistema permite:
1. **Cadastrar Automóveis** (Placa, Cor, Marca).
2. **Cadastrar Motoristas** (Nome).
3. **Controlar Utilizações**: Registrar quando um motorista "pega" um carro (check-in) e quando ele o "devolve" (check-out).

### Por que esse sistema existe?
Problemas comuns em empresas com frota própria:
- Não saber com quem o carro X está no momento.
- Um motorista pegar um carro que já está sendo usado (conflito de chaves).
- Motoristas tentando usar dois carros ao mesmo tempo.
- Perda do histórico de quem usou qual carro e quando.

O sistema resolve isso através das **Regras de Negócio**:
- Um carro não pode ser usado por mais de um motorista ao mesmo tempo.
- Um motorista não pode usar mais de um carro simultaneamente.
- Não se pode excluir um carro ou motorista enquanto eles estiverem com uso ativo.

---

## 🏗️ 2. Arquitetura do Projeto (A Estrutura Completa)

O projeto segue um padrão arquitetural em **Camadas (Layered Architecture) / MVC (Model-View-Controller) simplificado**.
Tudo foi feito de maneira isolada para que, caso o projeto cresça, seja fácil trocar partes dele (ex: trocar a forma de salvar no banco de dados) sem quebrar o restante.

### Visão Geral dos Diretórios (`src/`):

* **`server.ts` e `app.ts`**: São a "porta de entrada" da aplicação. O `app.ts` configura o servidor web (Express), e o `server.ts` efetivamente sobe o servidor na porta (ex: 3000) e lida com o desligamento correto (*graceful shutdown*).
* **`models/` (Modelos)**: Contém as interfaces (tipagens) das entidades principais (`Automobile`, `Driver`, `Usage`). É aqui que dizemos que um Automóvel tem ID, Placa, Cor, etc.
* **`repositories/` (Repositórios - Banco de Dados)**: É a camada que conversa com o armazenamento.
* **`services/` (Serviços - Regras de Negócio)**: É o cérebro da aplicação. Aqui ficam as regras duras.
* **`controllers/` (Controladores)**: É a ponte entre a requisição da web e o *Service*.
* **`routes/` (Rotas)**: Dizem qual Controller responde para qual URL da web (ex: `POST /api/automobiles`).
* **`schemas/` (Esquemas de Validação)**: Usam a biblioteca **Zod** para validar se os dados que o usuário enviou pela internet estão corretos antes mesmo de chegarem no Controller.
* **`errors/` (Erros)**: Classes de erro padronizadas para que a aplicação sempre saiba se um erro é por "Não Encontrado" (404) ou "Regra de Negócio" (422) e consiga devolver um JSON limpo para o cliente em vez de quebrar o servidor.
* **`middlewares/`**: Funções que interceptam as requisições (ex: `error-handler` que captura erros, `validate` que checa o Zod, `request-id` que cria um ID único para rastrear logs da requisição).
* **`/public` (Frontend)**: Como é uma API, o frontend foi embutido como arquivos estáticos (`index.html`, `app.js`, `style.css`). O Frontend se comunica por chamadas HTTP (`fetch`) para a API, agindo de forma completamente isolada do backend.

---

## 🛠️ 3. Por que escolhemos essas tecnologias?

- **Node.js + Express**: Padrão da indústria. Leve, rápido e com o maior ecossistema da web. O Express v5 está sendo utilizado pois tem suporte nativo melhorado e tratamentos de promessas (async/await) mais polidos.
- **TypeScript**: O JavaScript puro é frágil porque não tem tipagem estática (você pode somar um número com uma maçã e ele tentará fazer isso). O TypeScript evita erros logo quando o código está sendo escrito (tempo de compilação), deixando o projeto corporativo seguro.
- **Banco de Dados em Memória (Arrays)**:
  - **A Escolha:** No momento, o projeto usa "arrays" dentro dos arquivos da pasta `repositories` em vez de um banco real (como PostgreSQL).
  - **O Porquê:** Foi feito para ser um **MVP** (Minimum Viable Product - Produto Mínimo Viável) extremamente fácil de rodar. O usuário só precisa dar `npm install` e `npm run dev` e tudo funciona. Se usasse um PostgreSQL, obrigaria quem baixou a instalar o DB, configurar credenciais, rodar Docker, etc.
  - **Como foi pensado para escalar:** A arquitetura Repository permite que amanhã possamos plugar um ORM (Prisma/TypeORM), trocar as funções de "array.push" para um `db.insert`, e o resto do sistema **inteiro** continuará funcionando sem precisar mexer em nenhuma regra de negócio.
- **Zod (Validação)**: Validar dados "na mão" gera muito código (`if (!nome) return erro`). O Zod faz tudo de forma elegante e segura, barrando lixo de chegar na base.
- **Frontend Vanilla (Puro, sem React/Vue)**: O sistema é leve e a ideia central é demonstrar o backend e a API. Fazer em HTML/CSS/JS puro evita adicionar processos de `build` de React/Vite gigantescos. O sistema liga e funciona instantaneamente em uma única tela (SPA real).
- **Jest (Testes)**: O projeto possui quase **100% de Cobertura de Código** em testes unitários automatizados. É a garantia de que as regras de negócio não serão quebradas quando novos códigos forem adicionados no futuro.

---

## 🔄 4. O Ciclo de uma Requisição (Como as peças se conectam?)

Se um usuário no frontend preenche o formulário e clica em **"Iniciar Uso"**, o seguinte acontece:

1. **Frontend (`app.js`)**: Faz uma requisição `POST` via fetch para a URL `/api/usages`.
2. **Rota (`routes/usage.routes.ts`)**: O Express vê que chegou uma requisição na porta 3000 em `/api/usages`. Ele envia isso para o Middleware de validação.
3. **Validação (`middlewares/validate.ts` + `schemas/usage.schema.ts`)**: O Zod olha o JSON e checa: "Tem o ID do carro? Tem o ID do motorista?". Se faltar, devolve Erro 400. Se estiver certo, libera a passagem.
4. **Controller (`controllers/usage.controller.ts`)**: Pega os dados validados e manda para o Service fazer o trabalho pesado.
5. **Service (`services/usage.service.ts`)**: Checa regras de negócio cruciais:
   - "O carro existe?" (se não, joga erro 404).
   - "O carro já está sendo usado?" (se sim, joga erro 422 - BusinessRuleError).
   - Se tudo estiver perfeito, ele monta um objeto `Usage` com data de hoje e envia para o Repository.
6. **Repository (`repositories/usage.repository.ts`)**: Pega o objeto montado, adiciona no seu "Banco de Dados" (Array) e devolve a confirmação.
7. O Controller envia a reposta `201 Created` de volta para o Frontend. O Frontend atualiza a tela para a aba "Ativos".

---

## 🔒 5. Segurança e Qualidade de Vida

- **Helmet**: Adiciona headers HTTP avançados de proteção cibernética contra ataques como XSS.
- **Rate Limit**: Impede que scripts maliciosos derrubem a API fazendo milhares de requisições por segundo.
- **Swagger (`/api-docs`)**: Toda a API está catalogada, detalhando exatamente quais campos enviar para qual rota. Isso facilita se uma equipe externa (ou de app mobile) quiser consumir nossa API.
- **ESLint & Prettier**: Como um cão de guarda, garante que o código inteiro está identado igual e sem más práticas, independentemente de qual desenvolvedor mexeu nele.
