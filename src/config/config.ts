import { url } from 'inspector';
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';

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
    url: process.env.POSTGRES_URL,
    entities: [process.env.POSTGRES_ENT],
    migrations: [process.env.POSTGRES_MIGRATIONS],
    synchronize: false,
    migrationsRun: true,
    ssl: false,
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
  url: configuration.postgres.url,
  entities: configuration.postgres.entities?.filter(
    (entity) => entity !== undefined,
  ) as (string | Function | EntitySchema<any>)[],
  migrations: configuration.postgres.migrations?.filter(
    (migration) => migration !== undefined,
  ) as (string | Function)[],
  synchronize: configuration.postgres.synchronize,
  migrationsRun: configuration.postgres.migrationsRun,
  ssl: configuration.postgres.ssl,
};

const dataSource = new DataSource(typeOrmPostgresConfig);

export default dataSource;
