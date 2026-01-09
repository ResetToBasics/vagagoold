import bcrypt from 'bcryptjs';

const hashSenha = (senha: string) => bcrypt.hashSync(senha, 10);

export const mockUsuarios = [
    {
        id: 'usr-admin',
        nome: 'Mateus Barbosa',
        email: 'admin@vagagoold.com.br',
        senhaHash: hashSenha('admin123'),
        role: 'admin',
        ativo: true,
        endereco: null,
        permissoes: null,
    },
    {
        id: 'cli-001',
        nome: 'Camila Mendes',
        email: 'camila@exemplo.com',
        senhaHash: hashSenha('123456'),
        role: 'cliente',
        ativo: true,
        endereco: {
            logradouro: 'Rua Coronel Irineu de Castro',
            numero: '43',
            complemento: 'Apto 12',
            bairro: 'Jardim Analia Franco',
            cidade: 'Sao Paulo',
            estado: 'SP',
            cep: '03333-000',
        },
        permissoes: ['agendamentos', 'logs'],
    },
    {
        id: 'cli-002',
        nome: 'Beatriz Costa',
        email: 'beatriz@exemplo.com',
        senhaHash: hashSenha('123456'),
        role: 'cliente',
        ativo: true,
        endereco: {
            logradouro: 'Avenida Brasil',
            numero: '1200',
            complemento: 'Casa',
            bairro: 'Jardim Paulista',
            cidade: 'Sao Paulo',
            estado: 'SP',
            cep: '01430-000',
        },
        permissoes: ['agendamentos'],
    },
    {
        id: 'cli-003',
        nome: 'Joana Barbosa',
        email: 'joana@exemplo.com',
        senhaHash: hashSenha('123456'),
        role: 'cliente',
        ativo: false,
        endereco: {
            logradouro: 'Rua das Flores',
            numero: '780',
            complemento: 'Bloco B',
            bairro: 'Vila Mariana',
            cidade: 'Sao Paulo',
            estado: 'SP',
            cep: '04100-000',
        },
        permissoes: ['logs'],
    },
];

export const mockSalas = [
    {
        id: 'sala-012',
        nome: 'Sala 012',
        horarioInicio: '08:00',
        horarioFim: '18:00',
        duracaoBloco: 30,
        ativa: true,
    },
    {
        id: 'sala-013',
        nome: 'Sala 013',
        horarioInicio: '09:00',
        horarioFim: '19:00',
        duracaoBloco: 45,
        ativa: true,
    },
];

export const mockAgendamentos = [
    {
        id: 'ag-001',
        dataHora: '2025-01-22T16:00:00',
        clienteId: 'cli-001',
        salaId: 'sala-012',
        status: 'pendente',
    },
    {
        id: 'ag-002',
        dataHora: '2025-01-22T15:00:00',
        clienteId: 'cli-002',
        salaId: 'sala-012',
        status: 'pendente',
    },
    {
        id: 'ag-003',
        dataHora: '2025-01-21T16:00:00',
        clienteId: 'cli-001',
        salaId: 'sala-012',
        status: 'agendado',
    },
    {
        id: 'ag-004',
        dataHora: '2025-01-20T16:00:00',
        clienteId: 'cli-003',
        salaId: 'sala-012',
        status: 'agendado',
    },
    {
        id: 'ag-005',
        dataHora: '2025-01-19T16:00:00',
        clienteId: 'cli-002',
        salaId: 'sala-012',
        status: 'cancelado',
    },
];

export const mockLogs = [
    {
        id: 'log-001',
        clienteId: 'cli-001',
        tipoAtividade: 'criacao_agendamento',
        modulo: 'agendamento',
        dataHora: '2025-06-04T22:00:00',
    },
    {
        id: 'log-002',
        clienteId: 'cli-002',
        tipoAtividade: 'login',
        modulo: 'minha_conta',
        dataHora: '2025-06-04T21:40:00',
    },
    {
        id: 'log-003',
        clienteId: 'cli-003',
        tipoAtividade: 'logout',
        modulo: 'minha_conta',
        dataHora: '2025-06-04T21:38:00',
    },
    {
        id: 'log-004',
        clienteId: 'cli-001',
        tipoAtividade: 'cancelamento_agendamento',
        modulo: 'agendamento',
        dataHora: '2025-06-04T21:21:00',
    },
];
