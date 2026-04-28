const pool = require('../db/pool')

const getCustomerLocationsByCompanyId = async (id) => {
    let customerLocations = await pool.query(`
        SELECT 
        customer_locations.id AS cust_loc_id,
        customer_locations.name AS cust_loc_name,
        customer_locations.address AS cust_loc_address,
        customer_locations.city AS cust_loc_city,
        customer_locations.state AS cust_loc_state,
        customer_locations.zip_code AS cust_loc_zip_code,
        customer_locations.country AS cust_loc_country,
        customer_locations.latitude AS cust_loc_lat,
        customer_locations.longitude AS cust_loc_long
        customers.name AS customer_name,
        customers.id AS customer_id,
        customers.address AS customer_address,
        customers.city AS customer_city,
        customers.state AS customer_state,
        customers.zip_code AS customer_zip_code,
        customers.country AS customer_country

        FROM customer_locations

        JOIN customers ON customers.id = customer_locations.customer_id

        WHERE customers.company_id = $1
        `[id])

        return customerLocations.rows
}

module.exports = {getCustomerLocationsByCompanyId}