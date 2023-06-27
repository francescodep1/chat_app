const express = require('express');
const userController = require('../controllers/users');

const router = express.Router();

// POST http://localhost:3001/api/users/new/
router.post('/new',userController.addUser);

//GET http://localhost:3001/api/users/:username
router.get('/:firstName/:lastName',userController.getUserByFullName)


//DELETE http://localhost:3001/api/users/del/:username !!attenzione: eliminazione utente con username
router.delete('/del/:username',userController.deleteUserByUsername)


module.exports = router
