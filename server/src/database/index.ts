import { Sequelize } from 'sequelize';
import { env } from '../config/env';

export const sequelize = new Sequelize(
    env.db.database,
    env.db.user,
    env.db.password,
    {
        host: env.db.host,
        port: env.db.port,
        dialect: 'mysql',
        logging: env.db.logging ? console.log : false,
    }
);
