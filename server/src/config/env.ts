import 'dotenv/config';

export const env = {
    port: Number(process.env.PORT ?? 3001),
    useMocks: process.env.USE_MOCKS !== 'false',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    db: {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 3306),
        database: process.env.DB_NAME ?? 'vagagoold',
        user: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        logging: process.env.DB_LOGGING === 'true',
    },
};
