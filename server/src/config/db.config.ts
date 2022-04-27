import { join } from 'path';
import { DataSource } from 'typeorm';

const entities = join(__dirname, '..', 'models/*.model.{js,ts}');
console.log(entities);

export const db = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  ...(process.env.NODE_ENV !== 'development'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
  entities: [entities],
});

export const onDatabaseReady = async (cb: () => Promise<void>) => {
  await db.initialize();
  console.log('Connection to Postgres established!');
  await cb();
};
