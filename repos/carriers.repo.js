const pool = require('../db/pool');

const getAllCarriers = async () => {
    let carriers = await pool.query(`
            SELECT * FROM carriers`)

    return carriers.rows
}

const getCarrierIdByUser = async (id) => {
    let carrier = await pool.query(`
        SELECT carrier_id
        FROM carrier_users
        WHERE carrier_users.id = $1
        ` , [id])

    return carrier.rows[0].carrier_id
}

const editCarrier = async (carrierId , payload) => {
       const result = await pool.query(`
        UPDATE carriers
        SET 
            name = COALESCE($1, name),
            scac = COALESCE($2, scac),
            address = COALESCE($3, address)
        WHERE id = $4
        RETURNING *
    `, [payload.name, payload.scac, payload.address, carrierId])

    return result.rows[0]
}

const addCarrier = async (payload) => {
    const result = await pool.query(`
        INSERT INTO carriers
        (name , scac , address)
        VALUES ($1 , $2 , $3)
        RETURNING *`,[payload.name , payload.scac , payload.address])

        return result.rows[0]
}

module.exports = {getAllCarriers , getCarrierIdByUser , editCarrier , addCarrier}