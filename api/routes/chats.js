const express = require ('express');
const chatsController = require('../controllers/chats')

const router = express.Router();

// POST http://localhost:3000/api/chats/update
router.put('/update',chatsController.addNewChat);

//GET (REALtime)
router.get('/refresh/:currentUserId',chatsController.refresh);


//GET per refresh chat real time http://localhost:3000/api/chats/refreschat/
router.get('/refreshchat/:chatId', chatsController.refreshChatMessages);

//POST http://localhost:3000/api/chats/new
router.post('/newempty',chatsController.addNewEmptyUserChats);


//PUT aggiornamento
router.put('/updatemessage',chatsController.updateMessageInChat)


module.exports = router