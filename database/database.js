const { Pool } = require('pg');
const { host } = require('./urls');
const { password, database, port } = require('./config');

const pool = new Pool({
  host,
  password,
  database,
  port,
});

module.exports = { pool };

