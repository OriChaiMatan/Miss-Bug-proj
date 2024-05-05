import express from 'express'
import { addUser, getUsers, getUser, removeUser, updateUser } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:bugId', getUser)
router.delete('/:bugId', removeUser)
router.put('/:bugId', updateUser)
router.post('/', addUser)

export const userRoutes = router