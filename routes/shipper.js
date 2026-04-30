const express = require('express');
const router = express.Router();
const pool = require('../db/pool')
const {getAllOrders , getOrderLineItems, getOrdersByStatus} = require('../controllers/orders.controller');
const {getAllCarriers} = require('../controllers/carriers.controller');
const {createShipment , getUndeliveredShipments} = require('../controllers/shipments.controller');
const {getRatesByShipperUser} = require('../controllers/rates.controller')
const {getContractsByShipperUser , deleteContract ,updateContractStatus} = require('../controllers/contracts.controller')
const {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId} = require('../controllers/shippers.controller')
const {createShipperUser , updateNewShipperUser , getAllShipperUsers} = require('../controllers/shipperUsers.controller')
const {getCustomerLocationsByCompanyId , createCustomerLocation} = require('../controllers/customerLocations.controller')
const {getCustomersByCompanyId} = require('../controllers/customers.controller')


router.get('/companies/:id' , getCompanyId)

router.get('/users/:id' , getAllShipperUsers)

router.get('/shipper-locations/:id' , getShipperLocationId)

router.post('/shipper-users' , createShipperUser)

router.patch('/shipper-users/:email' , updateNewShipperUser)

router.get('/customers/:userId' , getCustomersByCompanyId)

router.get('/customer-locations/:userId' , getCustomerLocationsByCompanyId)

router.post('/customer-locations/:userId' , createCustomerLocation)

router.get('/locations/:id' , getAllShipperLocationsByCompanyId)

router.get('/orders' , getAllOrders);

router.get('/orders/:id' , getOrdersByStatus)

router.get('/orders/:orderId/line-items' , getOrderLineItems)

router.get('/carriers' , getAllCarriers)

router.post('/shipments' , createShipment)

router.post('/rates/:userId' , getRatesByShipperUser)

router.get('/shipments/undelivered' , getUndeliveredShipments)

router.get('/user/:id/contracts' , getContractsByShipperUser)

router.post('/proxy/distance', async (req, res) => {
    try {
        const { originLat, originLong, destLat, destLong } = req.body

        const response = await fetch(`${process.env.ROUTE_MATRIX_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: 'drive',
                units: 'imperial',
                sources: [{ "location": [originLong, originLat] }],
                targets: [{ "location": [destLong, destLat] }]
            })
        })

        const result = await response.json();

        console.log(result)

        if (!result.sources_to_targets) {
            return res.status(400).json({message: 'Error retriving distance'})
        }

        res.status(200).json({distance: result.sources_to_targets[0][0].distance})
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
});

router.get('/equipment-types', async (req, res) => {
    try {
        let equipmentTypes = await pool.query(`
            SELECT * FROM equipment_types`)

        if (equipmentTypes.rows.length === 0) {
            res.status(400).json({ error: 'Could not find equipment types.' })
        }
        res.status(200).json({ equipmentTypes: equipmentTypes.rows })
    } catch (err) {
        console.error('Query error:', err.message)
        res.status(500).json({ error: err.message })
    }
});

router.delete('/contracts/:id' , deleteContract)

router.patch('/contracts/:id' , updateContractStatus)


module.exports = router;