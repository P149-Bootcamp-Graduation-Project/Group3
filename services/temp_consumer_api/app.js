const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({ path: __dirname+'/.env' })
//const errorCatch = require('./app/middleware/errorMiddleware')
const consumerRoute  = require('./app/routes/consumerRoute')
const { pg_client }  = require('./app/adapters/database/postgresql')
const { rd_client } = require('./app/adapters/database/redis')


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/',consumerRoute)
app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`));

