import fs from 'fs'
import { utilService } from "../../services/util.service.js"
import { loggerService } from '../../services/logger.service.js'

const PAGE_SIZE = 2
const users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

async function query() {
    try {
        return users
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw `User not found by userId : ${userId}`
        return user
    } catch (err) {
        loggerService.error('userService[getById] : ', err)
        throw err
    }
}

async function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return user
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Couldn't find user with _id ${causerIdrId}`

        users.splice(idx, 1)
        await _saveUsersToFile()
    } catch (err) {
        loggerService.error('userService[remove] : ', err)
        throw err
    }
}


async function save(user) {
    try {
        // Only handles user ADD for now
        user._id = utilService.makeId()
        user.score = 10000
        user.createdAt = Date.now()
        users.push(user)
        await _saveUsersToFile()
        return user
    } catch (err) {
        loggerService.error('userService[save] : ', err)
        throw err
    }
}


function _saveUsersToFile(path = './data/user.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}