const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const Config = require('../configs/segredo')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post('/registrar', async (req, res) => {
    let duplicado = await nomeOuEmailDuplicado(req, res)
    if (duplicado) return

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        email: req.body.email,
        senha: bcrypt.hashSync(req.body.senha, 8)
    })

    user.save()
        .then(() => res.status(201).json({ message: "Salvo com sucesso!", _id: user._id }))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/logar', (req, res) => {
    User.findOne({ email: req.query.email })
        .exec()
        .then(user => {
            if (user && user._id) {
                if (!bcrypt.compareSync(req.query.senha, user.senha))
                    return res.status(401).json({
                        accessToken: null,
                        message: "Senha inválida!"
                    })

                res.status(200).json({
                    message: "Logado com sucesso!",
                    _id: user._id,
                    nome: user.nome,
                    email: user.email,
                    accessToken: jwt.sign({ _id: user._id }, Config.segredo, { expiresIn: 86400 /* 24h */ })
                })
            }
            else
                res.status(404).json({ message: "Usuário não encontrado!" })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/verificar_token', (req, res) => {
    let token = req.headers["x-access-token"]
    if (!token) return res.status(403).send({ message: "Token não fornecido!" })
    jwt.verify(token, Config.segredo, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Token inválido!" })
        if (decoded) return res.status(200).send({ message: "Token válido!", _id: decoded })
    })
})

router.get('/', (req, res) => {
    User.find()
        .sort({ email: 'asc' })
        .exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:id', (req, res) => {
    User.findById(req.query.id)
        .exec()
        .then(user => {
            if (user) res.status(200).json(user)
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.put('/:id', (req, res) => {
    User.updateOne({ _id: req.query.id }, { $set: req.body }).exec()
        .then(() => res.status(200).json({ message: "Editado com sucesso!" }))
        .catch(err => res.status(500).json({ error: err }))
})

router.delete('/:id', (req, res) => {
    User.deleteOne({ _id: req.query.id }).exec()
        .then(() => res.status(200).json({ message: "Deletado com sucesso!" }))
        .catch(err => res.status(500).json({ error: err }))
})

nomeOuEmailDuplicado = async (req, res) => {
    let duplicado = { nome: false, email: false }
    let aux = ''
    await User.findOne({ nome: req.body.nome })
        .exec()
        .then(user => { if (user) duplicado.nome = true })
        .catch(err => res.status(500).json({ error: err }))

    await User.findOne({ email: req.body.email })
        .exec()
        .then(user => { if (user) duplicado.email = true })
        .catch(err => res.status(500).json({ error: err }))

    if (duplicado.nome) aux = aux + 'Nome'
    if (duplicado.nome && duplicado.email) aux = aux + ' e '
    if (duplicado.email) aux = aux + 'Email'
    if (aux != '') {
        res.status(400).send({ message: "Erro! " + aux + " já em uso!" })
        return true
    }
    return false
}

module.exports = router