const express = require('express');
const pool = require('../db/pool')
const router = express.Router();
const {getShipmentsByCarrierId , updateShipment} = require('../controllers/shipments.controller')
const {getPkgsByCarrierUser , createPkgByCarrierUser} = require('../controllers/packages.controller')
const {createContract} = require('../controllers/contracts.controller')

router.get('/shipments/:userId' , getShipmentsByCarrierId)

router.post('/shipments/:shipmentId' , updateShipment)

router.get('/packages/:id' , getPkgsByCarrierUser)

router.post('/packages/:id' , createPkgByCarrierUser)

router.get('/shippers' , async (req , res)=>{
    try{
        const shippers = await pool.query(`
            SELECT *
            FROM
            companies 
            `);

        res.status(200).json({shippers: shippers.rows})
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.post('/contracts/:carrierUserId' , createContract)

module.exports = router;