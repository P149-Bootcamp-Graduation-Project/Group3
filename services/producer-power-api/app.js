require('dotenv').config({ path: __dirname+'/.env' });
global.express = require("express");
global.app = express();
//const {rd_client} = require('./app/adapters/database/redis');
//const {pg_client} = require('./app/adapters/database/postgresql');
//const {mongo_client} = require('./app/adapters/database/mongodb');
const { router } = require('./app/routes/routes');
//const swagger = require('./app/libs/swagger/autogen');
//const expressSwagger = require('express-swagger-generator')(app);

//Global Variable
global.userIN = null;

app.use(express.json());
//app.set('view engine', 'ejs'); //FOR views Template engine

app.use(router);


// app.use("/docs", swagger.Swag_serve, swagger.Swag_setup);


let options = {
    swaggerDefinition: {
        info: {
            description: "Node.js Express API with Swagger",
            title: "Inavitas Örnek Proje",
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            Bearer: {
                description: 'Example value:- Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQwMGJhNTJjYjJjM',
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        },
        security: [{Bearer: []}],
        defaultSecurity: 'Bearer'
    },
    basedir: __dirname, //app absolute path
    files: ['./app/controllers/**/*.js'] //Path to the API handle folder
};


//module.exports = expressSwagger(options);

app.listen(process.env.APP_PORT, () => 
    console.log(`Server listening on docker container --> ${process.env.APP_PORT}`));

