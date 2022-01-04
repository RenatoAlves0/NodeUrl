const express = require('express')
const app = express()
const conectar = require('./configs/banco')
conectar()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

// Routes
app.use('/url', require('./routes/urls'))
app.use('/user', require('./routes/users'))

// Start
const porta = process.env.PORT || 3000
app.listen(porta, () => {
    console.log('Servidor iniciado na porta ' + porta)
})