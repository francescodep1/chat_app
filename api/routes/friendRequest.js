const express = require ('express');
const FriendRequestController = require('../controllers/friendRequest');

const router = express.Router();

// POST http://localhost:3001/api/friend-requests
router.post('/', FriendRequestController.sendFriendRequest);

// GET http://localhost:3001/api/friend-requests/received/:uid
router.get('/received/:uid', FriendRequestController.getReceivedFriendRequests);

// GET http://localhost:3001/api/friend-requests/sent/:uid
router.get('/sent/:uid', FriendRequestController.getSentFriendRequests);

// GET http://localhost:3001/api/friend-requests/:fromUserId/:toUserId
router.get('/:fromUserId/:toUserId', FriendRequestController.getFriendRequestById)

// PUT http://localhost:3001/api/friend-requests/:requestId/accept
router.put('/:requestId/accept', FriendRequestController.acceptFriendRequest);

// PUT http://localhost:3001/api/friend-requests/:requestId/reject
router.put('/:requestId/reject', FriendRequestController.rejectFriendRequest);

module.exports = router