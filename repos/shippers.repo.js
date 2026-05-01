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

const getShipmentsByShipperLocation = async (id , status ) => {
            const response = await pool.query(`
            SELECT 
            
            shipments.id,
            shipments.shipment_number,
            shipper_locations.name AS origin,
            shipper_locations.address AS origin_address,
            shipper_locations.city AS origin_city,
            shipper_locations.state AS origin_state,
            shipper_locations.zip_code AS origin_zip,
            customer_locations.name AS destination,
            customer_locations.address AS destination_address,
            customer_locations.city AS destination_city,
            customer_locations.state AS destination_state,
            customer_locations.zip_code AS destination_zip,
            shipments.equipment_type_id,
            shipments.status,
            shipments.total_weight,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.actual_pickup_date,
            shipments.actual_delivery_date

            FROM shipments 

           
            JOIN shipper_locations ON shipper_locations.id = shipments.origin_id
            JOIN customer_locations ON customer_locations.id = shipments.destination_id

            WHERE shipper_locations.id = $1 
            AND shipments.status = ANY($2)
            ` , [id , status ])

        return response.rows
}

module.exports = {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId , getShipmentsByShipperLocation}