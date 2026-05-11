const { generateBolHtml } = require('../puppeteer/generateBol')
const { getShipmentByIdService } = require('../services/shipments.service')
const { generatePdf } = require('../puppeteer/puppeteer')

const generateBol = async (req, res) => {
    try {
        const { client } = req.user
        const { shipmentId } = req.params

        console.log('generateBolhit')

        const shipment = await getShipmentByIdService(shipmentId)

        console.log('shipment' , shipment)

        const html = generateBolHtml(shipment)

        console.log('html length' , html.length)

        const pdf = await generatePdf(html)

        console.log('generated pdf')

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="BOL-${shipment.shipment_number}.pdf"');
        res.send(pdf);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { generateBol }