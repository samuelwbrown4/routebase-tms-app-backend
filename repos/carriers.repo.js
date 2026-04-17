const pool = require('../db/pool');

const getAllCarriers = async () => {
    let carriers = await pool.query(`
            SELECT * FROM carriers`)

    return carriers.rows
}

const getCarrierIdByUser = async (id) => {
    let carrier = await pool.query(`
        SELECT carrier_users.carrier_id
        FROM carrier_users
        WHERE carrier_users.id = $1
        ` , [id])

    return carrier.rows[0]?.carrier_id
}

module.exports = {getAllCarriers , getCarrierIdByUser}