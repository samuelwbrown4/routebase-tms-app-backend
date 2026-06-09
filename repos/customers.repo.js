const pool = require('../db/pool');

const getCustomersByCompanyId = async (id) => {
    let customers = await pool.query(`
        SELECT id , name , city , state , address , zip_code , country
        FROM customers
        WHERE customers.company_id = $1
        ` , [id])

    return customers.rows
}

const createCustomer = async (payload) => {
    try {
        let newCustomer = await pool.query(`
            INSERT INTO customers 
            (company_id , name , address , city , state , zip_code , country)
            VALUES ($1 , $2 , $3 , $4 , $5 , $6 ,$7)
            RETURNING *`, [payload.companyId, payload.custName, payload.custAddress, payload.custCity, payload.custState, payload.custZip, payload.country])

        return newCustomer.rows[0].id
    } catch (err) {
        console.log('createCustomer query error:', err.message)
        throw err
    }
}

module.exports = {getCustomersByCompanyId , createCustomer}