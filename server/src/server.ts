import { app } from './app';
import { env } from './config/env';
import { sequelize } from './database';
import './models';
import { seedDatabase } from './seed';

const iniciarServidor = async () => {
    await sequelize.authenticate();
    if (env.db.sync) {
        await sequelize.sync();
    }
    if (env.db.seed) {
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
