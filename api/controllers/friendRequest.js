const db = require('../db');
const friendRequest = require('../models/friendRequest')
const firestone = db.firestore();

module.exports = {
    sendFriendRequest: async (req,res) => {
        const timestamp = Date.now();
        const data = req.body

        // Verifica se esiste già una richiesta d'amicizia con stesso fromUser e stesso toUser
        const snapshot1 = await firestone.collection('friendRequests')
            .where('fromUserId', '==', data.fromUserId)
            .where('toUserId', '==', data.toUserId)
            .where('status', 'in', ['accepted', 'pending'])
            .get();
        if (!snapshot1.empty) {
            return res.send("Friend request already sent");
        }
        const snapshot2 = await firestone.collection('friendRequests')
            .where('toUserId', '==', data.fromUserId)
            .where('fromUserId', '==', data.toUserId)
            .where('status', 'in', ['accepted', 'pending'])
            .get();
        if (!snapshot2.empty) {
            return res.send("Friend request already sent");
        }

        // Creazione nuova richiesta
        const friendRequest = {
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            status: 'pending',
            timestamp,
        };
        await firestone.collection('friendRequests').doc('from'+data.fromUserId+'to'+data.toUserId).set(friendRequest);
        console.log(friendRequest)
        return res.send('Friend request sent successfully');
    },

    getReceivedFriendRequests: async (req,res) => {
        const snapshot = await firestone.collection('friendRequests')
            .where('toUserId', '==', req.params.uid)
            .where('status', 'in', ['accepted', 'pending'])
            .get();
        console.log(snapshot);
        const friendRequests = [];
        snapshot.forEach((doc) => {
            const friendRequest = doc.data();
            friendRequest.id = doc.id;
            friendRequests.push(friendRequest);
        });
        return res.json(friendRequests);
    },

    getSentFriendRequests: async (req,res) => {
        const snapshot = await firestone.collection('friendRequests')
            .where('fromUserId', '==', req.params.uid)
            .where('status', 'in', ['accepted', 'pending'])
            .get();
        console.log(snapshot);
        const friendRequests = [];
        snapshot.forEach((doc) => {
            const friendRequest = doc.data();
            friendRequest.id = doc.id;
            friendRequests.push(friendRequest);
        });
        return res.json(friendRequests);
    },

    getFriendRequestById: async (req, res) => {

        const requestId = 'from'+req.params.fromUserId+'to'+req.params.toUserId;
        const query = firestone.collection('friendRequests')
            .where("fromUserId",'==', req.params.fromUserId)
            .where("toUserId",'==', req.params.toUserId);

        const requests = [];
        try {
            const snapshot = await query.get();

            if (snapshot.empty) {
                res.status(404).send("Nessuna richiesta trovata")
                return;
            }
            snapshot.forEach((doc) => {
                const request = doc.data();
                request.id = doc.id;
                requests.push(request)
            })
            res.json(requests[0])
        } catch (err) {
            res.status(400).send(err)
        }
    },

    acceptFriendRequest: async (req,res) => {
        const friendRequestRef = firestone.collection('friendRequests').doc(req.params.requestId);
        const friendRequest = await friendRequestRef.get();

        // Se l'amicizia non è già stata accettata, allora la accetta
        if (friendRequest.exists && friendRequest.data().status === 'pending') {
            await friendRequestRef.update({ status: 'accepted' });
            return res.send('Friend request accepted successfully');
        }
        return res.send('This friend request does not exist');
    },

    rejectFriendRequest: async (req,res) => {
        const friendRequestRef = firestone.collection('friendRequests').doc(req.params.requestId);
        const friendRequest = await friendRequestRef.get();

        // Se l'amicizia non è già stata rifuitata, allora la rifiuta
        if (friendRequest.exists && friendRequest.data().status === 'pending') {
            await friendRequestRef.update({ status: 'rejected' });
            return res.send('Friend request rejected successfully');
        }
        return res.send('This friend request does not exist');
    },
};