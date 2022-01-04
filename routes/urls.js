const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Url = require('../models/url')

router.post('/', (req, res) => {
    const url = new Url({
        _id: new mongoose.Types.ObjectId(),
        big: req.body.big,
        small: encurtarUrl(),
        views: 1,
        user: req.body.user
    })

    url.save()
        .then(() => res.status(201).json({ message: "Salvo com sucesso!", _id: url._id }))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/view/:id', (req, res) => {
    Url.findById(req.params.id)
        .exec()
        .then(url => {
            if (url._id) {
                url.views = url.views + 1
                Url.updateOne({ _id: url._id }, { $set: url }).exec()
                    .then(() => res.status(200).json({ message: "Uma visualização adicionada com sucesso!" }))
                    .catch(err => res.status(500).json({ error: err }))
            }
            else
                res.status(404).json({ message: "URL não encontrada!" })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/top100', async (req, res) => {
    Url.find()
        .populate('user')
        .exec()
        .then(async urls => {
            urls = await sortByViews(urls)
            res.status(200).json(urls)
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/', (req, res) => {
    Url.find()
        .populate('user')
        .exec()
        .then(urls => res.status(200).json(urls))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('/:id', (req, res) => {
    Url.findById(req.params.id)
        .populate('user')
        .exec()
        .then(url => {
            if (url) res.status(200).json(url)
            else res.status(404).json({ message: 'Registro não encontrado!', _id: user._id })
        })
        .catch(err => res.status(500).json({ error: err }))
})

router.put('/:id', (req, res) => {
    Url.updateOne({ _id: req.params.id }, { $set: req.body }).exec()
        .then(() => res.status(200).json({ message: "Editado com sucesso!" }))
        .catch(err => res.status(500).json({ error: err }))
})

router.delete('/:id', (req, res) => {
    Url.deleteOne({ _id: req.params.id }).exec()
        .then(() => res.status(200).json({ message: "Deletado com sucesso!" }))
        .catch(err => res.status(500).json({ error: err }))
})

sortByViews = async (data) => {
    let aux = data.sort((a, b) => {
        if (a.views < b.views) return 1
        if (a.views > b.views) return -1
        return 0
    })
    return aux.slice(0, 99)
}

encurtarUrl = () => {
    let text = ''
    let p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++)
        text += p.charAt(Math.floor(Math.random() * p.length))
    return text
}

module.exports = router