
const config = require('./config')
const admin = require('firebase-admin');



const db = admin.initializeApp({
    credential: admin.credential.cert(config.key),
    databaseURL: "https://progettoFondamentiWeb.firebaseio.com",
});





module.exports = db;
