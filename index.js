require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
};
const db = require('./utils/Database');
const routes = require('./routes');

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/v1', routes);

app.listen(port, () => {
    try {
        db.connectDB();
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(error);
        console.error(`Error running on port ${port}`);
    }
});
