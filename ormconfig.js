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

module.exports = {
  type: `postgres`,
  url: `${process.env.DATABASE_URL}`,
  synchronize: false,
  logging: false,
  entities: [
    'libs/efile-api-data/src/tables/entity/**/*.entity{.ts,.js}',
    'libs/sdvv-database/src/f460d/*.entity{.ts,.js}',
    'libs/sdvv-database/src/jurisdictions/*.entity{.ts,.js}',
    'libs/sdvv-database/src/zipCodes/*.entity{.ts,.js}',
    'libs/sdvv-database/src/zipCodes/*.entity{.ts,.js}',
  ],
  migrationsTableName: 'migrations_typeorm',
  migrations: ['apps/migration/**/*{.ts,.js}'],
  cli: { migrationsDir: 'apps/migration' },
  ssl: getTlsOptions(),
};