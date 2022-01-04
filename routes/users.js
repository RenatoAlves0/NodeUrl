const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const Config = require('../configs/segredo')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post('/', (req, res) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        login: req.body.login,
        senha: bcrypt.hashSync(req.body.senha, 8)
    })
    user.save()
        .then(() => res.status(201).json({ message: "Salvo com sucesso!", _id: user._id }))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/logar', (req, res) => {
    User.findOne({ login: req.body.login })
        .exec()
        .then(user => {
            if (user._id) {
                if (!bcrypt.compareSync(req.body.senha, user.senha))
                    return res.status(401).json({
                        accessToken: null,
                        message: "Senha inválida!"
                    })

                res.status(200).json({
                    _id: user._id,
                    nome: user.nome,
                    login: user.login,
                    accessToken: jwt.sign({ _id: user._id }, Config.segredo, { expiresIn: 86400 /* 24h */ })
                })
            }
            else
                res.status(404).json({ message: "Usuário não encontrado!" })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/', (req, res) => {
    User.find()
        .sort({ login: 'asc' })
        .exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(user => {
            if (user) res.status(200).json(user)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.put('/:id', (req, res) => {
    User.updateOne({ _id: req.params.id }, { $set: req.body }).exec()
        .then(() => res.status(200).json({ message: "Editado com sucesso!" }))
        .catch(err => res.status(500).json({ error: err }))
})

router.delete('/:id', (req, res) => {
    User.deleteOne({ _id: req.params.id }).exec()
        .then(() => res.status(200).json({ message: "Deletado com sucesso!" }))
        .catch(err => res.status(500).json({ error: err }))
})

module.exports = router