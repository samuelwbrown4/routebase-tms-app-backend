const { getPkgsByCarrierUserService } = require('../services/packages.service');

const getPkgsByCarrierUser = async (req, res) => {
    try {
        const { id } = req.params;
        const packages = await getPkgsByCarrierUserService(id)
        res.status(200).json({ packages })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {getPkgsByCarrierUser}