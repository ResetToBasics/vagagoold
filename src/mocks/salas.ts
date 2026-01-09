import type { SalaAgendamento } from '@/types';

export const SALAS_MOCK: SalaAgendamento[] = [
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
