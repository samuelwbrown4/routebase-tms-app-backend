const pool = require('../db/pool')

async function validateApiKey(req , res , next){
    const key = req.headers['x-api-key'];
    if(!key){
        return res.status(401).json({error: 'No API Key'})
    }

    const company = await pool.query(`
        SELECT company_id
        FROM api_keys
        WHERE api_key = $1
        `,[key])

    if(company.rows.length === 0){
        return res.status(401).json({error: 'Invalid API Key'})
    }

    req.companyId = company.rows[0].company_id;
    next();
};

module.exports = {validateApiKey}