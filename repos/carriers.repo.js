const pool = require('../db/pool');

const getAllCarriers = async () => {
    let carriers = await pool.query(`
            SELECT * FROM carriers`)

    return carriers.rows
}

module.exports = {getAllCarriers}