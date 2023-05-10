import express from 'express'
import cors from 'cors'
import carbuilds from './api/carbuilds.route.js'
import bodyParser from 'body-parser'
const app = express()
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));



app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use("/api/v1/carbuilds", carbuilds)
app.use('*', (req, res) => { res.status(404).json({ error: 'Route Not Found' }) })
app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    console.log('here')
    console.log(error)
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
  });

export default app