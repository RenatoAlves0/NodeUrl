const mongoose = require('mongoose')
const senha = 'api'

const conectar = () => {
    try {
        mongoose.connect('mongodb+srv://api:' +
            senha +
            '@cluster0.rw0m8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        console.log('Banco de Dados (Sucesso na Conexão)')
        mongoose.Promise = global.Promise
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = conectar