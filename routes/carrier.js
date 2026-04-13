const express = require('express');
const router = express.Router();
const {getShipmentsByCarrierId , updateShipment} = require('../controllers/shipments.controller')
const {getPkgsByCarrierUser} = require('../controllers/packages.controller')

router.get('/shipments/:userId' , getShipmentsByCarrierId)

router.post('/shipments/:shipmentId' , updateShipment)

router.get('/packages/:id' , getPkgsByCarrierUser)

module.exports = router;