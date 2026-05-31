const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { requireAdmin, requireAuth } = require('../middleware/auth');
const { getAllOrders, getOrderLineItems, getOrdersByStatus , getOrdersByDateRange} = require('../controllers/orders.controller');
const { getAllCarriers } = require('../controllers/carriers.controller');
const { createShipment, getUndeliveredShipments, getShipmentById, shipmentSearch, acceptSpotOffer } = require('../controllers/shipments.controller');
const { getRatesByShipperUser, getRateByCarrier } = require('../controllers/rates.controller')
const { getContractsByShipperUser, deleteContract, updateContractStatus } = require('../controllers/contracts.controller')
const { getCompanyId, getShipperLocationId, getAllShipperLocationsByCompanyId, getShipmentsByShipperLocation } = require('../controllers/shippers.controller')
const { createShipperUser, updateNewShipperUser, getAllShipperUsers } = require('../controllers/shipperUsers.controller')
const { getCustomerLocationsByCompanyId, createCustomerLocation } = require('../controllers/customerLocations.controller')
const { getCustomersByCompanyId } = require('../controllers/customers.controller')
const { generateBol } = require('../controllers/documents.controller');
const { resetBidDeadline , getUpcomingShipments} = require('../controllers/shipments.controller');
const { getShipperLocationIdService } = require('../services/shippers.service');


router.get('/companies/:id', requireAuth, getCompanyId)

router.get('/users', requireAuth, getAllShipperUsers)

router.get('/shipper-locations/:id', requireAuth, getShipperLocationId)

router.post('/shipper-users', requireAdmin, createShipperUser)

router.patch('/shipper-users/:email', requireAuth, updateNewShipperUser)

router.get('/customers', requireAuth, getCustomersByCompanyId)

router.get('/customer-locations', requireAuth, getCustomerLocationsByCompanyId)

router.post('/customer-locations', requireAdmin, createCustomerLocation)

router.get('/locations', requireAuth, getAllShipperLocationsByCompanyId)

router.get('/orders', requireAuth, getOrdersByStatus)

router.get('/orders/:orderId/line-items', requireAuth, getOrderLineItems)

router.get('/carriers', requireAuth, getAllCarriers)

router.post('/shipments', requireAdmin, createShipment)

router.post('/rates', requireAuth, getRatesByShipperUser)

router.post('/rates/:carrier', requireAuth, getRateByCarrier)

router.get('/orders/upcoming' , requireAuth , getOrdersByDateRange)

router.get('/shipments/upcoming' , requireAuth , getUpcomingShipments)

router.get('/shipments/current-position', requireAuth, async (req, res) => {
    const { id } = req.user
    const shipperLocationId = await getShipperLocationIdService(id)
    try {
        let response = await pool.query(`
        SELECT 
            shipments.current_position,
            shipments.shipment_number,
            carriers.name
        FROM shipments

        JOIN carriers ON carriers.id = shipments.carrier_id
        JOIN shipper_locations ON shipper_locations.id = CASE
            WHEN shipments.direction_category = 'outbound'
            THEN shipments.origin_id
            ELSE shipments.destination_id
        END

        WHERE shipments.status = 'in_transit' AND shipper_locations.id = $1
        `, [shipperLocationId]);
        let inTransitShipments = response.rows;

        res.status(200).json({ inTransitShipments })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/shipments', requireAuth, getShipmentsByShipperLocation)

router.get('/shipments/search', requireAuth, shipmentSearch)

router.get('/shipments/:shipmentId', requireAuth, getShipmentById)

router.get('/contracts', requireAuth, getContractsByShipperUser)

router.get('/documents/:shipmentId/bol', requireAuth, generateBol)

router.patch('/spot-bids/:shipmentId/:offerId', requireAuth, acceptSpotOffer)

router.patch('/shipments/bid-deadline/:shipmentId', requireAuth, resetBidDeadline)

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
            return res.status(400).json({ message: 'Error retriving distance' })
        }

        res.status(200).json({ distance: result.sources_to_targets[0][0].distance })
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

router.delete('/contracts/:id', requireAdmin, deleteContract)

router.patch('/contracts/:id', requireAdmin, updateContractStatus)

router.get('/dashboard', requireAuth, async (req, res) => {
    try {

        const since = new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString()
        const { id } = req.user
        const shipperLocationId = await getShipperLocationIdService(id)
        let newOrders = await pool.query(`
            SELECT COUNT (*) FROM orders
            JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN orders.direction_category = 'outbound'
                THEN orders.origin_id
                ELSE orders.destination_id
            END
            WHERE shipper_locations.id = $1 AND orders.created_at > $2
            `, [shipperLocationId, since])

        let newShipments = await pool.query(`
            SELECT COUNT (*) FROM shipments
            JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END
            WHERE shipper_locations.id = $1 AND shipments.created_at > $2
            `, [shipperLocationId, since])

        let newPickups = await pool.query(`
            SELECT COUNT (*) FROM shipment_events
            JOIN shipments ON shipments.id = shipment_events.shipment_id
            JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END
            WHERE shipper_locations.id = $1 AND shipment_events.event_type = 'picked_up' AND shipment_events.event_timestamp > $2
            `, [shipperLocationId, since])

        let newDeliveries = await pool.query(`
            SELECT COUNT (*) FROM shipment_events
            JOIN shipments ON shipments.id = shipment_events.shipment_id
            JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END
            WHERE shipper_locations.id = $1 AND shipment_events.event_type = 'delivered' AND shipment_events.event_timestamp > $2
            `, [shipperLocationId, since])

        let newBids = await pool.query(`
            SELECT COUNT (*) FROM spot_bids 
            JOIN shipments on shipments.id = spot_bids.shipment_id
            JOIN shipper_locations ON shipper_locations.id = CASE
                WHEN shipments.direction_category = 'outbound'
                THEN shipments.origin_id
                ELSE shipments.destination_id
            END
            WHERE shipper_locations.id = $1 AND spot_bids.created_at > $2
            `, [shipperLocationId, since])


        const payload = {
            newOrders: newOrders.rows[0].count,
            newShipments: newShipments.rows[0].count,
            newPickups: newPickups.rows[0].count,
            newDeliveries: newDeliveries.rows[0].count,
            newBids: newBids.rows[0].count
        }

        res.status(200).json({ payload })

    } catch (err) {

        res.status(500).json({ error: err.message })
    }
})




module.exports = router;