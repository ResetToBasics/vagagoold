import { randomUUID } from 'crypto';
import { Agendamento, Log, Sala, User } from './models';
import { mockAgendamentos, mockLogs, mockSalas, mockUsuarios } from './mocks/data';

const obterIdMapeado = (mapa: Map<string, string>, id: string, entidade: string) => {
    const novoId = mapa.get(id);
    if (!novoId) {
        throw new Error(`Seed: ${entidade} ${id} nao encontrado`);
    }
    return novoId;
};

export const seedDatabase = async () => {
    const usuariosExistem = await User.count();
    if (usuariosExistem > 0) return;

    const mapaUsuarios = new Map<string, string>();
    const usuariosSeed = mockUsuarios.map((usuario) => {
        const id = randomUUID();
        mapaUsuarios.set(usuario.id, id);
        return { ...usuario, id };
    });

    const mapaSalas = new Map<string, string>();
    const salasSeed = mockSalas.map((sala) => {
        const id = randomUUID();
        mapaSalas.set(sala.id, id);
        return { ...sala, id };
    });

    const agendamentosSeed = mockAgendamentos.map((agendamento) => ({
        ...agendamento,
        id: randomUUID(),
        clienteId: obterIdMapeado(mapaUsuarios, agendamento.clienteId, 'cliente'),
        salaId: obterIdMapeado(mapaSalas, agendamento.salaId, 'sala'),
        dataHora: new Date(agendamento.dataHora),
    }));

    const logsSeed = mockLogs.map((log) => ({
        ...log,
        id: randomUUID(),
        clienteId: obterIdMapeado(mapaUsuarios, log.clienteId, 'cliente'),
        dataHora: new Date(log.dataHora),
    }));

    await User.bulkCreate(usuariosSeed);
    await Sala.bulkCreate(salasSeed);
    await Agendamento.bulkCreate(
        agendamentosSeed
    );
    await Log.bulkCreate(logsSeed);
};
