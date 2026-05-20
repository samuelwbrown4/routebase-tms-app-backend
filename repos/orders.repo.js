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
                orders.origin_id,
                orders.requested_ship_date,
                orders.destination_id,
                orders.order_line_items,
                orders.weight,
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
                customer_locations.longitude AS destination_long 
                
            
            FROM orders
            
            JOIN 
                shipper_locations ON orders.origin_id = shipper_locations.id 
            JOIN 
                customer_locations ON orders.destination_id = customer_locations.id


            
            WHERE orders.order_status = $1 AND shipper_locations.id = $2
                
            GROUP BY 
                orders.id , 
                orders.requested_ship_date,
                shipper_locations.id , 
                customer_locations.id` , [status , shipperLocation])

    return orders.rows;
        
}

const getOrderLineItems = async (orderId) => {
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

    return lineItems.rows;
}

const createOrder = async (payload) => {
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
        weight)

        VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8::jsonb , $9)

        RETURNING *
        `, [payload.customerId , payload.orderOriginId , payload.orderDestId , payload.orderNumber , payload.custPoNumber , payload.shipDate , payload.orderStatus , JSON.stringify(payload.lineItems) , payload.orderWeight]);

        return order.rows[0]
}

module.exports = {getAllOrders , getOrderLineItems , getOrdersByStatus , createOrder}