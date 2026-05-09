const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { requireAdmin, requireAuth } = require('../middleware/auth');
const {getAllOrders , getOrderLineItems, getOrdersByStatus} = require('../controllers/orders.controller');
const {getAllCarriers} = require('../controllers/carriers.controller');
const {createShipment , getUndeliveredShipments , getShipmentById} = require('../controllers/shipments.controller');
const {getRatesByShipperUser} = require('../controllers/rates.controller')
const {getContractsByShipperUser , deleteContract ,updateContractStatus} = require('../controllers/contracts.controller')
const {getCompanyId , getShipperLocationId , getAllShipperLocationsByCompanyId , getShipmentsByShipperLocation} = require('../controllers/shippers.controller')
const {createShipperUser , updateNewShipperUser , getAllShipperUsers} = require('../controllers/shipperUsers.controller')
const {getCustomerLocationsByCompanyId , createCustomerLocation} = require('../controllers/customerLocations.controller')
const {getCustomersByCompanyId} = require('../controllers/customers.controller')


router.get('/companies/:id' , requireAuth , getCompanyId)

router.get('/users' , requireAuth, getAllShipperUsers)

router.get('/shipper-locations/:id' , requireAuth , getShipperLocationId)

router.post('/shipper-users' , requireAdmin , createShipperUser)

router.patch('/shipper-users/:email' , requireAuth , updateNewShipperUser)

router.get('/customers' , requireAuth , getCustomersByCompanyId)

router.get('/customer-locations' , requireAuth , getCustomerLocationsByCompanyId)

router.post('/customer-locations' , requireAdmin , createCustomerLocation)

router.get('/locations' , requireAuth , getAllShipperLocationsByCompanyId)

router.get('/orders' , requireAuth , getOrdersByStatus)

router.get('/orders/:orderId/line-items' , requireAuth , getOrderLineItems)

router.get('/carriers' , requireAuth , getAllCarriers)

router.post('/shipments' , requireAdmin , createShipment)

router.post('/rates' , requireAuth , getRatesByShipperUser)

router.get('/shipments' , requireAuth , getShipmentsByShipperLocation)

router.get('/shipments/:shipmentId' , requireAuth , getShipmentById)

router.get('/contracts' , requireAuth , getContractsByShipperUser)

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

router.delete('/contracts/:id' , requireAdmin , deleteContract)

router.patch('/contracts/:id' , requireAdmin , updateContractStatus)


module.exports = router;