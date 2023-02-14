const express = require('express');
const app = express();
const config = require('config');
const fileUpload = require('express-fileupload');
const cors = require('cors');

app.use(express.static('public'));

// Settings
app.set('port' , process.env.port || config.get('app.port'));

//Middlewares
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost/prueba-tecnica-xdevelop/frontend/');  

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json());
app.use(fileUpload());
app.use(cors());

//routes de api
app.use(require('./routes/api'));


app.listen(3000 , () => {
	console.log('Server on port 3000');
});