import { bugService } from "./bug.service.js"

export async function getBugs(req, res){
    const { txt, severity, description, labels, pageIdx } = req.query
    const filterBy = { txt, severity, description, labels, pageIdx }

    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (error) {
        loggerService.error(`Could'nt get bugs`, error)
        res.status(400).send(`Could'nt get bugs`)
    }
}

export async function getBug(req, res) {
    try {
        const bugId = req.params.bugId
        // console.log('bugId:', bugId)
        let visitedBugs = req.cookies.visitedBugs || []
        if (visitedBugs.length > 2) return res.status(401).send('Wait for a bit');
        if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId) 
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

        const bug = await bugService.getById(bugId)
        console.log('bug:', bug)
        res.send(bug)
    } catch (error) {
        loggerService.error(`Could'nt get bug`, error)
        res.status(400).send(`Could'nt get bug`)
    }
}

export async function removeBug(req, res) {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('deleted')
    } catch (error) {
        loggerService.error(`Could'nt remove bug`, error)
        res.status(400).send(`Could'nt remove bug`)
    }
}

export async function updateBug(req, res){
    const { _id, txt, severity, description, labels } = req.body 
    let bugToSave = { _id, txt, severity: +severity, description, labels }

    try {
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        loggerService.error(`Could'nt save bug`, error)
        res.status(400).send(`Could'nt save bug`)
    }
}

export async function addBug(req, res){
    const { txt, severity, description, labels } = req.body 
    let bugToSave = { txt, severity: +severity, description, labels }
    try {
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        loggerService.error(`Could'nt save bug`, error)
        res.status(400).send(`Could'nt save bug`)
    }
}