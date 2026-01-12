import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProd = nodeEnv === 'production';

if (isProd && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET precisa estar configurado em producao');
}

export const env = {
    nodeEnv,
    port: Number(process.env.PORT ?? 3001),
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    db: {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 3306),
        database: process.env.DB_NAME ?? 'vagagoold',
        user: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        logging: process.env.DB_LOGGING === 'true',
        sync: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : !isProd,
        seed: process.env.DB_SEED === 'true',
    },
};
