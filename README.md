# Universitas — Sistema de Cursos

Aplicação web para uma universidade gerenciar o catálogo de cursos oferecidos.
Autenticação via **Auth0**, com dois papéis (`ADMIN` e `USER`) que controlam
o que cada pessoa pode fazer.

> **Em produção:** http://18.230.59.131

---

## O que o sistema faz

- **Estudantes** (papel `USER`) entram no sistema, fazem login e visualizam
  todo o catálogo de cursos disponíveis na universidade.
- **Administradores** (papel `ADMIN`) também visualizam, e ainda podem:
  - cadastrar novos cursos (código, nome, instrutor, status);
  - deletar cursos existentes.
- Toda ação de cadastro grava o e-mail do admin responsável, criando uma
  trilha simples de auditoria de quem criou cada curso.
- Cursos têm dois status: `DISPONIVEL` ou `CANCELADO`.

A interface filtra cursos por status, dá feedback visual com toasts e tem
estados de loading, erro e vazio.

---

## Como funciona (visão geral)

```
┌──────────┐    OAuth/OIDC    ┌─────────┐
│  Browser ├─────────────────►│  Auth0  │
│  React   │◄─── access ──────│         │
│ (Nginx)  │     token        └─────────┘
└────┬─────┘
     │ Bearer JWT
     ▼
┌──────────┐         ┌────────────┐
│  Node.js ├────────►│ PostgreSQL │
│  Express │  pg     │            │
└──────────┘         └────────────┘
```

### Fluxo de autenticação

1. O usuário abre o frontend e clica **Entrar com Auth0**.
2. É redirecionado para o tenant Auth0 e faz login (universal login).
3. Auth0 emite um **access token (JWT)** assinado em RS256, com o `audience`
   da nossa API e uma claim customizada `https://projgestao-pf/roles`
   (preenchida por uma *Post Login Action*).
4. O frontend guarda o token em `localStorage` (via SDK oficial) e o envia
   no header `Authorization: Bearer <token>` em todas as chamadas à API.
5. O backend valida o token contra a JWKS do tenant (`express-oauth2-jwt-bearer`),
   lê a claim de roles e autoriza/rejeita conforme a rota.

### Autorização nas rotas

| Método | Rota             | Quem pode    | Comportamento                                                     |
|--------|------------------|--------------|-------------------------------------------------------------------|
| GET    | `/health`        | público      | Healthcheck para Docker / monitoramento                          |
| GET    | `/courses`       | ADMIN, USER  | Lista todos os cursos, ordenados por data de cadastro descrescente |
| POST   | `/courses`       | ADMIN        | Cria curso; `admin_email` vem do JWT, não do body                  |
| DELETE | `/courses/:id`   | ADMIN        | Remove curso; valida UUID; 404 se não existe                       |

Sem token → 401. Token de USER em rota de ADMIN → 403. Código duplicado → 409.

### Modelo de dados

```sql
CREATE TYPE course_status AS ENUM ('DISPONIVEL', 'CANCELADO');

CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(32)  NOT NULL UNIQUE,
  name            VARCHAR(200) NOT NULL,
  instructor_name VARCHAR(200) NOT NULL,
  registered_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  status          course_status NOT NULL DEFAULT 'DISPONIVEL',
  admin_email     VARCHAR(255) NOT NULL
);
```

---

## Stack

**Backend** — Node.js 20, Express, `pg` (driver Postgres direto, sem ORM),
`express-oauth2-jwt-bearer` (validação Auth0 oficial), Helmet, CORS, Morgan.
Schema SQL criado idempotentemente no boot.

**Frontend** — React 18 + Vite, Tailwind CSS, `@auth0/auth0-react`
(SDK oficial), React Router. Tipografia Fraunces + Inter. Componentes
próprios para modal, confirm dialog, toast, skeleton e empty state — sem
bibliotecas de UI externas.

**Infra** — Docker Compose com 3 serviços (postgres / backend / frontend),
Nginx servindo o build estático do React dentro do container do frontend
(com fallback `try_files` para a SPA e gzip). Frontend exposto em `:80`
e backend em `:8080` na EC2. Postgres só na rede interna do Docker
(acessível ao backend pelo hostname `postgres:5432`, não publicamente).

**CI/CD** — GitHub Actions: build das imagens, push para Docker Hub
(`eumiguel/projgestao-back` e `eumiguel/projgestao-front`), SCP do
`docker-compose.prod.yml` para o servidor e `docker compose up -d` via SSH.
O workflow também remove containers estranhos (não-pertencentes ao projeto)
e faz prune de imagens/volumes não usados.

---

## Estrutura do repositório

```
projgestao-pf/
├── backend/                # API Node.js
│   ├── src/
│   │   ├── index.js        # bootstrap Express, CORS, error handler
│   │   ├── db.js           # pool pg + criação idempotente do schema
│   │   ├── auth.js         # checkJwt + requireRole + adminEmail
│   │   ├── routes/courses.js
│   │   └── errors.js
│   └── Dockerfile
├── frontend/               # SPA React
│   ├── src/
│   │   ├── main.jsx        # Auth0Provider
│   │   ├── App.jsx         # rotas protegidas
│   │   ├── api.js          # fetch autenticado + tratamento de erro
│   │   ├── config.js
│   │   ├── hooks/useRole.js
│   │   ├── pages/{Login,Courses}.jsx
│   │   └── components/     # Header, CourseCard, Modal, Toast, etc.
│   ├── nginx.conf
│   └── Dockerfile          # multi-stage: node build → nginx serve
├── docker-compose.prod.yml
└── .github/workflows/deploy.yml
```

---

## Decisões de design

- **Sem ORM.** O domínio é uma única tabela com 6 colunas. SQL direto é mais
  fácil de revisar e auditar do que migrations + abstrações.
- **Custom claim para roles e email.** O access token padrão do Auth0 não
  inclui dados do usuário; uma Action de Post Login adiciona claims namespaced
  (`https://projgestao-pf/roles` e `.../email`) ao token. O backend é a fonte
  da verdade — o frontend só esconde botões por UX, não por segurança.
- **`admin_email` vem do JWT, não do body.** Garante que o registro de
  auditoria corresponde sempre ao usuário autenticado, sem como falsificar.
- **Tokens em `localStorage` + refresh tokens rotativos.** Resiliente a
  refresh da página; balance entre UX e segurança comum em SPAs autenticadas.
- **Build-time envs no frontend.** As variáveis `VITE_*` ficam embutidas no
  bundle — não são segredos (Client ID e Domain do Auth0 são públicos por
  design no fluxo OIDC para SPAs).
- **Só 3 secrets reais no CI:** `DOCKERHUB_TOKEN`, `SSH_PRIVATE_KEY` e
  `POSTGRES_PASSWORD`. O resto está inline no workflow porque não é segredo.
