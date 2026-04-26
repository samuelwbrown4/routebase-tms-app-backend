const pool = require('../db/pool');

const createShipperUser = async (locationId , erpId , firstName , lastName , email , phone , role ) => {
    let newUser = await pool.query(`
        INSERT INTO shipper_users (location_id , erp_id , first_name , last_name , email , phone_number , role)
        VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7)
        RETURNING *
        ` , [locationId , erpId , firstName , lastName , email , phone , role])

        return newUser.rows[0]
}

const getShipperUserByEmail = async (email) => {
    const user = await pool.query(`
       SELECT *
       FROM shipper_users
       WHERE email = $1
        ` , [email])

    return user.rows?.[0].id
}

const updateNewShipperUser = async (id , hashedPassword) => {
    const update = await pool.query(`
        UPDATE shipper_users

        SET password_hash = $2,
            newUser = false

        WHERE shipper_users.id = $1
        RETURNING *` , [id , hashedPassword])

    return update.rows[0]
}

const getAllShipperUsers = async (companyId) => {
    const users = await pool.query(`
        SELECT *
        FROM shipper_users
        JOIN shipper_locations ON shipper_locations.id = shipper_users.location_id
        WHERE shipper_locations.company_id = $1
        ` , [companyId])

    return users.rows
}

module.exports = {createShipperUser , getShipperUserByEmail , updateNewShipperUser , getAllShipperUsers}