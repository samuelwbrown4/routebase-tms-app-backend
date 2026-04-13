const { getRatesByShipperUserService } = require('../services/rates.service');

const getRatesByShipperUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { distance } = req.body;

        const rates = await getRatesByShipperUserService(userId, distance);
        res.status(200).json({ rates })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {getRatesByShipperUser};