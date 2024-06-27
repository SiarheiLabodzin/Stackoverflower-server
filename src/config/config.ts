export const config = () => ({
  redis: {
    type: 'single',
    options: {
      password: process.env.REDIS_PASSWORD,
      port: Number(process.env.REDIS_PORT),
    },
  },
  postgres: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [],
    synchronize: true,
  },
});
