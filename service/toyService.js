import fs from 'fs/promises';
import { utilService } from './util.service.js';

export const toyService = {
    query,
    getById,
    remove,
    save,
    updateToy
}

const toys = utilService.readJsonFile('data/toy.json')

export function query(filterBy = {}, sortBy = {}) {
    console.log(filterBy)
    let filteredToys = filter(toys, filterBy)
    let sortedToys = sort(filteredToys, sortBy)
    return Promise.resolve(sortedToys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function filter(toys, filterBy) {
    if (filterBy.name) {
        const regExp = new RegExp(filterBy.name, 'i')
        toys = toys.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.price) {
        toys = toys.filter(toy => toy.price >= filterBy.price)
    }
    return toys
}

function sort(toys, sortBy) {
    const sortDirection = sortBy.dir === -1 ? -1 : 1

    // Sorting based on the specified field
    return toys.sort((a, b) => {
        let comparison = 0
        switch (sortBy.field) {
            case 'name':
                comparison = a.name.localeCompare(b.name)
                break
            case 'price':
                comparison = a.price - b.price
                break;
            case 'createdAt':
                comparison = new Date(a.createdAt) - new Date(b.createdAt)
                break
            case 'inStock':
                comparison = (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)
                break
            default:
                break
        }
        return comparison * sortDirection
    })
}

function _makeId(length = 5) {
    let text = ''
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function updateToy(id, toyData) {
    const idx = toys.findIndex(toy => toy._id === id)
    if (idx === -1) throw new Error('Toy not found')
    toys[idx] = { ...toys[idx], ...toyData }
    return Promise.resolve(toys[idx])
}

// function sort(toys, sortBy) {
//     if (sortBy.field === 'name') {
//         toys = toys.toSorted((c1, c2) => c1.name.localeCompare(c2.name) * sortBy.dir)
//     } else if (sortBy.field === 'price') {
//         toys = toys.toSorted((c1, c2) => (c2.price - c1.price) * sortBy.dir)
//     }else if (sortBy.field === 'created') {
//         toys = toys.toSorted((c1, c2) => (c2.createdAt - c1.createdAt) * sortBy.dir)
//     }else if (sortBy.field === 'inStock') {
//         toys = toys.toSorted((c1, c2) => (c2.inStock - c1.inStock) * sortBy.dir)
//     }
//     return toys
// }

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys[idx] = { ...toys[idx], ...toy }
    } else {
        toy._id = _makeId()
        toy.createdAt = Date.now()
        toy.inStock = true
        toys.unshift(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function remove(toyId) {
    console.log('Attempting to remove toy with ID:', toyId)
    
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
        
        console.log(toys.length)
        toys.splice(idx, 1)
        console.log(toys.length)
    return _saveToysToFile()
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, err => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
}


// function remove(toyId) {
//     const idx = toys.findIndex(toy => toy._id === toyId)
//     if (idx === -1) return Promise.reject('No Such toy')

//     toys.splice(idx, 1)
//     return _savetoysToFile()
// }

