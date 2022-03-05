const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const { routes } = require('./routes/crmRoutes')
const bodyparser = require('body-parser')
var cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cookieParser())

routes(app)



const PORT = 3000
app.listen(PORT, function () {
    console.log('Listening on Port:', PORT)
})