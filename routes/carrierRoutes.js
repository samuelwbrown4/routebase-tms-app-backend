const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/shipments/:userId' , async (req , res)=>{
    try{
        const {userId} = req.params;

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

            JOIN carrier_users ON carrier_users.carrier_id = shipments.carrier_id
            JOIN shipper_locations ON shipper_locations.id = shipments.origin_id
            JOIN customer_locations ON customer_locations.id = shipments.destination_id

            WHERE carrier_users.id = $1
            AND shipments.status != 'delivered'
            ` , [userId])


        res.status(200).json({undeliveredShipments: response.rows})
    }catch(err){
        res.status(500).json({error: `Error: ${err.message}`})
    }
});

router.post('/shipment-update/:shipmentId' , async (req , res)=> {
    try{
        const {shipmentId} = req.params
        const { date , userId , eventType} = req.body

        await pool.query('BEGIN')

        await pool.query(`
            UPDATE shipments
            SET status = CASE
                WHEN $1 = 'picked_up' THEN 'in_transit'
                WHEN $1 = 'delivered' THEN 'delivered'
                ELSE status
            END,
            actual_pickup_date = CASE
                WHEN $1 = 'picked_up' THEN $2
                ELSE actual_pickup_date
            END,
            actual_delivery_date = CASE
                WHEN $1 = 'delivered' THEN $2
                ELSE actual_delivery_date
            END
            WHERE shipments.id = $3 
            ` , [eventType , date , shipmentId])

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
        res.status(200).json({ message: 'Shipment updated successfully' })
    }catch(err){
        await pool.query('ROLLBACK')
        res.status(500).json({error: `Error: ${err.message}`})
    }
})

router.get('/user/:id/pkgs' , async (req , res)=>{
    try{
        const {id} = req.params;

        const response = await pool.query(`
            SELECT
               rate_packages.id AS pkgId,
               rate_packages.name AS pkgName,
               json_agg(
                    json_build_object(
                        'rateId' , rates.id,
                        'min_distance' , rates.min_distance,
                        'max_distance' , rates.max_distance,
                        'flat_rate' , rates.flat_rate,
                        'per_mile_rate' , rates.per_mile_rate,
                        'fuel_surcharge_percentage' , rates.fuel_surcharge_percentage
                    )
                        ORDER BY min_distance
               ) AS rates

            FROM rate_packages

            JOIN rates ON rates.package_id = rate_packages.id

            WHERE rate_packages.carrier_id IN(SELECT carrier_users.carrier_id FROM carrier_users WHERE carrier_users.id = $1)

            GROUP BY rate_packages.id , rate_packages.name
            ` , [id])

            if(response.rows.length === 0){
                res.status(400).json({message: 'No rate packages found.'})
            }

            res.status(200).json({packages: response.rows})
    }catch(err){
        res.status(500).json({error: `Error: ${err.message}`})
    }
})

module.exports = router;