const cron = require('node-cron');
const pool = require('../db/pool');


const startOrderSync = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Runnin order sync job...');

        const API_URL = process.env.ERP_API_URL;
        const API_KEY = process.env.ERP_API_KEY;
        try {
            let result = await pool.query(`
            SELECT order_number, order_status FROM orders WHERE synced = false
            `);

            let unsyncedOrders = result.rows

            let response = await fetch(`${API_URL}/api/orders/sync`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY}`
                },
                body: JSON.stringify({ unsyncedOrders })
            })

            if (response.status === 200) {
                console.log(`Synced ${unsyncedOrders.length} orders`)
            }
        } catch (error) {
            console.log(error)
        }
    })
};

module.exports = { startOrderSync };