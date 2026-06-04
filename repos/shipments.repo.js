const pool = require('../db/pool');

const createShipment = async (originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders, distance, rate, shipmentType, bidDeadline , companyId , directionCategory) => {
    try {

        await pool.query('BEGIN')

        const count = await pool.query('SELECT COUNT(*) FROM shipments')
        const shipmentNumber = `SHP-${String(parseInt(count.rows[0].count) + 1).padStart(5, '0')}`


        let newShipment = await pool.query(`
            INSERT INTO shipments
            (shipment_number , origin_id , destination_id , carrier_id , equipment_type_id , status , total_weight , requested_pickup_date , requested_delivery_date , planned_by_user_id, distance , rate , shipment_type , bid_deadline , company_id , direction_category) 
            
            VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10, $11 , $12 , $13 , $14 , $15 , $16)
            
            RETURNING *` , [shipmentNumber, originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, distance, rate, shipmentType, bidDeadline , companyId , directionCategory]);


        await pool.query(`
            INSERT INTO shipment_orders 
            SELECT $1 , UNNEST ($2 ::uuid[])
            ` , [newShipment.rows[0].id, orders])


        await pool.query(`
            UPDATE orders
            SET order_status = 'planned'
            WHERE id = ANY($1::uuid[])` , [orders])


        await pool.query('COMMIT')

        return newShipment.rows[0]
    } catch (err) {
        await pool.query('ROLLBACK')
        console.error('Query error:', err.message)
        throw err
    }
}

const getUndeliveredShipments = async (status) => {
    const countUndelivered = await pool.query(`
            SELECT COUNT(*) FROM shipments
            WHERE status <> $1` , [status])

    return countUndelivered.rows[0];
}


