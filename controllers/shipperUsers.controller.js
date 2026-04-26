const { createShipperUserService, getShipperUserByEmailService, updateNewShipperUserService , getAllShipperUsersService } = require('../services/shipperUsers.service');
const {getCompanyIdService} = require('../services/shippers.service')
const bcrypt = require('bcrypt');
const { transporter } = require('../email/mailer');


const createShipperUser = async (req, res) => {
    try {
        const { locationId, erpId, firstName, lastName, email, phone, role } = req.body

        let newUser = await createShipperUserService(locationId, erpId, firstName, lastName, email, phone, role)
        //send email
        if (newUser) {
            await transporter.sendMail({
                from: process.env.GOOGLE_USER,
                to: email,
                subject: 'Welcome to Routebase! Set your password',
                text: 'Your account has been created. Please set your password using the provided link. http://localhost:5173/user/create-password'
                
            });
        }
        res.status(200).json({ newUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


const updateNewShipperUser = async (req, res) => {
    try {
        const { password } = req.body
        const { email } = req.params
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await getShipperUserByEmailService(email)
        const updatedUser = await updateNewShipperUserService(user, hashedPassword)
        res.status(200).json({ updatedUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

const getAllShipperUsers = async (req , res) => {
    try{
        const {id} = req.params
        const companyId = await getCompanyIdService(id);

        const users = await getAllShipperUsersService(companyId)
        res.status(200).json({users})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = { createShipperUser, updateNewShipperUser , getAllShipperUsers }