const express = require('express')
const usersRouter = require('./users')
const friendRequestsRouter = require('./friendRequest')
const chatsRouter = require('./chats')

const router = express.Router()

router.use('/users', usersRouter)
router.use('/friend-requests', friendRequestsRouter)
router.use('/chats',chatsRouter)

module.exports = router