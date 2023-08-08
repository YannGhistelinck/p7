const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book')
const cors = require("cors")
const app = express();
const path = require('path')
require ('dotenv').config()

app.use(cors())

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.MDP}@cluster0.bo4hwy3.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,useUnifiedTopology: true }).then(() => console.log('Connexion à MongoDB réussie !')).catch(() => console.log('Connexion à MongoDB échouée !'));

/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});*/

app.use(express.json());


app.use('/api/auth', userRoutes);

app.use('/api/books', bookRoutes);

app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')))

module.exports = app;