declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_PORT: number;
    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_ENT: string;
    POSTGRES_MIGRATIONS: string;
    POSTGRES_MIGRATIONS_TABLE_NAME: string;

    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;

    JWT_SECRET: string;

    EMAIL_CONFIRMATION_URL: string;

    MAILER_HOST: string;
    MAILER_USER: string;
    MAILER_PASS: string;
    MAILER_AUTHOR: string;

    RABBITMQ_URLS: string;
    RABBITMQ_QUEUE: string;
  }
}
