const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "2711",
  host: "localhost",
  port: 5432,
  database: "cricbuzz",
});

module.exports = pool;
