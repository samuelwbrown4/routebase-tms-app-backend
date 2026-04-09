const express = require('express');
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 4000

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}))

const shipperRoutes = require('./routes/shipperRoutes');
const userRoutes = require('./routes/users');
const carrierRoutes = require('./routes/carrierRoutes')

app.use('/api/users' , userRoutes);
app.use('/api/shipper-user' , shipperRoutes);
app.use('/api/carrier-user' , carrierRoutes);

app.get('/' , (req , res) => {
    res.send('TMS app up and running!')
})

app.listen(PORT , ()=> {
    console.log(`App is running on port ${PORT}`)
})