const { Pool } = require("pg");
const { dbConfig } = require("../configure/config");

const pool = new Pool({
  user: dbConfig.PGUSER,
  host: dbConfig.PGHOST,
  database: dbConfig.PGDATABASE,
  password: dbConfig.PGPASSWORD,
  port: dbConfig.PGPORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
