const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const helmet = require('helmet')

mongoose.connect('mongodb+srv://ocprojet6_user:ocprojet6_pass@ocprojet6cluster.lmsrg.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log(`Connexion à MongoDB échouée ! ${error}`));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet());

module.exports = app;