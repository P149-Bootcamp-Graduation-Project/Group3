const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const errorRoute = require("./app/routes/errorLogRoute")
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// app.post('/errlogs',(req,res)=>{
//     console.log(req.body)
// 	res.send("error logu başarılı şekilde iletildi.")
// })

app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

app.use("/errlogs",errorRoute)

app.listen(process.env.APP_PORT,()=> console.log(`Server listening on ${process.env.APP_PORT} port`))