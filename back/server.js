import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}

app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))

app.get('/', (req, res) => res.send('Hello'))

app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        res.send(bugs)
    }
    catch (error) {
        loggerService.error(`Couldnt get bugs`, error)
        res.status(400).send(`Couldnt get bugs`)
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        let bugToSave = {
            _id: req.query._id,
            title: req.query.title,
            severity: req.query.severity,
            description: req.query.description
        }

        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    }
    catch (error) {
        loggerService.error(`Couldnt save bug`, error)
        res.status(400).send(`Couldnt save bug`)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    // try{
    //     const bugId = req.params.bugId
    //     const bug = await bugService.getById(bugId)
    //     res.send(bug)
    // }
    // catch(err){
    //     loggerService.error(`Couldnt get bug`, error)
    //     res.status(400).send(`Couldnt get bug`)
    // }
    try {
        const bugId = req.params.bugId
        let visitedBugs = req.cookies.visitedBugs || []
        
        if (visitedBugs.length > 2) return res.status(401).send('Wait for a bit');

        if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId) 
        res.cookie('visitedBugs', visitedBugs, { maxAge: 50 * 1000 })

        const bug = await bugService.getById(bugId);
        res.send(bug);
    } catch (error) {
        loggerService.error(`Couldnt get bug`, error)
        res.status(400).send(`Couldnt get bug`)
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    try {
        const bugId = req.params.bugId
        const bug = await bugService.remove(bugId)
        res.send('bug deleted')
    }
    catch (error) {
        loggerService.error(`Couldnt remoe bug`, error)
        res.status(400).send(`Couldnt remove bug`)
    }
})



const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)