# Node OTP Auth

Este projeto foi desenvolvido durante o curso de Node.js da **B7WEB**, porém **foi amplamente aprimorado por mim em relação ao projeto original do curso**, com foco em melhorar **arquitetura**, **organização**, **segurança**, **padronização de erros/respostas** e **manutenibilidade**.

O objetivo deste repositório é praticar conceitos de **API REST**, **validação**, **tipagem com TypeScript**, **Prisma + PostgreSQL** e **boas práticas de backend**.

---

## Visão geral (como funciona)

O fluxo de autenticação é dividido em 3 etapas principais:

1. **Cadastro (`/auth/signup`)**
   - Cria um usuário com `name` e `email`.

2. **Início de login (`/auth/signin`)**
   - Verifica se o e-mail existe.
   - Gera um OTP com expiração (ex.: 30 minutos).
   - Envia o OTP para o e-mail do usuário.
   - Retorna o `id` do OTP gerado (para ser usado na validação).

3. **Validação do OTP (`/auth/validateotp`)**
   - Valida se o OTP existe, não expirou e ainda não foi usado.
   - Marca o OTP como **used**.
   - Gera um **JWT** (com expiração).
   - Retorna `{ token, user }`.

Com o JWT em mãos, é possível acessar rotas privadas enviando:

`Authorization: Bearer <token>`

---

## Endpoints

### Health check
- `GET /ping`  
  Retorna um payload simples para verificar se a API está online.

### Auth
- `POST /auth/signup`  
  Body:
  ```json
  { "name": "Seu Nome", "email": "email@exemplo.com" }
  ```

- `POST /auth/signin`  
  Body:
  ```json
  { "email": "email@exemplo.com" }
  ```
  Retorno (exemplo):
  ```json
  { "id": "otp-id-gerado" }
  ```

- `POST /auth/validateotp`  
  Body:
  ```json
  { "id": "otp-id-gerado", "code": "123456" }
  ```
  Retorno (exemplo):
  ```json
  { "token": "jwt", "user": { "id": 1, "name": "Seu Nome", "email": "email@exemplo.com" } }
  ```

### Private
- `GET /private` (rota protegida)  
  Header:
  - `Authorization: Bearer <token>`

---

## Stack / Tecnologias

- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** (validação)
- **JWT** (`jsonwebtoken`)
- **Mailtrap** (envio de e-mail em ambiente de testes)
- **Helmet + CORS**
- **TSX** (ambiente dev com watch)

---

## Melhorias implementadas

Este projeto foi aprimorado com várias melhorias que aumentam **qualidade do código**, **manutenibilidade** e **robustez** da API:

### 1) Arquitetura em camadas e separação de responsabilidades
O código foi organizado para isolar preocupações:
- `controllers/`: recebem requests e orquestram o fluxo
- `services/`: regras de negócio e acesso ao banco
- `validators/`: validação de entrada (request) por caso de uso
- `helpers/`: utilidades reutilizáveis (OTP, JWT do header, etc.)
- `middlewares/`: regras transversais (ex.: validar JWT)
- `mappers/`: transformação/serialização (ex.: expor `PublicUser`)

Resultado: o projeto fica mais simples de evoluir e mais fácil de manter.

### 2) Padronização de retornos e erros (Result Pattern)
As funções principais retornam um formato consistente (`Result<T>`), separando:
- sucesso: `{ success: true, data }`
- erro: `{ success: false, error: { statusCode, messages } }`

Resultado: respostas mais previsíveis, menos `if` confuso e melhor experiência para quem consome a API.

### 3) JWT mais seguro e middleware mais robusto
- O token JWT é gerado com expiração (`expiresIn`).
- O parsing do header `Authorization` valida corretamente o formato `Bearer <token>`.
- O middleware injeta `req.userId` de forma tipada.

Resultado: autenticação mais segura e mais fácil de reutilizar em novas rotas privadas.

### 4) OTP mais confiável
- Geração de OTP encapsulada em helper.
- Expiração baseada no relógio do servidor, sem “ajustes manuais” de timezone.
- OTP é invalidado após uso (`used = true`).

Resultado: fluxo de OTP mais consistente e fácil de ajustar (tamanho do código/tempo de expiração).

### 5) Logs estruturados
Foi adicionado um logger simples com logs em JSON (com timestamp, nível, evento e contexto).

Resultado: facilita debugging e observabilidade (mesmo em projeto de estudo, é uma prática muito valiosa).

---

## Requisitos

- Node.js (recomendado: versão atual LTS)
- PostgreSQL (local ou via Docker)
- Conta/token do Mailtrap (modo sandbox/testes)

---

## Configuração

1) Instale dependências:

```bash
npm install
```

2) Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
MAILTRAP_TOKEN=SEU_TOKEN_AQUI
JWT_SECRET=UMA_CHAVE_BEM_FORTE_AQUI
```

3) Rode as migrations do Prisma:

```bash
npx prisma migrate dev
```

4) Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

Servidor iniciará em:

- `http://localhost:<PORT>`

---

## Estrutura do banco (Prisma)

Modelos principais:
- `User`: `{ id, name, email }`
- `Otp`: `{ id, code, userId, expiresAt, used }`
