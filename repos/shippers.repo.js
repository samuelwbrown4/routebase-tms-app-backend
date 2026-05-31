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

const getCompanyIdByShipperLoc = async (id) => {
    const companyId = await pool.query(`
        SELECT shipper_locations.company_id
        FROM shipper_locations
        WHERE shipper_locations.id = $1
        ` , [id]);

        return companyId.rows[0].company_id
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
            shipments.direction_category,
            shipments.current_position,
            shipper_locations.name AS shipper_name,
            shipper_locations.address AS shipper_address,
            shipper_locations.city AS shipper_city,
            shipper_locations.state AS shipper_state,
            shipper_locations.zip_code AS shipper_zip,
            suppliers.name AS supplier_name,
            suppliers.address AS supplier_address,
            suppliers.city AS supplier_city,
            suppliers.state AS supplier_state,
            suppliers.zip_code AS supplier_zip,
            customer_locations.name AS customer_name,
            customer_locations.address AS customer_address,
            customer_locations.city AS customer_city,
            customer_locations.state AS customer_state,
            customer_locations.zip_code AS customer_zip,
            shipments.equipment_type_id,
            shipments.status,
            shipments.total_weight,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.actual_pickup_date,
            shipments.actual_delivery_date,
            shipments.bid_deadline,
            shipments.shipment_type

            FROM shipments 

           
            LEFT JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                    THEN shipments.origin_id
                    ELSE shipments.destination_id
                END

            LEFT JOIN customer_locations ON customer_locations.id = shipments.destination_id AND shipments.direction_category = 'outbound'

            LEFT JOIN suppliers ON suppliers.id = shipments.origin_id AND shipments.direction_category = 'inbound'

            WHERE shipper_locations.id = $1

            AND shipments.status = ANY($2)
            ` , [id , status ])

        return response.rows
}

const getSpotLoadsByShipperLocation = async (id , status) => {
    let response = await pool.query(`
        
            SELECT 
            
            shipments.id,
            shipments.shipment_number,
            shipments.direction_category,
            shipper_locations.name AS shipper_name,
            shipper_locations.address AS shipper_address,
            shipper_locations.city AS shipper_city,
            shipper_locations.state AS shipper_state,
            shipper_locations.zip_code AS shipper_zip,
            customer_locations.name AS customer_name,
            customer_locations.address AS customer_address,
            customer_locations.city AS customer_city,
            customer_locations.state AS customer_state,
            customer_locations.zip_code AS customer_zip,
            suppliers.name AS supplier_name,
            suppliers.address AS supplier_address,
            suppliers.city AS supplier_city,
            suppliers.state AS supplier_state,
            suppliers.zip_code AS supplier_zip,
            shipments.equipment_type_id,
            shipments.status,
            shipments.total_weight,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.actual_pickup_date,
            shipments.actual_delivery_date,
            shipments.bid_deadline,
            shipments.shipment_type,
            json_agg(
                json_build_object(
                    'offer_id' , spot_bids.id,
                    'shipment_number' , shipments.shipment_number,
                    'carrier_name' , carriers.name,
                    'rate' , spot_bids.rate,
                    'status' , spot_bids.status,
                    'submitted_at' , spot_bids.created_at
                ) ORDER BY spot_bids.rate
            ) FILTER (WHERE spot_bids.id IS NOT NULL AND spot_bids.status != 'rejected') AS offers
         
            FROM shipments 

           
            LEFT JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END

            LEFT JOIN customer_locations ON customer_locations.id = shipments.destination_id AND shipments.direction_category = 'outbound'

            LEFT JOIN suppliers on suppliers.id = shipments.origin_id AND shipments.direction_category = 'inbound'

            LEFT JOIN spot_bids ON spot_bids.shipment_id = shipments.id
            LEFT JOIN carriers ON spot_bids.carrier_id = carriers.id

            WHERE shipper_locations.id = $1 
            AND shipments.status = ANY($2)

            GROUP BY 
            shipments.id,
            shipments.shipment_number,
            shipper_locations.name,
            shipper_locations.address,
            shipper_locations.city,
            shipper_locations.state ,
            shipper_locations.zip_code,
            customer_locations.name,
            customer_locations.address,
            customer_locations.city,
            customer_locations.state,
            customer_locations.zip_code,
            shipments.equipment_type_id,
            shipments.status,
            shipments.total_weight,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.actual_pickup_date,
            shipments.actual_delivery_date,
            shipments.bid_deadline,
            shipments.shipment_type,
            shipments.direction_category,
            suppliers.name,
            suppliers.address,
            suppliers.city,
            suppliers.state,
            suppliers.zip_code

        ` , [id , status]);

        return response.rows
}

module.exports = {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId , getShipmentsByShipperLocation , getCompanyIdByShipperLoc , getSpotLoadsByShipperLocation}