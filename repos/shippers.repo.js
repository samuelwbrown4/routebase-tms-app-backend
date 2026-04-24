const pool = require('../db/pool');

const getCompanyId = async (id) => {
    const companyId = await pool.query(`
        SELECT companies.id

        FROM companies

        JOIN shipper_locations ON shipper_locations.company_id = companies.id
        JOIN shipper_users ON shipper_users.location_id = shipper_locations.id

        WHERE shipper_users.id = $1
        ` , [id])

        return companyId.rows[0].id
}

const getShipperLocationId = async (id) => {
    const shipperLocationId = await pool.query(`
        SELECT shipper_locations.id
        FROM shipper_locations
        JOIN shipper_users ON shipper_users.location_id = shipper_locations.id
        WHERE shipper_users.id = $1
        ` , [id])

        return shipperLocationId.rows[0].id
}

const getAllShipperLocationsByCompanyId = async (id) => {
    const locations = await pool.query(`
        SELECT 
        id,
        company_id,
        erp_id,
        name

        FROM shipper_locations

        WHERE company_id = $1
        ` , [id])

    return locations.rows
}

module.exports = {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId}