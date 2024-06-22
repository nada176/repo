const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('./Models/index.js');
const PatientRouter = require('./Routes/patientRoute.js');

const PORT = process.env.PORT || 3000;
app.use(express.json({
    error: (err, req, res, next) => {
       if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
         return res.status(400).send({ error: 'Invalid JSON format' });
       }
       next();
    }
   }));
   app.use(cors({
    origin: [`${process.env.LOCALHOST}:3000`],
    credentials: true
})) 
app.use(cookieParser());

app.use('/api/patient', PatientRouter);


app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.LOCALHOST}:${PORT}`);
});
