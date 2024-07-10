import fs from 'fs'
import {dbService} from '../../services/db.service.js'
import { utilService } from "../../services/util.service.js"
import { loggerService } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const {ObjectId} = mongodb


// const PAGE_SIZE = 2
// const users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    add,
    update,
    getByUsername
}

async function query() {
    // try {
    //     return users
    // } catch (err) {
    //     throw err
    // }
    // const criteria = _buildCriteria()
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    // try {
    //     const user = users.find(user => user._id === userId)
    //     if (!user) throw `User not found by userId : ${userId}`
    //     return user
    // } catch (err) {
    //     loggerService.error('userService[getById] : ', err)
    //     throw err
    // }
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password

        user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser
            return review
        })

        return user
    } catch (err) {
        loggerService.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    // const user = users.find(user => user.username === username)
    // return user
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        loggerService.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    // try {
    //     const idx = users.findIndex(user => user._id === userId)
    //     if (idx === -1) throw `Couldn't find user with _id ${causerIdrId}`

    //     users.splice(idx, 1)
    //     await _saveUsersToFile()
    // } catch (err) {
    //     loggerService.error('userService[remove] : ', err)
    //     throw err
    // }
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: ObjectId(user._id), // needed for the returnd obj
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            score: 100
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        loggerService.error('cannot add user', err)
        throw err
    }
}


// async function save(user) {
//     try {
//         // Only handles user ADD for now
//         user._id = utilService.makeId()
//         user.score = 10000
//         user.createdAt = Date.now()
//         users.push(user)
//         await _saveUsersToFile()
//         return user
//     } catch (err) {
//         loggerService.error('userService[save] : ', err)
//         throw err
//     }
// }


function _saveUsersToFile(path = './data/user.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}
