import 'dotenv/config';
import { DataSourceOptions, DataSource } from 'typeorm';

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_NAME, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false
};

export default new DataSource(dataSourceOptions);