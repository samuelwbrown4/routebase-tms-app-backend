const pool = require('../db/pool');

const createShipperUser = async (payload) => {
    let newUser = await pool.query(`
        INSERT INTO shipper_users (location_id , erp_id , first_name , last_name , email , phone_number , role)
        VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7)
        RETURNING *
        ` , [payload.locationId , payload.erpId , payload.firstName , payload.lastName , payload.email , payload.phone , payload.role])

        return newUser.rows[0]
}

const editShipperUser = async (payload) => {
    let editedUser = await pool.query(`
        UPDATE shipper_users 
        SET location_id = $1,
            erp_id = $2,
            first_name = $3,
            last_name = $4,
            email = $5,
            phone_number = $6,
            role = $7

        WHERE shipper_users.id = $8
        RETURNING *`,[payload.locationId , payload.erpId , payload.firstName , payload.lastName , payload.email , payload.phone , payload.role , payload.userId]);

    return editedUser.rows[0]
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
        SELECT 
        shipper_users.id AS user_id,
        shipper_users.location_id,
        shipper_locations.name AS location_name,
        shipper_users.first_name,
        shipper_users.last_name,
        shipper_users.email,
        shipper_users.phone_number,
        shipper_users.role,
        shipper_users.newUser

        FROM shipper_users
        JOIN shipper_locations ON shipper_locations.id = shipper_users.location_id
        WHERE shipper_locations.company_id = $1
        ` , [companyId])

    return users.rows
}

module.exports = {createShipperUser , getShipperUserByEmail , updateNewShipperUser , getAllShipperUsers , editShipperUser}