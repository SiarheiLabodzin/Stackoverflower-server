import { DataSource, DataSourceOptions } from 'typeorm';

// changed all config rows
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
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [process.env.POSTGRES_ENT],
    migrations: [process.env.POSTGRES_MIGRATIONS],
    synchronize: false,
    migrationsRun: true,
  },
  mailer: {
    transport: {
      host: process.env.MAILER_HOST,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
});

const configuration = config();

export const typeOrmPostgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: configuration.postgres.host,
  port: configuration.postgres.port,
  username: configuration.postgres.username,
  password: configuration.postgres.password,
  database: configuration.postgres.database,
  entities: configuration.postgres.entities,
  migrations: configuration.postgres.migrations,
  synchronize: configuration.postgres.synchronize,
  migrationsRun: configuration.postgres.migrationsRun,
};

const dataSource = new DataSource(typeOrmPostgresConfig);

export default dataSource;
