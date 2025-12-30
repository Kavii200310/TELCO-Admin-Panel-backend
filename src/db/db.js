const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "esim_db",
  password: "20031021",
  port: 5432,
});

module.exports = pool;

