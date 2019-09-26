const { Pool } = require('pg');
const url = require('./urls');

const pool = new Pool({
  host: url.host,
  database: 'menus',
  port: 5432,
});

module.exports = { pool };
