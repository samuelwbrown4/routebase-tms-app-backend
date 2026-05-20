const express = require('express')
const {validateApiKey} = require('../middleware/api')
const router = express.Router();

const {createOrder} = require('../controllers/orders.controller')

router.post('/orders' , validateApiKey, createOrder)

module.exports = router