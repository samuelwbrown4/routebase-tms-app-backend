const cron = require('node-cron');
const pool = require('../db/pool');



const runOrderSync = async ({ dbPool = pool, fetchFn = fetch } = {}) => {
    console.log('Runnin order sync job...');

    const API_URL = process.env.ERP_API_URL;
    const API_KEY = process.env.ERP_API_KEY;
    try {
        let result = await dbPool.query(`
        SELECT order_number, order_status FROM orders WHERE synced = false
        `);

        let unsyncedOrders = result.rows

        let response = await fetchFn(`${API_URL}/api/orders/sync`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${API_KEY}`
            },
            body: JSON.stringify({ unsyncedOrders })
        })

        let syncResult = await response.json()

        if (response.status === 200) {
            console.log(`Synced ${syncResult.success.length} orders`)
        }

        for (let order of syncResult.success){
            let response = await dbPool.query("UPDATE orders SET synced = true WHERE order_number = $1" , [order])
        }

    } catch (error) {
        console.log(error)
    }
};

const startOrderSync = () => {
    cron.schedule('*/5 * * * *', runOrderSync)
};

module.exports = { startOrderSync, runOrderSync };