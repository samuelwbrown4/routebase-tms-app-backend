const pool = require('../db/pool');

const getCustomersByCompanyId = async (id) => {
    let customers = await pool.query(`
        SELECT id , name , city , state , address , zip_code , country
        FROM customers
        WHERE customers.company_id = $1
        ` , [id])

    return customers.rows
}

const createCustomer = async (companyId , name , address , city , state , zip , country) => {
    let newCustomer = await pool.query(`
        INSERT INTO customers 
        (company_id , name , address , city , state , zip_code , country)
        VALUES ($1 , $2 , $3 , $4 , $5 , $6 ,$7)
        RETURNING *`, [companyId , name , address , city , state , zip , country])

        return newCustomer.rows
}

module.exports = {getCustomersByCompanyId , createCustomer}