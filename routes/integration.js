const express = require('express')
const {validateApiKey} = require('../middleware/api')
const router = express.Router();

const {createOrder} = require('../controllers/orders.controller');
const { createCustomerLocation } = require('../controllers/customerLocations.controller');
const { createCustomer } = require('../controllers/customers.controller');

router.post('/orders' , validateApiKey, createOrder)

router.post('/customer-locations' , validateApiKey , createCustomerLocation)

router.post('/customers' , validateApiKey , createCustomer)

module.exports = router