const express = require('express');
const router = express.Router();
const pool = require('../db/pool')

router.get('/open-orders', async (req, res) => {
    try {

        const orders = await pool.query(`
            SELECT 
                orders.id,
                orders.order_number, 
                orders.origin_id,
                orders.destination_id,
                shipper_locations.name AS origin ,
                shipper_locations.address AS origin_address,
                shipper_locations.city AS origin_city,
                shipper_locations.state AS origin_state, 
                customer_locations.name AS destination ,
                customer_locations.address AS destination_address,
                customer_locations.city AS destination_city,
                customer_locations.state AS destination_state, 
                SUM(order_line_items.total_weight_lbs) AS weight
            
            FROM orders
            
            JOIN 
                shipper_locations ON orders.origin_id = shipper_locations.id 
            JOIN 
                customer_locations ON orders.destination_id = customer_locations.id

            JOIN 
                order_line_items ON orders.id = order_line_items.order_id 

            
            WHERE orders.order_status = 'unplanned'
                
            GROUP BY 
                orders.id , 
                shipper_locations.id , 
                customer_locations.id`)
        res.status(200).json({ orders: orders.rows })
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
});

router.get('/get-line-items/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const lineItems = await pool.query(`
            SELECT 
                products.material_number,
                products.description,
                products.freight_class,
                order_line_items.quantity,
                order_line_items.total_weight_lbs
            FROM order_line_items
            JOIN products ON order_line_items.product_id = products.id
            WHERE order_id = $1
            ` , [orderId]);

        if (lineItems.rows.length === 0) {
            return res.status(400).json({ error: 'No line items found.' })
        }

        res.status(200).json({ lineItems: lineItems.rows })
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
})

router.get('/get-all-carriers', async (req, res) => {
    try {
        let carriers = await pool.query(`
            SELECT * FROM carriers`)

        if (carriers.rows.length === 0) {
            return res.status(400).json({ error: 'No carriers found.' })
        }
        res.status(200).json({ carriers: carriers.rows })
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
})

router.get('/get-equipment-types', async (req, res) => {
    try {
        let equipmentTypes = await pool.query(`
            SELECT * FROM equipment_types`)

        if (equipmentTypes.rows.length === 0) {
            res.status(400).json({ error: 'Could not find equipment types.' })
        }
        res.status(200).json({ equipmentTypes: equipmentTypes.rows })
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
});

router.post('/create-shipment', async (req, res) => {
    try {
        const { originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders } = req.body

        await pool.query('BEGIN')

        const count = await pool.query('SELECT COUNT(*) FROM shipments')
        const shipmentNumber = `SHP-${String(parseInt(count.rows[0].count) + 1).padStart(5, '0')}`


        let newShipment = await pool.query(`
            INSERT INTO shipments
            (shipment_number , origin_id , destination_id , carrier_id , equipment_type_id , status , total_weight , requested_pickup_date , requested_delivery_date , planned_by_user_id) 
            
            VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10)
            
            RETURNING *` , [shipmentNumber, originId, destinationId, carrier, equipmentType, status, totalWeight,  pickDate, dropDate, userId]);


        await pool.query(`
            INSERT INTO shipment_orders 
            SELECT $1 , UNNEST ($2 ::uuid[])
            ` , [newShipment.rows[0].id, orders])


        await pool.query(`
            UPDATE orders
            SET order_status = 'planned' 
            WHERE id = ANY($1::uuid[])` , [orders])


        await pool.query('COMMIT')
        res.status(200).json({ message: 'Shipment created successfully' })
    } catch (err) {
        await pool.query('ROLLBACK')
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
})

router.get('/get-undelivered' , async (req , res)=>{
    try{
        const countUndelivered = await pool.query(`
            SELECT COUNT(*) FROM shipments
            WHERE status <> 'delivered'`)

            if(countUndelivered.rows.length === 0){
                res.status(400).json({error: 'Could not find undelivered shipments.'})
            }

           res.status(200).json({countUndelivered: countUndelivered.rows[0]}) 
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
})

module.exports = router