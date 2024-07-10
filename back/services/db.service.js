import mongoDB from 'mongodb'
const { MongoClient } = mongoDB

import { config } from '../config/index.js'
import { loggerService } from './logger.service.js'


export const dbService = {
    getCollection
}

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        loggerService.error('Failed to get Mongo collection', err)
        throw err
    }
}
async function connect() {
    if (dbConn) return dbConn
    try {
        console.log("config.dbURL", config.dbURL)
        const client = await MongoClient.connect(config.dbURL)
        const db = client.db(config.dbName)
        dbConn = db
        loggerService.info('Connected to DB')
        return db
    } catch (err) {
        loggerService.error('Cannot Connect to DB', err)
        throw err
    }
}