import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { toyService } from './service/toyService.js'

const app = express()
const PORT = 3032

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))

app.get('/api/toy', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minPrice: +req.query.minPrice || 0,
        maxPrice: +req.query.maxPrice || Infinity,
        pageIdx: req.query.pageIdx || undefined,
    }
    toyService.query(filterBy)
        .then(toys => res.send(toys))
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.getById(toyId)
        .then(toy => res.send(toy))
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

app.post('/api/toy', (req, res) => {
    const { name, price, labels, inStock } = req.body
    const toy = {
        name,
        price: +price,
        labels,
        inStock,
        createdAt: new Date().toISOString() 
    }

    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

app.put('/api/toy/:id', (req, res) => {
    const { id } = req.params
    const { name, price, labels, inStock } = req.body
    const toy = {
        _id: id,
        name,
        price: +price,
        labels,
        inStock,
        createdAt: new Date(req.body.createdAt).toISOString() 
    }

    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
