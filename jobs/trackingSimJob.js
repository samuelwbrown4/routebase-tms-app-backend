const cron = require('node-cron');
const pool = require('../db/pool');

const startTrackingJob = () => {cron.schedule('*/1 * * * *' , async () => {
    console.log('Running shipment tracking update...');
    try{
        let result = await pool.query(`
            SELECT
            id,
            shipment_number,
            route_geometry,
            route_time_seconds,
            transit_start_time

            FROM shipments

            WHERE shipments.status = 'in_transit'
            `);

            let shipments = result.rows

            for(let shipment of shipments){
                let elapsed = (Date.now() - new Date(shipment.transit_start_time).getTime()) / 1000;

                const fraction = Math.min(elapsed / shipment.route_time_seconds , 1);

                let index = Math.floor((shipment.route_geometry.length-1) * fraction);

                const currentPosition = shipment.route_geometry[index];

                await pool.query(`
                    UPDATE shipments
                    SET current_position = $1
                    WHERE id = $2
                    `,[JSON.stringify(currentPosition) , shipment.id]);

                if(fraction >= .95){
                    await pool.query(`
                        UPDATE shipments
                        SET near_destination = TRUE
                        WHERE id = $1
                        `,[shipment.id])
                }
            }

            console.log(`Updated tracking for ${shipments.length} shipments`);
    }catch(err){
        console.error(`Tracking job error: ${err}`)
    }
})
};

module.exports = {startTrackingJob}