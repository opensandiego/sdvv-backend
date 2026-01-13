import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

function isProduction() {
  return process.env.NODE_ENV === 'production' ? true : false;
}

function getTlsOptions() {
  return isProduction()
    ? {
        rejectUnauthorized: false,
      }
    : false;
}

const PostgresDataSource = new DataSource({
  type: `postgres`,
  url: `${process.env.DATABASE_URL}`,
  synchronize: false,
  logging: false,
  entities: [
    'libs/efile-api-data/src/tables/entity/**/*.entity{.ts,.js}',
    'libs/sdvv-database/src/f460d/*.entity{.ts,.js}',
    'libs/sdvv-database/src/tables-xlsx/expn/*.entity{.ts,.js}',
    'libs/sdvv-database/src/tables-xlsx/rcpt/*.entity{.ts,.js}',
    'libs/sdvv-database/src/tables-xlsx/s496/*.entity{.ts,.js}',
    'libs/sdvv-database/src/jurisdictions/*.entity{.ts,.js}',
    'libs/sdvv-database/src/zipCodes/*.entity{.ts,.js}',
    'libs/sdvv-database/src/candidate/*.entity{.ts,.js}',
  ],
  migrationsTableName: 'migrations_typeorm',
  migrations: ['apps/migration/**/*{.ts,.js}'],
  // cli: { migrationsDir: 'apps/migration' },
  ssl: getTlsOptions(),
});
/**
 * To Generate migrations run a command similar to the following:
 *   npm run typeorm migration:generate -n ./apps/migration/<< replace with a name for the migration >> -- -d ./orm-data-source.ts
 * Example:
 *   npm run typeorm migration:generate -n ./apps/migration/My_Changed_Field -- -d ./orm-data-source.ts
 */

export default PostgresDataSource;
