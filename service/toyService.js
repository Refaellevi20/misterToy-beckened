import fs from 'fs/promises';  
import { utilService } from './util.service.js';

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

export function query() {
    return Promise.resolve(toys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}


export function save({ _id, name, price, labels, inStock, createdAt = Date.now() }) {
    const toyToSave = { _id, name, price, labels, inStock, createdAt };
    if (_id) {
        const idx = toys.findIndex(toy => toy._id === _id)
        toys[idx] = toyToSave;
    } else {
        toyToSave._id = _makeId()
        toys.unshift(toyToSave)
    }
    return _saveToysToFile().then(() => toyToSave)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')

    toys.splice(idx, 1)
    return _savetoysToFile()
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}

function _makeId(length = 5) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
