const {getCustomerLocationsByCompanyIdService , createCustomerLocationService} = require('../services/customerLocations.service');
const {getCompanyIdService} = require('../services/shippers.service')
const {createCustomerService} = require('../services/customers.service')

const getCustomerLocationsByCompanyId = async (req , res) => {
    try{
        const {id , role , client} = req.user
        let companyId = await getCompanyIdService(id)
        let customerLocations = await getCustomerLocationsByCompanyIdService(companyId);

        res.status(200).json({customerLocations})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const createCustomerLocation = async (req , res) => {
    try{
        console.log('cust loc controller hit')
        const companyId = req.companyId
        let {payload} = req.body;
        
        let long = undefined
        let lat = undefined
        payload.companyId = companyId

        console.log('payload' , payload)


        try{
            const address = `${payload.locAddress}''${payload.locCity}''${payload.locState}''${payload.locZip}`
            const encodedAddress = encodeURIComponent(address)
            let response = await fetch(`${process.env.FORWARD_GEOCODE_API_URL_PREFIX}${encodedAddress}${process.env.FORWARD_GEOCODE_API_URL_SUFFIX}`, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            let result = await response.json()
            
            payload.long = result.results[0].lon
            payload.lat = result.results[0].lat
            
        }catch(err){
            return res.status(500).json({error: err.message})
        }
        if(!result.results[0].lon || !result.results[0].lat) return res.status(500).json({message: 'Invalid address'})
        
        let newCustomerLocation = await createCustomerLocationService(payload)

        res.status(201).json({newCustomerLocation})
        
        
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {getCustomerLocationsByCompanyId , createCustomerLocation}