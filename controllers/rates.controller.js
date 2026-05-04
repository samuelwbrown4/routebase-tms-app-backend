const { getRatesByShipperUserService } = require('../services/rates.service');

const getRatesByShipperUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { distance } = req.body;

        const rates = await getRatesByShipperUserService(id, distance);
        res.status(200).json({ rates })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {getRatesByShipperUser};