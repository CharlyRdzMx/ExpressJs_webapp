// Librerías
const express = require("express");
const path = require('path');
const expresshbs = require('express-handlebars');

require("dotenv/config");

const app = express();

// Configuración del sitio
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', expresshbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares **********************************************************************

app.use(function(req, res, next) {
    next();
});

// 
// app.use(express.static(path.join(__dirname, '/public')));

// Rutas ****************************************************************************
const route_web = require('./routes/routes_web');
app.use('/', route_web);

const route_api = require('./routes/routes_api');
app.use('/api', route_api);

// INICIALIZA SERVIDOR **************************************************************

app.listen(process.env.APP_PORT, () => {
    console.log("El servidor está inicializado en el puerto ", process.env.APP_PORT);
})