const getShipmentsByCarrierId = async (id, status) => {
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
            shipments.near_destination,
            shipments.rate

            FROM shipments 

            JOIN carrier_users ON carrier_users.carrier_id = shipments.carrier_id
            LEFT JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                    THEN shipments.origin_id
                    ELSE shipments.destination_id
                END

            LEFT JOIN customer_locations ON customer_locations.id = shipments.destination_id AND shipments.direction_category = 'outbound'

            LEFT JOIN suppliers ON suppliers.id = shipments.origin_id AND shipments.direction_category = 'inbound'

            WHERE carrier_users.id = $1 
            AND shipments.status = ANY($2)
            ` , [id, status])

    return response.rows
}

const carrierGetSpotShipments = async (status) => {
    const response = await pool.query(`
        SELECT
        shipments.id,
            shipments.shipment_number,
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
            shipments.near_destination,
            shipments.bid_deadline,
            shipments.shipment_type,
            shipments.direction_category,
            json_agg(
                json_build_object(
                    'shipment_number' , shipments.shipment_number,
                    'carrier_name' , carriers.name,
                    'rate' , spot_bids.rate,
                    'status' , spot_bids.status,
                    'submitted_at' , spot_bids.created_at
                )
            ) FILTER (WHERE spot_bids.id IS NOT NULL AND spot_bids.status != 'rejected') AS offers

            FROM shipments 

            LEFT JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound' 
                    THEN shipments.origin_id 
                    ELSE shipments.destination_id
                END
                
            LEFT JOIN customer_locations ON customer_locations.id = shipments.destination_id
                AND shipments.direction_category = 'outbound'

            LEFT JOIN suppliers ON suppliers.id = shipments.origin_id 
                AND shipments.direction_category = 'inbound'
                
            LEFT JOIN spot_bids ON spot_bids.shipment_id = shipments.id
            LEFT JOIN carriers ON spot_bids.carrier_id = carriers.id

            WHERE shipments.status = ANY($1)

            GROUP BY
            shipments.id,
            shipments.shipment_number,
            shipper_locations.name,
            shipper_locations.address,
            shipper_locations.city,
            shipper_locations.state,
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
            shipments.near_destination,
            shipments.bid_deadline,
            shipments.shipment_type,
            suppliers.name,
            suppliers.address,
            suppliers.city,
            suppliers.state,
            suppliers.zip_code,
            shipments.direction_category
        `, [status]);
    return response.rows
}

const updateShipment = async (shipmentId, date, userId, eventType, routeGeometry, driveTime , carrierId , rate , bidDeadline) => {
    try {
        await pool.query('BEGIN')

        await pool.query(`
            UPDATE shipments
            SET status = CASE
                WHEN $1 = 'tender_accepted' THEN 'planned'
                WHEN $1 = 'tender_rejected' THEN 'built'
                WHEN $1 = 'picked_up' THEN 'in_transit'
                WHEN $1 = 'delivered' THEN 'delivered'
                WHEN $1 = 'routed' THEN 'routed'
                WHEN $1 = 'retendered' THEN 'tendered'
                WHEN $1 = 'spot_reroute' THEN 'pending_carrier'
                ELSE status
            END,
            carrier_id = CASE
                WHEN $1 = 'tender_rejected' THEN NULL
                WHEN $1 = 'spot_reroute' THEN NULL
                WHEN $1 = 'retendered' THEN $6
                ELSE carrier_id
            END,
            rate = CASE
                WHEN $1 = 'tender_rejected' THEN NULL
                WHEN $1 = 'spot_reroute' THEN NULL
                WHEN $1 = 'retendered' THEN $7
                ELSE rate
            END,
            shipment_type = CASE
                WHEN $1 = 'spot_reroute'
                THEN 'spot'
                ELSE shipment_type
            END,
            bid_deadline = CASE
                WHEN $1 = 'spot_reroute'
                THEN $8
                ELSE bid_deadline
            END,
            actual_pickup_date = CASE
                WHEN $1 = 'picked_up' THEN $2
                ELSE actual_pickup_date
            END,
            actual_delivery_date = CASE
                WHEN $1 = 'delivered' THEN $2
                ELSE actual_delivery_date
            END,
            route_geometry = CASE
                WHEN $1 = 'routed' THEN $4::jsonb
                ELSE route_geometry
            END,
            route_time_seconds = CASE
            WHEN $1 = 'routed' THEN $5
                ELSE route_time_seconds
            END
            WHERE shipments.id = $3 
            ` , [eventType, date, shipmentId, routeGeometry, driveTime , carrierId , rate , bidDeadline])

        await pool.query(`
            UPDATE orders
            SET order_status = CASE
                WHEN $1 = 'picked_up' THEN 'in_transit'
                WHEN $1 = 'delivered' THEN 'delivered'
                ELSE order_status
            END
            WHERE orders.id IN(SELECT order_id from shipment_orders WHERE shipment_orders.shipment_id = $2)
            ` , [eventType, shipmentId])


        await pool.query(`
            INSERT INTO shipment_events (shipment_id , event_type , user_id)
            VALUES ($1 , $2 , $3)
            RETURNING *
            ` , [shipmentId, eventType, userId])

        await pool.query('COMMIT')
    } catch (err) {
        await pool.query('ROLLBACK')
        throw err
    }
}

const getShipmentCoordsById = async (id) => {
    let coords = await pool.query(`
        SELECT 
        shipments.direction_category,
        shipper_locations.latitude AS shipper_lat,
        shipper_locations.longitude AS shipper_lon,
        customer_locations.latitude AS customer_lat,
        customer_locations.longitude AS customer_lon,
        suppliers.latitude AS supplier_lat,
        suppliers.longitude AS supplier_lon

        FROM shipments 
        LEFT JOIN shipper_locations ON shipper_locations.id = CASE
            WHEN shipments.direction_category = 'outbound'
            THEN shipments.origin_id
            ELSE shipments.destination_id
        END
        
        LEFT JOIN customer_locations ON customer_locations.id = shipments.destination_id AND shipments.direction_category = 'outbound'

        LEFT JOIN suppliers ON suppliers.id = shipments.origin_id AND shipments.direction_category = 'inbound'

        WHERE shipments.id = $1
        `, [id])

    return coords.rows[0]
}

const getShipmentById = async (id) => {
    let shipment = await pool.query(`
        SELECT 
        
         shipments.id,
            shipments.shipment_number,
            shipments.route_geometry,
            shipments.distance,
            shipments.rate,
            shipments.origin_id,
            shipments.carrier_id,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.actual_pickup_date,
            shipments.actual_delivery_date,
            shipments.shipment_type,
            shipments.current_position,
            carriers.name AS carrier_name,
            carriers.scac AS carrier_scac,
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
            shipments.direction_category,
            json_agg(
                json_build_object(
                    'id',orders.id,
                    'order_number' , orders.order_number,
                    'customer_po_number' , orders.customer_po_number,
                    'weight' , orders.weight,
                    'order_line_items' , orders.order_line_items
                )
            ) AS orders
            
        
        FROM shipments 

        LEFT JOIN shipper_locations ON shipper_locations.id = CASE
            WHEN shipments.direction_category = 'outbound'
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END

        JOIN carriers ON shipments.carrier_id = carriers.id

        LEFT JOIN customer_locations ON customer_locations.id = shipments.destination_id AND shipments.direction_category = 'outbound'

        LEFT JOIN suppliers ON suppliers.id = shipments.origin_id AND shipments.direction_category = 'inbound'

        JOIN shipment_orders ON shipment_orders.shipment_id = shipments.id
        JOIN orders ON orders.id = shipment_orders.order_id
        
        WHERE shipments.id = $1

        GROUP BY

            shipments.id,
            shipments.shipment_number,
            carriers.name,
            carriers.scac,
            shipper_locations.name,
            shipper_locations.address,
            shipper_locations.city,
            shipper_locations.state,
            shipper_locations.zip_code,
            customer_locations.name,
            customer_locations.address,
            customer_locations.city,
            customer_locations.state,
            customer_locations.zip_code,
            shipments.equipment_type_id,
            shipments.status,
            shipments.total_weight,
            shipments.route_geometry,
            shipments.current_position,
            shipments.distance,
            shipments.rate,
            shipments.carrier_id,
            shipments.origin_id,
            shipments.direction_category,
            suppliers.name,
            suppliers.address,
            suppliers.city,
            suppliers.state,
            suppliers.zip_code,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.actual_pickup_date,
            shipments.actual_delivery_date,
            shipments.shipment_type
        `, [id])

    return shipment.rows[0]
}

const getCarrierShipmentByShipmentNumber = async (shipmentNumber, id) => {
    let shipment = await pool.query(`
        SELECT * FROM shipments WHERE shipment_number = $1 AND shipments.carrier_id = $2
        `, [shipmentNumber, id])

    return shipment.rows[0]
}

const getShipperShipmentByShipmentNumber = async (shipmentNumber) => {
    let shipment = await pool.query(`
        SELECT * FROM shipments WHERE shipment_number = $1 AND shipments.company_id = $2
        `, [shipmentNumber, id])

    return shipment.rows[0]
}

const getShipmentByShipmentNumber = async (shipmentNumber) => {
    let shipment = await pool.query(`
        SELECT * FROM shipments WHERE shipment_number = $1
        `, [shipmentNumber])

    return shipment.rows[0]
}

const shipmentSearch = async (id, searchValue) => {
    let shipments = await pool.query(`
        SELECT
            shipments.id,
            shipments.shipment_number
        FROM
            shipments
        WHERE
            (shipments.origin_id = $1 OR shipments.destination_id = $1) AND LOWER(shipments.shipment_number) LIKE $2
        `, [id, searchValue]);

    return shipments.rows;
}

const makeSpotOffer = async (carrierId , shipmentId , rate) => {
    let response = await pool.query(`
        INSERT INTO spot_bids (carrier_id , shipment_id , rate , status) VALUES ($1 , $2 , $3 , 'active')
        RETURNING *` , [carrierId , shipmentId , rate])

    return response.rows[0]
}

const acceptSpotOffer = async (offerId , shipmentId) => {
   
  try{
    await pool.query(`BEGIN`);

    await pool.query(`
        UPDATE spot_bids

        SET status = CASE
        WHEN id = $2 THEN 'accepted'::bid_status
        WHEN id != $2 THEN 'rejected'::bid_status
        END

        WHERE spot_bids.shipment_id = $1
        `,[shipmentId , offerId]);

    let response = await pool.query(`
        UPDATE shipments

        SET status = 'planned',
            carrier_id = (SELECT carrier_id FROM spot_bids WHERE id = $2),
            rate = (SELECT rate FROM spot_bids WHERE id = $2)

        WHERE shipments.id = $1
        RETURNING *`,[shipmentId ,  offerId])

    await pool.query('COMMIT')

    return response.rows[0]
    
  }catch(err) {
        await pool.query('ROLLBACK')
        throw err
    }
}

const resetBidDeadline = async (shipmentId , bidDeadline) => {
    try{
        await pool.query('BEGIN');

        let result = await pool.query(`
            UPDATE shipments

            SET bid_deadline = $2

            WHERE shipments.id = $1
            RETURNING *` , [shipmentId , bidDeadline]);

        await pool.query(`
            UPDATE spot_bids

            SET status = 'rejected'::bid_status

            WHERE spot_bids.shipment_id = $1
            ` , [shipmentId]);

        await pool.query('COMMIT');

            return result.rows[0]
    }catch(err) {
        await pool.query('ROLLBACK')
        throw err
    }
}

const getUpcomingShipments = async (id) => {
    const shipments = await pool.query(`
        SELECT  
            shipments.id,
            shipments.shipment_number,
            shipments.status,
            shipments.requested_pickup_date,
            shipments.requested_delivery_date,
            shipments.direction_category,
            shipments.total_weight,
            carriers.name AS carrier_name,
            shipper_locations.name AS shipper_name,
            customer_locations.name AS customer_name,
            suppliers.name AS supplier_name

        FROM shipments

        JOIN carriers ON carriers.id = shipments.carrier_id

        LEFT JOIN shipper_locations ON shipper_locations.id = CASE
            WHEN shipments.direction_category = 'outbound' 
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END

        LEFT JOIN customer_locations ON shipments.destination_id = customer_locations.id 
            AND shipments.direction_category = 'outbound'

        LEFT JOIN suppliers ON shipments.origin_id = suppliers.id 
            AND shipments.direction_category = 'inbound'

        WHERE shipments.status IN ('planned', 'routed')
        AND shipper_locations.id = $1
        AND shipments.requested_pickup_date >= CURRENT_DATE
        AND shipments.requested_pickup_date <= CURRENT_DATE + INTERVAL '7 days'
    `, [id])

    return shipments.rows
};


module.exports = { createShipment, getUndeliveredShipments, getShipmentsByCarrierId, updateShipment, getShipmentCoordsById, getShipmentById, getCarrierShipmentByShipmentNumber, getShipperShipmentByShipmentNumber, getShipmentByShipmentNumber, shipmentSearch , carrierGetSpotShipments , makeSpotOffer , acceptSpotOffer , resetBidDeadline , getUpcomingShipments}