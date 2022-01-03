const mongoose = require('mongoose')

const user = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    login: { type: String, required: true },
    senha: { type: String, required: true }
})

module.exports = mongoose.model('user', user)