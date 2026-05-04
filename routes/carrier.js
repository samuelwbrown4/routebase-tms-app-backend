const express = require('express');
const pool = require('../db/pool')
const router = express.Router();
const {requireAuth , requireAdmin} = require('../middleware/auth')
const {getShipmentsByCarrierId , updateShipment , getShipmentById} = require('../controllers/shipments.controller')
const {getPkgsByCarrierUser , createPkgByCarrierUser} = require('../controllers/packages.controller')
const {createContract} = require('../controllers/contracts.controller')

router.get('/shipments' , requireAuth , getShipmentsByCarrierId)

router.get('/shipments/geometry/:shipmentId' , requireAuth , getShipmentById)

router.patch('/shipments/:shipmentId' , requireAdmin , updateShipment)


router.get('/packages' , requireAuth , getPkgsByCarrierUser)

router.post('/packages' , requireAdmin , createPkgByCarrierUser)

router.get('/shippers' , requireAuth , async (req , res)=>{
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

router.post('/contracts' , requireAdmin , createContract)

module.exports = router;