const mongoose = require('mongoose')

const url = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    big: { type: String, required: true },
    small: { type: String },
    views: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
})

module.exports = mongoose.model('url', url)