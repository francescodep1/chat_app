
const db = require('../db');


const firestone = db.firestore();

module.exports = {

    addUser: async (req,res) => {
        try {
            const {firstName, lastName, email, uid} = req.body;


            //verifica se esiste già un account con questa email
            const emailRef = firestone.collection('users').where('email', '==',email);
            const emailSnapshot = await emailRef.get();
            if (!emailSnapshot.empty) return res.send('An account with this email already exists');

            //creazione nuovo utente
            await  firestone.collection('users').doc(uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                uid: uid
            })
            console.log(req.body)
            res.send('User registered successfully');
            console.log(`Task completed: addUser\n` )

        } catch (error) {
            res.status(400).send(error.message)
        }
    },


    getUserByFullName: async (req,res) => {

            const firstName = req.params.firstName;
            const lastName = req.params.lastName;
            const query = firestone.collection('users')
                .where("firstName",'==',firstName)
                .where("lastName",'==',lastName);

            const users = [];
            try {
                const snapshot = await query.get();

                if (snapshot.empty) {
                    res.status(404).send("Nessun utente trovato con il nome specificato")
                    return;
                }
                snapshot.forEach((doc) => {
                    const user = doc.data();
                    user.id = doc.id;
                    users.push(user)
                })
                res.json(users[0])
            } catch (err) {
                res.status(400).send(err)
            }

    },

    deleteUserByUsername: async (req,res) => {
        try{
            await firestone.collection('users').doc(req.params.username).delete()
            res.send(`The account of ${req.params.username} has been deleted successfully`)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}



