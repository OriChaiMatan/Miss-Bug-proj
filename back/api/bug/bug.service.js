import fs from 'fs'
import { utilService } from "../../services/util.service.js"

const PAGE_SIZE = 2
const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query(filterBy = {}) {
    let filteredBugs = [...bugs]
    try {
        if (filterBy.label) { 
            filteredBugs = filteredBugs.filter(bug => bug.labels.includes(filterBy.label))
        }
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.severity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.severity)
        }
    

        // Sort would come here
        if (filterBy.sortBy) {
            if (filterBy.sortBy === 'Title') {
              filteredBugs.sort((a, b) => a.title.localeCompare(b.title))
            } else if (filterBy.sortBy === 'Severity') {
              filteredBugs.sort((a, b) => a.severity - b.severity)
            } else if (filterBy.sortBy === 'CreatedAt') {
              if (filterBy.sortDir === '-1') {
                filteredBugs.sort((a, b) => b.createdAt - a.createdAt)
              } else {
                filteredBugs.sort((a, b) => a.createdAt - b.createdAt)
              }
            }
        }

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
        }
        

        return filteredBugs
    } catch (err) {
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        return bug
    } catch (err) {
        throw err
    }
}


async function remove(bugId) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw `Cannot find bug with _id ${bugId}`

        const bug = bugs[bugIdx]
        if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id) throw { msg: `Not your bug`, code: 403 }

        bugs.splice(bugIdx, 1)
        _saveBugsToFile()
    } catch (err) {
        throw err
    }
}


async function save(bugToSave) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`

             const bug = bugs[idx]
            if (!loggedinUser?.isAdmin && bug.owner._id !== loggedinUser?._id) throw `Not your bug`

            bugs.splice(idx, 1, {...bug, ...bugToSave })
        } else {
            bugToSave._id = utilService.makeId()
            bugToSave.owner = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (err) {
        throw err
    }
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