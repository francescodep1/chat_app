const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

const router = require('./routes/api');
const {port} = require("./config");




const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


//PRIMA api funzionante
app.use('/api', router)


app.listen(config.port, () => console.log(`Server is running on port ${port}`))

