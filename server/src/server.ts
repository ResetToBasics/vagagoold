import { app } from './app';
import { env } from './config/env';
import { sequelize } from './database';
import './models';
import { seedDatabase } from './seed';

const iniciarServidor = async () => {
    if (process.env.NODE_ENV === 'production' && env.useMocks) {
        throw new Error('USE_MOCKS deve ser false em producao');
    }

    if (!env.useMocks) {
        await sequelize.authenticate();
        await sequelize.sync();
        await seedDatabase();
    }

    app.listen(env.port, () => {
        console.log(`Servidor rodando na porta ${env.port}`);
    });
};

iniciarServidor().catch((erro) => {
    console.error('Erro ao iniciar servidor:', erro);
    process.exit(1);
});
