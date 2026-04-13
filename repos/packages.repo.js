const pool = require('../db/pool');

const getPkgsByCarrierUser = async (id) => {
    const response = await pool.query(`
            SELECT
               rate_packages.id AS pkgId,
               rate_packages.name AS pkgName,
               json_agg(
                    json_build_object(
                        'rateId' , rates.id,
                        'min_distance' , rates.min_distance,
                        'max_distance' , rates.max_distance,
                        'flat_rate' , rates.flat_rate,
                        'per_mile_rate' , rates.per_mile_rate,
                        'fuel_surcharge_percentage' , rates.fuel_surcharge_percentage
                    )
                        ORDER BY min_distance
               ) AS rates

            FROM rate_packages

            JOIN rates ON rates.package_id = rate_packages.id

            WHERE rate_packages.carrier_id IN(SELECT carrier_users.carrier_id FROM carrier_users WHERE carrier_users.id = $1)

            GROUP BY rate_packages.id , rate_packages.name
            ` , [id]);


        return response.rows;
}

module.exports = {getPkgsByCarrierUser}