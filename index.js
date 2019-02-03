const express = require('express');

const port = 9001;

const app = express();

const mongoose = require('./config/db');

const {routes} = require('./config/routers');

app.use(express.json());
app.use('/', routes);


app.listen(port, () => {
    console.log('listening on port', port);
});
