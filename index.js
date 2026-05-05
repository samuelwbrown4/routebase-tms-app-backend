const express = require('express');
const cors = require('cors')
require('dotenv').config()
const {startTrackingJob} = require('./jobs/trackingSimJob')

const PORT = process.env.PORT || 4000

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}))


const userRoutes = require('./routes/users');
const shipper = require('./routes/shipper');
const carrier = require('./routes/carrier');
const shared = require('./routes/shared');

app.use('/api/users' , userRoutes);
app.use('/api/shipper' , shipper);
app.use('/api/carrier' , carrier);
app.use('/api/shared' , shared);

app.get('/' , (req , res) => {
    res.send('TMS app up and running!')
})

app.listen(PORT , ()=> {
    console.log(`App is running on port ${PORT}`);
    startTrackingJob();
})