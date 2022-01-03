const mongoose = require('mongoose')

const conectar = () => {
    try {
        mongoose.connect('mongodb+srv://api:' +
            process.env.MONGO_ATLAS_PW +
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

// const { MongoClient } = require('mongodb')
// const uri = "mongodb+srv://api:api@cluster0.rw0m8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
// 
// const conectar = () => {
    // try {
        // client.connect(err => {
            // const collection = client.db("test").collection("devices")
            // perform actions on the collection object
            // client.close()
        // })
        // console.log('Banco de Dados (Sucesso na Conexão)')
    // } catch (err) {
        // console.error(err.message)
        // process.exit(1)
    // }
// }
// 
// module.exports = conectar