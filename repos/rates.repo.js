const pool = require('../db/pool');

const getRatesByShipperUser = async (id , distance) => {
    let response = await pool.query(`
            SELECT 
               contracts.id AS contract,
               contracts.carrier_id AS carrierId,
               carriers.name AS carrier,
               rates.id AS rateId,
               rates.flat_rate,
               rates.per_mile_rate,
               rates.fuel_surcharge_percentage,
               rates.min_distance,
               rates.max_distance

            FROM

                rates

            JOIN contracts ON contracts.package_id = rates.package_id
            JOIN carriers ON carriers.id = contracts.carrier_id

            WHERE $1 > rates.min_distance AND ($1 < rates.max_distance OR rates.max_distance IS NULL) AND contracts.contract_status = 'active' AND contracts.company_id IN(SELECT shipper_locations.company_id FROM shipper_users JOIN shipper_locations ON shipper_users.location_id = shipper_locations.id WHERE shipper_users.id = $2)
            ` , [distance , id])

        return response.rows;
}

module.exports = {getRatesByShipperUser}