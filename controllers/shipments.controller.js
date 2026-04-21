const {createShipmentService , getUndeliveredShipmentsService , getShipmentsByCarrierIdService , updateShipmentService} = require('../services/shipments.service')

const createShipment = async (req , res) => {
    try{ 
        const { originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders } = req.body

        const shipment = await createShipmentService(originId, destinationId, carrier, equipmentType, status, totalWeight, pickDate, dropDate, userId, orders )

        res.status(200).json({ shipment })
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const getUndeliveredShipments = async (req , res) => {
    try{
        const undeliveredShipments = await getUndeliveredShipmentsService()

        res.status(200).json({undeliveredShipments})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const getShipmentsByCarrierId = async (req , res) => {
    try{
        const {userId} = req.params;
        const shipments = await getShipmentsByCarrierIdService(userId)
        res.status(200).json({shipments})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const updateShipment = async (req , res) => {
   try{
        const {shipmentId} = req.params;
        const { date , userId , eventType} = req.body

        await updateShipmentService(shipmentId , date , userId , eventType)
        res.status(200).json({message: 'Shipment updated successfully'})
    
    }catch(err){
        res.status(500).json({error: err.message})
    } 
}

module.exports = {createShipment , getUndeliveredShipments , getShipmentsByCarrierId , updateShipment}