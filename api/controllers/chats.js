const db = require('../db');
const {FieldValue,Timestamp} = require('firebase-admin/firestore')
const firestone = db.firestore();
const uuid = require('uuid')

module.exports = {
    addNewChat: async (req,res) => {
        const {userToChatId, currentUserId, firstNameUserToChat, lastNameUserToChat, firstNameCurrentUser, lastNameCurrentUser} = req.body
        console.log(req.body)

        const combineId =
            currentUserId > userToChatId
                ? currentUserId + userToChatId
                : userToChatId + currentUserId;

        try {
            const chatRef = await firestone.collection('chats').doc(combineId).get();
            if(!chatRef.exists) {
                //Creazione collezione in chats
                await firestone.collection('chats').doc(combineId).set({
                    messages: []
                })
                //Creazione userchat
                await firestone.collection('usersChats').doc(currentUserId).update({
                    [combineId+".userInfo"]: {
                        uid: userToChatId,
                        displayName: firstNameUserToChat + " " + lastNameUserToChat,
                    },
                    [combineId+".date"]: FieldValue.serverTimestamp(),

                });
                await firestone.collection('usersChats').doc(userToChatId).update({
                    [combineId+".userInfo"]: {
                        uid: currentUserId,
                        displayName: firstNameCurrentUser + " " + lastNameCurrentUser,
                    },
                    [combineId+".date"]: FieldValue.serverTimestamp(),
                });
                return res.send(`Chats created!`)
             }
            return res.send("Chat already exists");
        }catch (err) {
            res.status(400).send(err.message)
        }
    },
    refresh: (req,res) => {
        const currentUserId = req.params.currentUserId;

        firestone.collection('usersChats').doc(currentUserId).get()
            .then((doc) => {
            if(doc.exists){
                const itemData = doc.data();
                return res.json(itemData);
            } else {
                return res.status(400).send("Elemento non trovato");
            }
        })
            .catch((error) => {
                console.log('Errore durante la ricerca dell\'elemento:', error);
                res.status(500).send('Si è verificato un errore durante la ricerca dell\'elemento');
            })



    },

    refreshChatMessages: (req,res) => {
        firestone.collection('chats').doc(req.params.chatId)
            .get()
            .then((doc) => {
                if(doc.exists){
                    const itemData = doc.data();
                    res.json(itemData);
                } else {
                    res.status(400).send("Elemento non trovato");
                }
            })
            .catch((error) => {
                console.error('Errore durante la ricerca dell\'elemento:', error);
                res.status(500).send('Si è verificato un errore durante la ricerca dell\'elemento');
            })

    },

    addNewEmptyUserChats:  (req, res) => {
        const userId = req.body.userId;
        const chatRef = firestone.collection('usersChats').doc(userId);
        chatRef.get()
            .then((chatSnapshot) => {
                if(chatSnapshot.exists) {
                    return res.send('User chat already created');
                } else {
                    chatRef.set({})
                        .then(() => {
                            return res.send('New user chat created!');
                        })
                        .catch((err) => {
                            return res.send(err)
                        });
                }
            })
            .catch((err) => {
                return res.status(404).send("Errore di comunicazione con il api")
            });





    },


    updateMessageInChat: (req,res) => {
        const {chatId,text,userToChatId,currentUserId} = req.body;

        //update in "chats"
        firestone.collection('chats').doc(chatId)
            .update({
                messages: FieldValue.arrayUnion({
                    id: uuid.v4(),
                    text,
                    senderId: currentUserId,
                    date: Timestamp.now(),
                }),
            })
            .then((r) => {
                console.log("Messaggio aggiunto all'array dei messaggi", r)
                //update in usersChats document with id: currentUserId
                firestone.collection('usersChats').doc(currentUserId)
                    .update({
                        [chatId + ".lastMessage"]: { text },
                        [chatId + ".date"]: FieldValue.serverTimestamp(),
                    })
                    .then((r) => {
                        console.log("Campi aggiornati nella collezione usersChats per receiver", r)
                        //update in usersChats document with id: userToChatId
                        firestone.collection('usersChats').doc(userToChatId)
                            .update({
                                [chatId + ".lastMessage"]: { text },
                                [chatId + ".date"]: FieldValue.serverTimestamp(),
                            })
                            .then((r) => {
                                console.log("Campi aggiornati nella collezione usersChats per sender", r)
                                res.send("users Chats and messages updated sucessfully")
                            })
                            .catch((err) => {
                                res.status().send("(sender) Errore nella comunicazione col api",err);
                            })
                    })
                    .catch((err) => {
                        res.status(500).send("(receiver) Errore nella comunicazione col api",err);
                    })

            })
            .catch((err) => {
                res.status(500).send("(addMessage) Errore nella comunicazione col api" + err);
            })







    }




}