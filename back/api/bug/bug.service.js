import fs from 'fs'
import { utilService } from "../../services/util.service.js"
import { dbService } from '../../services/db.service.js';
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 2
// const bugs = utilService.readJsonFile('data/bugs.json')
const collectionName = 'bug'

export const bugService = {
    query,
    getById,
    remove
}


async function query(filterBy = {}) {
    try {
        const { criteria, sortCriteria } = _buildCriteria(filterBy); // Get criteria and sort criteria from _buildCriteria

        const collection = await dbService.getCollection(collectionName);

        let bugCursor = collection.find(criteria); // Initial query with criteria

        // Sorting
        if (Object.keys(sortCriteria).length > 0) {
            bugCursor = bugCursor.sort(sortCriteria);
        }

        // Pagination
        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE;
            bugCursor = bugCursor.skip(startIdx).limit(PAGE_SIZE);
        }

        const filteredBugs = await bugCursor.toArray(); // Execute query and convert cursor to array
        return filteredBugs;
    } catch (err) {
        throw err;
    }
}

async function getById(bugId) {
    // try {
    //     const bug = bugs.find(bug => bug._id === bugId)
    //     return bug
    // } catch (err) {
    //     throw err
    // }
    try {
        const collection = await dbService.getCollection(collectionName)
        const bug = collection.findOne({ _id: new ObjectId(bugId) })
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        logger.error(`while finding bug ${bugId}`, err)
        throw err
    }
}


async function remove(bugId, loggedinUser) {
    // try {
    //     const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    //     if (bugIdx === -1) throw `Cannot find bug with _id ${bugId}`

    //     const bug = bugs[bugIdx]
    //     if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id) throw { msg: `Not your bug`, code: 403 }

    //     bugs.splice(bugIdx, 1)
    //     _saveBugsToFile()
    // } catch (err) {
    //     throw err
    // }
    try {
        const collection = await dbService.getCollection(collectionName)
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(bugId) })
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove bug ${bugId}`, err)
        throw err
    }
}

async function add(bugToSave, loggedinUser) {
    try {
        bugToSave.owner = loggedinUser
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(bugToSave)
        return bugToSave
    } catch (err) {
        logger.error('bugService, can not add bug : ' + err)
        throw err
    }
}

async function update(bug) {
    try {
        // Peek only updateable fields
        const bugToSave = {
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(bug._id) }, { $set: bugToSave })
        return bug
    } catch (err) {
        logger.error(`cannot update bug ${bug._id}`, err)
        throw err
    }
}

async function addCarMsg(bugId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(bugId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add bug msg ${bugId}`, err)
        throw err
    }
}

async function removeBugMsg(bugId, msgId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(bugId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add bug msg ${bugId}`, err)
        throw err
    }
}

// async function save(bugToSave, loggedinUser) {
//     try {
//         if (bugToSave._id) {
//             const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
//             if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`

//              const bug = bugs[idx]
//             if (!loggedinUser?.isAdmin && bug.owner._id !== loggedinUser?._id) throw `Not your bug`

//             bugs.splice(idx, 1, {...bug, ...bugToSave })
//         } else {
//             bugToSave._id = utilService.makeId()
//             bugToSave.owner = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
//             bugToSave.createdAt = Date.now()
//             bugs.push(bugToSave)
//         }
//         await _saveBugsToFile()
//         return bugToSave
//     } catch (err) {
//         throw err
//     }
// }

function _buildCriteria(filterBy) {
    const criteria = {};

    if (filterBy.label) {
        criteria.labels = { $in: [filterBy.label] };
    }

    if (filterBy.title) {
        criteria.title = { $regex: new RegExp(filterBy.title, 'i') };
    }

    if (filterBy.severity) {
        criteria.severity = { $gte: filterBy.severity };
    }

    // Sorting
    let sortCriteria = {};
    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'Title') {
            sortCriteria.title = 1; // Ascending sort by title
        } else if (filterBy.sortBy === 'Severity') {
            sortCriteria.severity = 1; // Ascending sort by severity
        } else if (filterBy.sortBy === 'CreatedAt') {
            sortCriteria.createdAt = (filterBy.sortDir === '-1') ? -1 : 1; // Sort by createdAt, descending or ascending
        }
    }

    return { criteria, sortCriteria };
}


function _saveBugsToFile(path = './data/bugs.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}