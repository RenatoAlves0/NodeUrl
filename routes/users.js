const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

router.post('/', (req, res) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        login: req.body.login,
        senha: req.body.senha,
    })

    user.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: user._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/logar', (req, res) => {
    User.findOne({ login: req.query.login, senha: req.query.senha })
        .exec()
        .then(doc => {
            if (doc._id)
                res.status(200).json(doc)
            else
                res.status(404).json({})
        })
        .catch(() => { res.status(404).json({}) })
})

router.get('/', (req, res) => {
    User.find()
        .sort({ login: 'asc' })
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:id', (req, res) => {
    User.updateOne({ _id: req.params.id }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:id', (req, res) => {
    User.deleteOne({ _id: req.params.id }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router