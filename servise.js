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
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174'
    ],
    credentials: true
}

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))

app.get('/api/toy', (req, res) => {
    console.log(req.query);

    const filterBy = {
        name: req.query.name || '',
        price: req.query.price || '',
        labels: req.query.labels || [],
    }

    const sortBy = {
        field: req.query.sortBy || 'name',
        field: req.query.sortBy || 'created',
        field: req.query.sortBy || 'inStock',
        // field: req.query.sortBy || 'name',
        dir: parseInt(req.query.sortDir) || 1 
    }
    toyService.query(filterBy,sortBy)
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
    const { id } = req.params;
    const toyData = req.body; // Extract toy data from the request body

    // Add your logic to update the toy in the database
    toyService.updateToy(id, toyData)
        .then(updatedToy => res.json(updatedToy))
        .catch(err => {
            console.error('Cannot update toy', err);
            res.status(400).send('Cannot update toy');
        });
});

app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    console.log(toyId)

    toyService.remove(toyId)
        .then(() => res.send('Removed!'))
        .catch(err => {
            res.status(400).send('Cannot remove toy')
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
  })
  

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
