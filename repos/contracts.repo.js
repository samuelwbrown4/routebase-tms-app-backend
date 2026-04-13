const pool = require('../db/pool.js')

const getContractsByShipperUser = async (id) => {
    let response =  await pool.query(`
            SELECT
            contracts.id,
            contracts.contract_status,
            contracts.carrier_id AS carrierId,
            carriers.name AS carrier,
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

            WHERE contracts.company_id IN(SELECT shipper_locations.company_id 
                                            FROM shipper_users 
                                            JOIN shipper_locations ON shipper_locations.id = shipper_users.location_id
                                            WHERE shipper_users.id = $1)

            GROUP BY contracts.id , contracts.carrier_id , carriers.name

        ` , [id]);

    return response.rows

}

module.exports = {getContractsByShipperUser}