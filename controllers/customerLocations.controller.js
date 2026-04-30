const {getCustomerLocationsByCompanyIdService , createCustomerLocationService} = require('../services/customerLocations.service');
const {getCompanyIdService} = require('../services/shippers.service')
const {createCustomerService} = require('../services/customers.service')

const getCustomerLocationsByCompanyId = async (req , res) => {
    try{
        let {userId} = req.params;
        let companyId = await getCompanyIdService(userId)
        let customerLocations = await getCustomerLocationsByCompanyIdService(companyId);

        res.status(200).json({customerLocations})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const createCustomerLocation = async (req , res) => {
    try{
        let {userId} = req.params;
        let {existingCustomer} = req.query
        let {customerId , locName , locAddress , locCity , locState , locZip , locCountry , custName , custAddress , custCity , custState , custZip , custCountry} = req.body;
        let long = undefined
        let lat = undefined
        
        if(existingCustomer === false){
            let companyId = await getCompanyIdService(userId)
            let customer = await createCustomerService(companyId , custName , custAddress , custCity , custState , custZip , custCountry)
            customerId = customer.id
        }

        try{
            const address = `${locAddress}''${locCity}''${locState}''${locZip}`
            const encodedAddress = encodeURIComponent(address)
            let response = await fetch(`${process.env.FORWARD_GEOCODE_API_URL_PREFIX}${encodedAddress}${process.env.FORWARD_GEOCODE_API_URL_SUFFIX}`, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            let result = await response.json()

            long = result.results[0].lon
            lat = result.results[0].lat

        }catch(err){
            res.status(500).json({error: err.message})
        }

        let newCustomerLocation = await createCustomerLocationService(customerId , locName , locAddress , locCity , locState , locZip , locCountry , lat , long)

        res.status(201).json({newCustomerLocation})
        
        
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getCustomerLocationsByCompanyId , createCustomerLocation}