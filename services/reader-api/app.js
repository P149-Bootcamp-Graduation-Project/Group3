require("dotenv").config({ path: __dirname + "/.env" });
global.express = require("express");
global.app = express();
const { rd_client } = require("./app/adapters/database/redis");
const { pg_client } = require("./app/adapters/database/postgresql");
//const {mongo_client} = require('./app/adapters/database/mongodb');
const { router } = require("./app/routes/routes");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


//Global Variable
global.userIN = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(router);

app.use('/swagger-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.listen(process.env.APP_PORT, () => console.log(`Redis & Postgre Server listening on  --> ${process.env.APP_PORT}\n`));
