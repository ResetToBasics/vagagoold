# VagaGoold - Sistema de Agendamentos



## 📁 Estrutura do Projeto

```
server/
├── src/                  # Backend Express/Sequelize
│   ├── config/           # Variáveis e configs
│   ├── controllers/      # Controllers HTTP
│   ├── middlewares/      # Autenticação e erros
│   ├── mocks/            # Mocks para testes
│   ├── models/           # Models Sequelize
│   ├── routes/           # Rotas da API
│   ├── services/         # Regras de negócio
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
├── mocks/                # Mocks para testes e fallback
│   ├── agendamentos.ts
│   ├── clientes.ts
│   ├── logs.ts
│   └── salas.ts
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

