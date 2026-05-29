const cron = require('node-cron');
const pool = require('../db/pool');

const startTrackingJob = () => {
    cron.schedule('*/1 * * * *', async () => {
        console.log('Running shipment tracking update...');
        try {
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

            for (let shipment of shipments) {

                const transitTime = shipment.transit_start_time.includes('Z') || shipment.transit_start_time.includes('+')
                    ? shipment.transit_start_time
                    : shipment.transit_start_time.replace(' ', 'T') + 'Z';

                let elapsed = (Date.now() - new Date(transitTime).getTime()) / 1000;

                const fraction = Math.min(elapsed / shipment.route_time_seconds, 1);

                let index = Math.floor((shipment.route_geometry.length - 1) * fraction);

                const currentPosition = shipment.route_geometry[index];

                let updateResult = await pool.query(`
                    UPDATE shipments
                    SET current_position = $1::jsonb,
                    near_destination = CASE WHEN $3 >= 0.95 THEN TRUE ELSE near_destination END
                    WHERE id = $2
                `, [JSON.stringify(currentPosition), shipment.id, fraction]);

                
                console.log('fraction:', fraction)
                console.log('urrent position', JSON.stringify(currentPosition))
                console.log('transit_start_time raw:', shipment.transit_start_time)
                console.log('Date.now():', Date.now())
                console.log('new Date().toISOString():', new Date().toISOString())
                console.log('transitTime:', transitTime)
                console.log('transit parsed:', new Date(transitTime).getTime())

            }

            console.log(`Updated tracking for ${shipments.length} shipments`);
        } catch (err) {
            console.error(`Tracking job error: ${err}`)
        }
    })
};

module.exports = { startTrackingJob }