import express from 'express'
import { addBug, getBugs, getBug, removeBug, updateBug } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', removeBug)
router.put('/:bugId', updateBug)
router.post('/', addBug)

export const bugRoutes = router