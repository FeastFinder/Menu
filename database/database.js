const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  database: 'menus',
  port: 5432,
});

module.exports = { pool };
