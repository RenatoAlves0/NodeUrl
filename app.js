const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const conectar = require('./configs/banco')
conectar()

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.use('/url', require('./routes/urls'))
app.use('/user', require('./routes/users'))

// Start
const porta = process.env.PORT || 3000
app.listen(porta, () => {
    console.log('Servidor iniciado na porta ' + porta)
})