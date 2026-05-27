const { Pool } = require('pg');
const pg = require('pg')

pg.types.setTypeParser(1114, str => str) // TIMESTAMP
pg.types.setTypeParser(1184, str => str) // TIMESTAMPTZ

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'tms_app',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
})


module.exports = pool;