const pool = require('../db/pool.js')

const getAllOrders = async (id) => {
    const orders = await pool.query(`
            SELECT 
                orders.id,
                orders.order_number, 
                orders.origin_id,
                orders.requested_ship_date,
                orders.destination_id,
                shipper_locations.name AS origin ,
                shipper_locations.address AS origin_address,
                shipper_locations.city AS origin_city,
                shipper_locations.state AS origin_state,
                shipper_locations.latitude AS origin_lat,
                shipper_locations.longitude AS origin_long, 
                customer_locations.name AS destination ,
                customer_locations.address AS destination_address,
                customer_locations.city AS destination_city,
                customer_locations.state AS destination_state,
                customer_locations.latitude AS destination_lat,
                customer_locations.longitude AS destination_long, 
                SUM(order_line_items.total_weight_lbs) AS weight
            
            FROM orders
            
            JOIN 
                shipper_locations ON orders.origin_id = shipper_locations.id 
            JOIN 
                customer_locations ON orders.destination_id = customer_locations.id

            JOIN 
                order_line_items ON orders.id = order_line_items.order_id 

            
            WHERE orders.order_status = 'unplanned' AND shipper_locations.id = $1
                
            GROUP BY 
                orders.id , 
                orders.requested_ship_date,
                shipper_locations.id , 
                customer_locations.id` , [id])

    return orders.rows;
}

const getOrdersByStatus = async (status , shipperLocation) => {
    let orders = await pool.query(`
        SELECT 
                orders.id,
                orders.order_number, 
                orders.company_id,
                orders.origin_id,
                orders.requested_ship_date,
                orders.destination_id,
                orders.order_line_items,
                orders.weight,
                orders.direction_category,
                suppliers.name AS supplier_name,
                suppliers.address AS supplier_address,
                suppliers.city AS supplier_city,
                suppliers.state AS supplier_state,
                suppliers.latitude AS supplier_lat,
                suppliers.longitude AS supplier_long,
                shipper_locations.name AS shipper_location_name ,
                shipper_locations.address AS shipper_address,
                shipper_locations.city AS shipper_city,
                shipper_locations.state AS shipper_state,
                shipper_locations.latitude AS shipper_lat,
                shipper_locations.longitude AS shipper_long, 
                customer_locations.name AS customer_location_name ,
                customer_locations.address AS customer_address,
                customer_locations.city AS customer_city,
                customer_locations.state AS customer_state,
                customer_locations.latitude AS customer_lat,
                customer_locations.longitude AS customer_long 
                
            
            FROM orders
            
            LEFT JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN orders.direction_category = 'outbound' 
                    THEN orders.origin_id
                    ELSE orders.destination_id
                END

            LEFT JOIN customer_locations ON orders.destination_id = customer_locations.id 
            AND orders.direction_category = 'outbound'

            LEFT JOIN suppliers ON orders.origin_id = suppliers.id 
            AND orders.direction_category = 'inbound'


            
            WHERE orders.order_status = $1 
            AND shipper_locations.id = $2
                
            ` , [status , shipperLocation])

    return orders.rows;
        
}

const getOrdersByDateRange = async ( id) => {
    const orders = await pool.query(`
        SELECT  
            orders.id,
                orders.order_number, 
                orders.company_id,
                orders.origin_id,
                orders.requested_ship_date,
                orders.destination_id,
                orders.order_line_items,
                orders.weight,
                orders.direction_category,
                suppliers.name AS supplier_name,
                suppliers.address AS supplier_address,
                suppliers.city AS supplier_city,
                suppliers.state AS supplier_state,
                suppliers.latitude AS supplier_lat,
                suppliers.longitude AS supplier_long,
                shipper_locations.name AS shipper_location_name ,
                shipper_locations.address AS shipper_address,
                shipper_locations.city AS shipper_city,
                shipper_locations.state AS shipper_state,
                shipper_locations.latitude AS shipper_lat,
                shipper_locations.longitude AS shipper_long, 
                customer_locations.name AS customer_location_name ,
                customer_locations.address AS customer_address,
                customer_locations.city AS customer_city,
                customer_locations.state AS customer_state,
                customer_locations.latitude AS customer_lat,
                customer_locations.longitude AS customer_long 
                
            
            FROM orders
            
            LEFT JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN orders.direction_category = 'outbound' 
                    THEN orders.origin_id
                    ELSE orders.destination_id
                END

            LEFT JOIN customer_locations ON orders.destination_id = customer_locations.id 
            AND orders.direction_category = 'outbound'

            LEFT JOIN suppliers ON orders.origin_id = suppliers.id 
            AND orders.direction_category = 'inbound'

            WHERE orders.order_status = 'unplanned' 
            AND shipper_locations.id = $1
            AND orders.requested_ship_date >= CURRENT_DATE
            AND orders.requested_ship_date <= CURRENT_DATE + INTERVAL '7 days'

            ORDER BY
            orders.requested_ship_date
        `,[id])

        return orders.rows
}

const getOrderLineItems = async (orderId) => {
    const lineItems = await pool.query(`
            SELECT 
                orders.order_line_items
            FROM orders
            
            WHERE orders.id = $1
            ` , [orderId]);

    return lineItems.rows[0];
}

const createOrder = async (payload) => {
    console.log('about to insert order')
    const order = await pool.query(`
        INSERT INTO orders 
        (customer_id,
        origin_id,
        destination_id,
        order_number,
        customer_po_number,
        requested_ship_date,
        order_status,
        order_line_items,
        weight,
        direction_category,
        company_id,
        supplier_id)

        VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8::jsonb , $9 , $10 , $11  , $12)

        RETURNING *
        `, [payload.customerId , payload.orderOriginId , payload.orderDestId , payload.orderNumber , payload.custPoNumber , payload.shipDate , payload.orderStatus , JSON.stringify(payload.lineItems) , payload.orderWeight , payload.directionCategory , payload.companyId ,  payload.supplierId]);

         console.log('order inserted:', order.rows[0])

        return order.rows[0]
}

module.exports = {getAllOrders , getOrderLineItems , getOrdersByStatus , createOrder ,getOrdersByDateRange}