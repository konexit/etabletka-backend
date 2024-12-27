import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: '10.10.1.15',
  port: 5432,
  username: 'etabletka',
  password: 'qTK0vU4d$JA0rJTQosWD',
  database: 'etabletka',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

