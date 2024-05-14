import express from 'express'
import { addBug, getBugs, getBug, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'

const router = express.Router()

router.get('/', log, getBugs)
router.get('/:bugId', log, getBug)
router.delete('/:bugId', log, removeBug)
router.put('/:bugId', log, updateBug)
router.post('/', log, addBug)

export const bugRoutes = router