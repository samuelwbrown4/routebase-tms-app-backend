const pool = require('../db/pool.js')

const contractExists = async (shipperId , carrierId) => {
    const contract = await pool.query(`
        SELECT id
        FROM contracts
        WHERE contracts.company_id = $1 AND contracts.carrier_id = $2 AND contracts.contract_status = 'active'
        ` , [shipperId , carrierId])

    return contract.rows[0]
}

const createContract = async (shipperId , carrierId , packageId , contractStart , contractEnd) => {
    let newContract = await pool.query(`
        INSERT INTO contracts (company_id , carrier_id , package_id , start_date , end_date) 
        VALUES ($1 , $2 , $3 , $4 , $5)
        RETURNING *
        ` , [shipperId , carrierId , packageId , contractStart , contractEnd]);

    return newContract.rows
}

const deleteContract = async (id) => {
    let deletedContract = await pool.query(`
        DELETE FROM contracts
        WHERE contracts.id = $1
        RETURNING *` , [id])

    return deletedContract.rows[0]
}

const updateContractStatus = async (id , status) => {
    let contract = await pool.query(`
        UPDATE contracts
        SET contract_status = $2
        WHERE contracts.id = $1
        RETURNING *` , [id , status]);

    return contract.rows[0]
}



const getContractsByShipperUser = async (id , status) => {
    let response =  await pool.query(`
            SELECT
            contracts.id,
            contracts.contract_status,
            contracts.carrier_id AS carrierId,
            carriers.name AS carrier,
            contracts.start_date,
            contracts.end_date,
            json_agg(
                json_build_object(
                    'rateId' , rates.id,
                    'min_distance' , rates.min_distance,
                    'max_distance' , rates.max_distance,
                    'flat_rate' , rates.flat_rate,
                    'per_mile_rate' , rates.per_mile_rate,
                    'fuel_surcharge_percentage' , rates.fuel_surcharge_percentage
                )
                    ORDER BY rates.min_distance
            ) AS rates
            

            FROM contracts

            JOIN carriers ON contracts.carrier_id = carriers.id
            JOIN rates ON contracts.package_id = rates.package_id

            WHERE contracts.contract_status = $1 AND contracts.company_id IN(SELECT shipper_locations.company_id 
                                            FROM shipper_users 
                                            JOIN shipper_locations ON shipper_locations.id = shipper_users.location_id
                                            WHERE shipper_users.id = $2)

            GROUP BY contracts.id , contracts.carrier_id , carriers.name, contracts.start_date, contracts.end_date

        ` , [status, id]);

    return response.rows

}

module.exports = {getContractsByShipperUser , createContract , contractExists , deleteContract , updateContractStatus}