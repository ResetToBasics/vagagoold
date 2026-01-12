# VagaGoold - Sistema de Agendamentos

## ✅ Requisitos

- Node.js 18+
- MySQL 8

## ⚙️ Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

- `NEXT_PUBLIC_API_URL`: URL base da API usada pelo frontend (`/api` em produção via proxy).
- `API_PROXY_TARGET`: destino real da API quando usar `/api` (ex: `http://localhost:3001`).
- `PORT`: porta do backend.
- `JWT_SECRET`: segredo do JWT (obrigatorio em producao).
- `CORS_ORIGIN`: origem permitida (ex: `http://localhost:3000`).
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_LOGGING`.
- `DB_SYNC`: `true` para sincronizar models automaticamente (apenas dev).
- `DB_SEED`: `true` para popular dados iniciais (apenas dev).

## ▶️ Rodando localmente

Frontend:
```bash
npm install
npm run dev
```

Backend (em outro terminal):
```bash
npm run dev:server
```

Acesse:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3001`

## 📦 Build/produção (local)

```bash
npm run build
npm run build:server
```

Depois:
```bash
npm run start
npm run start:server
```

## ✅ Testes

```bash
npm test
```

## 📲 PWA

- Manifesto: `public/manifest.webmanifest`
- Service Worker: `public/sw.js` (cache básico + fallback em `/offline`)
- Ícones: `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/apple-touch-icon.png`

## 📁 Estrutura do Projeto

```
server/
├── src/                  # Backend Express/Sequelize
│   ├── config/           # Variáveis e configs
│   ├── controllers/      # Controllers HTTP
│   ├── middlewares/      # Autenticação e erros
│   ├── models/           # Models Sequelize
│   ├── routes/           # Rotas da API
│   ├── services/         # Regras de negócio
│   ├── seed-data.ts      # Dados iniciais (seed)
│   ├── utils/            # Helpers
│   ├── app.ts            # App Express
│   └── server.ts         # Bootstrap do servidor
│
src/
├── app/                    # Rotas e páginas (App Router)
│   ├── (admin)/           # Páginas do admin
│   ├── (cliente)/         # Páginas do cliente
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
│
├── components/            # Componentes React reutilizáveis
│   ├── forms/            # Componentes de formulário
│   ├── layout/           # Componentes de estrutura
│   └── ui/               # Componentes de interface
│
├── constants/            # Constantes da aplicação
│   ├── app.ts           # Configurações gerais
│   └── navegacao.ts     # Itens de navegação
│
├── hooks/                # Hooks customizados
│   └── useModal.ts      # Hook para controle de modais
│
├── services/             # Serviços para comunicação com API
│   ├── api.ts           # Cliente HTTP base
│   ├── agendamento.service.ts
│   ├── auth.service.ts
│   ├── cliente.service.ts
│   └── log.service.ts
│
├── types/                # Interfaces e tipos TypeScript
│   ├── agendamento.ts   # Tipos de agendamento
│   ├── cliente.ts       # Tipos de cliente
│   ├── auth.ts          # Tipos de autenticação
│   └── log.ts           # Tipos de log
│
└── utils/                # Funções utilitárias
    └── formatacao.ts    # Helpers de formatação
```
