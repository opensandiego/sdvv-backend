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
  synchronize: !isProduction(),
  ssl: getTlsOptions(),
};
