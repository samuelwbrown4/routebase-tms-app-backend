const pool = require('../db/pool');

const createShipment = async (originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders) => {
        try {

        await pool.query('BEGIN')

        const count = await pool.query('SELECT COUNT(*) FROM shipments')
        const shipmentNumber = `SHP-${String(parseInt(count.rows[0].count) + 1).padStart(5, '0')}`


        let newShipment = await pool.query(`
            INSERT INTO shipments
            (shipment_number , origin_id , destination_id , carrier_id , equipment_type_id , status , total_weight , requested_pickup_date , requested_delivery_date , planned_by_user_id) 
            
            VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 )
            
            RETURNING *` , [shipmentNumber, originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId]);


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


const getShipmentsByCarrierId = async (id , status ) => {
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
            shipments.actual_delivery_date,
            shipments.near_destination

            FROM shipments 

            JOIN carrier_users ON carrier_users.carrier_id = shipments.carrier_id
            JOIN shipper_locations ON shipper_locations.id = shipments.origin_id
            JOIN customer_locations ON customer_locations.id = shipments.destination_id

            WHERE carrier_users.id = $1 
            AND shipments.status = ANY($2)
            ` , [id , status ])

        return response.rows
}

const updateShipment = async (shipmentId , date , userId , eventType , routeGeometry , driveTime) => {
    try{
        await pool.query('BEGIN')

        await pool.query(`
            UPDATE shipments
            SET status = CASE
                WHEN $1 = 'picked_up' THEN 'in_transit'
                WHEN $1 = 'delivered' THEN 'delivered'
                WHEN $1 = 'routed' THEN 'routed'
                ELSE status
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
            ` , [eventType , date , shipmentId , routeGeometry , driveTime])

        await pool.query(`
            UPDATE orders
            SET order_status = CASE
                WHEN $1 = 'picked_up' THEN 'in_transit'
                WHEN $1 = 'delivered' THEN 'delivered'
                ELSE order_status
            END
            WHERE orders.id IN(SELECT order_id from shipment_orders WHERE shipment_orders.shipment_id = $2)
            ` , [eventType , shipmentId])


        await pool.query(`
            INSERT INTO shipment_events (shipment_id , event_type , user_id)
            VALUES ($1 , $2 , $3)
            RETURNING *
            ` , [shipmentId , eventType , userId])

        await pool.query('COMMIT')
    }catch(err){
        await pool.query('ROLLBACK')
        throw err
    }
}

const getShipmentCoordsById = async (id) => {
    let coords = await pool.query(`
        SELECT 
        shipper_locations.latitude AS origin_lat,
        shipper_locations.longitude AS origin_lon,
        customer_locations.latitude AS dest_lat,
        customer_locations.longitude AS dest_lon

        FROM shipments 
        JOIN shipper_locations ON shipper_locations.id = shipments.origin_id
        JOIN customer_locations ON customer_locations.id = shipments.destination_id

        WHERE shipments.id = $1
        `,[id])

    return coords.rows[0]
}

const getShipmentById = async (id) => {
    let shipment = await pool.query(`
        SELECT * FROM shipments WHERE id = $1
        `,[id])

        return shipment.rows[0]
}

module.exports = {createShipment , getUndeliveredShipments , getShipmentsByCarrierId, updateShipment , getShipmentCoordsById , getShipmentById}