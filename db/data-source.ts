import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: '77.222.132.58',
  port: 2345,
  username: 'etabletka',
  password: 'qTK0vU4d$JA0rJTQosWD',
  database: 'etabletka',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;