const pool = require('../db/pool');

const getCustomersByCompanyId = async (id) => {
    let customers = await pool.query(`
        SELECT id , name , city , state , address , zip_code , country
        FROM customers
        WHERE customers.company_id = $1
        ` , [id])

    return customers.rows
}

module.exports = {getCustomersByCompanyId}