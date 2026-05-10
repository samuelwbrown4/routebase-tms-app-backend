const { createShipmentService, getUndeliveredShipmentsService, getShipmentsByCarrierIdService, updateShipmentService, getShipmentCoordsByIdService , getShipmentByIdService , shipmentSearchService } = require('../services/shipments.service')

const {getShipperLocationIdService} = require('../services/shippers.service')

const createShipment = async (req, res) => {
    try {
        const { originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders } = req.body

        const shipment = await createShipmentService(originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders)

        res.status(200).json({ shipment })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getUndeliveredShipments = async (req, res) => {
    try {
        const {status} = req.query
        const undeliveredShipments = await getUndeliveredShipmentsService(status)

        res.status(200).json({ undeliveredShipments })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getShipmentsByCarrierId = async (req, res) => {
    try {
        const { id } = req.user;
        const {status} = req.query;
        let statusArray = status.split(',')
        const shipments = await getShipmentsByCarrierIdService(id , statusArray)
        res.status(200).json({ shipments })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const updateShipment = async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { date, userId, eventType } = req.body
        let routeGeometry = undefined
        let driveTime = undefined

        console.log('date', date);

        if (eventType === 'routed') {
            let coords = await getShipmentCoordsByIdService(shipmentId)

            let response = await fetch(`${process.env.ROUTING_API_PREFIX}waypoints=${coords.origin_lat},${coords.origin_lon}|${coords.dest_lat},${coords.dest_lon}&mode=drive&apiKey=${process.env.GEOAPIFY_API_KEY}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json()

            routeGeometry = JSON.stringify(result.features[0].geometry.coordinates[0].map(([lng, lat]) => [lat, lng]));
            driveTime = result.features[0].properties.time

        }

        await updateShipmentService(shipmentId, date, userId, eventType, routeGeometry , driveTime)
        res.status(200).json({ message: 'Shipment updated successfully' })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getShipmentById = async (req , res) => {
    try{
        const {shipmentId} = req.params;
        let shipment = await getShipmentByIdService(shipmentId);
        res.status(200).json({shipment})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const shipmentSearch = async (req , res) => {
    try{
        const {id} = req.user
        const {value} = req.query
        const modSearchValue = '%' + value.toLowerCase() + '%'

        const shipperLocation = await getShipperLocationIdService(id)

        const shipments = await shipmentSearchService(shipperLocation , modSearchValue)

        res.status(200).json({shipments})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = { createShipment, getUndeliveredShipments, getShipmentsByCarrierId, updateShipment , getShipmentById , shipmentSearch }