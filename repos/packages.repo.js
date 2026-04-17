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

const createPkgByCarrierUser = async (id , name , minDistance1 , maxDistance1 , flatRate1 , perMileRate1 , fuelSurcharge1 , minDistance2 , maxDistance2 , flatRate2 , perMileRate2 , fuelSurcharge2 , minDistance3 , maxDistance3 , flatRate3 , perMileRate3 , fuelSurcharge3 , minDistance4 ,  flatRate4 , perMileRate4 , fuelSurcharge4) => {
    try{
        await pool.query('BEGIN')

        let carrierId = await pool.query(`
            SELECT carriers.id
            FROM carriers
            WHERE carriers.id IN(SELECT carrier_users.carrier_id FROM carrier_users WHERE carrier_users.id = $1)
            ` , [id])

        let newPkg = await pool.query(`
                INSERT INTO rate_packages (name , carrier_id) 
                
                VALUES  ($1 , $2)

                RETURNING *
            ` , [name , carrierId.rows[0].id])

        let newRate1 = await pool.query(`
                INSERT INTO rates (package_id , min_distance , max_distance , flat_rate , per_mile_rate , fuel_surcharge_percentage)

                VALUES ($1 , $2 , $3 , $4 , $5 , $6)

                RETURNING *
            ` , [newPkg.rows[0].id , minDistance1 , maxDistance1 , flatRate1 , perMileRate1 , fuelSurcharge1])

        let newRate2 = await pool.query(`
                INSERT INTO rates (package_id , min_distance , max_distance , flat_rate , per_mile_rate , fuel_surcharge_percentage)

                VALUES ($1 , $2 , $3 , $4 , $5 , $6)

                RETURNING *
            ` , [newPkg.rows[0].id , minDistance2 , maxDistance2 , flatRate2 , perMileRate2 , fuelSurcharge2])

        let newRate3 = await pool.query(`
                INSERT INTO rates (package_id , min_distance , max_distance , flat_rate , per_mile_rate , fuel_surcharge_percentage)

                VALUES ($1 , $2 , $3 , $4 , $5 , $6)

                RETURNING *
            ` , [newPkg.rows[0].id , minDistance3 , maxDistance3 , flatRate3 , perMileRate3 , fuelSurcharge3])

        let newRate4 = await pool.query(`
                INSERT INTO rates (package_id , min_distance ,  flat_rate , per_mile_rate , fuel_surcharge_percentage)

                VALUES ($1 , $2 , $3 , $4 , $5 )

                RETURNING *
            ` , [newPkg.rows[0].id , minDistance4 , flatRate4 , perMileRate4 , fuelSurcharge4])

            await pool.query('COMMIT')
    
    }catch(error){
        await pool.query('ROLLBACK')
        throw new Error(error)
    }
}

module.exports = {getPkgsByCarrierUser , createPkgByCarrierUser}