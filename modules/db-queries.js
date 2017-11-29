const spicedPg = require('spiced-pg');
const { postgresDb } = require('../config/secrets.json')
const db = spicedPg(process.env.DATABASE_URL || postgresDb);
const multer = require('multer')
const path = require('path')
const { toS3 } = require('./toS3');
const uidSafe = require('uid-safe')


// MULTER

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '../uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 6000000
    }
});


// ------------------------------- DB QUERIES ------------------------------- //

module.exports.getFriendshipRequests = (userId) => {

    const query = ` SELECT users.id, firstname, lastname, picture_name, status
                    FROM friendships
                    JOIN users
                    ON (status = $1 AND recipient_id = $3 AND sender_id = users.id)
                    OR (status = $2 AND recipient_id = $3 AND sender_id = users.id)
                    OR (status = $2 AND sender_id = $3 AND recipient_id = users.id)`

    const params = ['pending', 'accepted', userId]

    return db.query(query, params)
            .then(results => {
                    return results.rows

            })
            .catch(err => {
                console.log('error on // DB-QUERIES // QUERY GET FRIENDSHIP REQUESTS: ', err);
            })
}


module.exports.acceptFriendship = (friendId, userId) => {

    const status = 'accepted'

    const query = ` UPDATE friendships
                    SET status = $1
                    WHERE sender_id = $2
                    AND recipient_id = $3
                    RETURNING status`

    const params = [status, friendId, userId]

    return db.query(query, params)

            .then(results => {
                if(results.rows[0].status != status) {
                    return({success: false})
                }

                return({success: true})
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // QUERY ACCEPT FRIENDSHIP: ', err);
            })
}


module.exports.endFriendship = (friendId, userId) => {

    const status = 'terminated'

    const query = ` UPDATE friendships
                    SET status = $1
                    WHERE sender_id = $2 AND recipient_id = $3
                    OR recipient_id = $2 AND sender_id = $3
                    RETURNING status`

    const params = [status, friendId, userId]

    return db.query(query, params)

            .then(results => {
                if(results.rows[0].status != status) {
                    return({success: false})
                }

                return({success: true})
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // QUERY END FRIENDSHIP: ', err);
            })
}


module.exports.getUser = (otherUserId) => {

    const query = `SELECT * FROM users WHERE id = $1`

    const params = [otherUserId]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({success: false})
                }

                return({
                    success: true,
                    otherUser: results.rows[0]
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // QUERY GET USER: ', err);
            })
}


module.exports.getCurrentFriendship = (userId, otherUserId) => {

    /*the query getCurrentFriendship gets the information from the Friendships
    table, with matching #IDs either of the logged-in user or the other user*/
    const query = ` SELECT *
                    FROM friendships
                    WHERE sender_id = $1 AND recipient_id = $2
                    OR sender_id = $2 AND recipient_id = $1`

    const params = [userId, otherUserId]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({success: false})
                }

                return({
                    success: true,
                    friendships: results.rows
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET CURRENT FRIENDSHIP: ', err);
            })
}


module.exports.createNewFriendship = (userId, otherUserId, nextStatus) => {

    const query = ` INSERT INTO friendships
                    (sender_id, recipient_id, status)
                    VALUES ($1, $2, $3)`

    const params = [userId, otherUserId, nextStatus]

    return db.query(query, params)
            .then(() => {
                return({success: true})
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET CREATE NEW FRIENDSHIP: ', err);
            })
}

module.exports.updateFriendship = (nextStatus, friendshipId) => {

    const query = ` UPDATE friendships
                    SET status = $1
                    WHERE id = $2`

    const params = [nextStatus, friendshipId]

    return db.query(query, params)
            .then(() => {
                return({success: true})
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // UPDATE FRIENDSHIP: ', err);
            })
}


module.exports.rejectFriendshipRequest = (friendshipId) => {

    const query = ` UPDATE friendships
                    SET status = $1
                    WHERE id = $2`

    const newStatus = 'rejected'
    const params = [newStatus, friendshipId]

    return db.query(query, params)

            .then(() => {
                return({success: true})
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // REJECT FRIENDSHIP: ', err);
            })
}


module.exports.registerUser = (firstname, lastname, email, password) => {

    const query = ` INSERT INTO users
                    (firstname, lastname, email, password)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id`

    const params = [firstname, lastname, email, password]

    return db.query(query, params)

            .then(results => {
                return({
                    success: true,
                    userId: results.rows[0].id
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // REGISTER USER: ', err);
            })
}

module.exports.userLogin = (email) => {

    const query = `SELECT * FROM users WHERE email = $1`

    const params = [email]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({success: false})
                }

                return({
                    success: true,
                    userData: results.rows[0]
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // USER LOGIN: ', err);
            })
}

module.exports.getProfilePicture = (userId) => {

    const query = ` SELECT picture_name
                    FROM users
                    WHERE id = $1`

    const params = [userId]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false })
                }

                return({
                    success: true,
                    picturename: results.rows[0].picture_name
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET PROFILE PICTURE: ', err);
            })
}


module.exports.insertPictureName = (fileName, userId) => {

    const query = ` UPDATE users
                    SET picture_name = $1
                    WHERE id = $2
                    RETURNING picture_name`

    const params = [fileName, userId]

    return db.query(query, params)

            .then(results => {

                if(results.rowCount < 1) {
                    return({success: false})
                }

                return({
                    success: true,
                    picturename: results.rows[0].picture_name
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // INSERT PICTURE NAME: ', err);
            })
}


module.exports.insertUserBio = (userBio, userId) => {

    const query = ` UPDATE users
                    SET bio = $1
                    WHERE id = $2`

    const params = [userBio, userId]

    return db.query(query, params)

            .then(() => {
                return({ success: true })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // INSERT USER BIO: ', err);
            })
}


module.exports.getUserBio = (userId) => {

    const query = `SELECT bio FROM users WHERE id = $1`

    const params = [userId]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {

                    return({ success: false})
                }

                return({
                    success: true,
                    bio: results.rows[0].bio
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET USER BIO: ', err);
            })
}


module.exports.getFullUserInfo = (email) => {

    const query = ` SELECT *
                    FROM users
                    WHERE email = $1`

    const params = [email]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {

                    return({ success: false })
                }

                return({
                    success: true,
                    userInfo: results.rows[0]
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET FULL USER INFO: ', err);
            })
}


module.exports.getLastMessages = () => {

    const query = ` SELECT  chat.id AS message_id,
                            chat.message,
                            chat.created_at AS created_at,
                            users.id AS sender_id,
                            users.firstname AS sender_firstname,
                            users.lastname AS sender_lastname,
                            users.picture_name AS sender_picture
                    FROM chat
                    JOIN users
                    ON chat.sender_id = users.id
                    ORDER BY chat.created_at DESC
                    LIMIT 10`

    return db.query(query)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false })
                }

                return({
                    success: true,
                    lastMessages: results.rows
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET LAST MESSAGES: ', err);
            })
}


module.exports.getAllOnlineUsersById = (arrayOfUserIds) => {

    const query = ` SELECT  id,
                            firstname,
                            lastname,
                            email,
                            bio,
                            picture_name AS picturename
                    FROM users
                    WHERE id = ANY($1)`

    const params = [arrayOfUserIds]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false })
                }

                return({
                    success: true,
                    onlineUsers: results.rows
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET ALL ONLINE USERS BY ID: ', err);
            })
}


module.exports.getAllUsersFromDb = () => {

    const query = ` SELECT  id,
                            firstname,
                            lastname,
                            picture_name AS picturename
                    FROM users`

    return db.query(query)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false })

                }

                return({
                    success: true,
                    allUsers: results.rows
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET ALL USERS FROM DB: ', err);
            })
}


module.exports.postNewMessage = (senderId, newChatMessage) => {

    const query = ` INSERT INTO chat (sender_id, message)
                    VALUES ($1, $2)
                    RETURNING id, created_at`

    const params = [senderId, newChatMessage]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false})
                }

                return({
                    success: true,
                    messageId: results.rows[0].id,
                    createdAt: results.rows[0].created_at
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // POST NEW MESSAGE: ', err);
            })
}


module.exports.getSenderInfo = (userId) => {

    const query = ` SELECT firstname, lastname, picture_name
                    FROM users
                    WHERE id = $1`

    const params = [userId]

    return db.query(query, params)

            .then(results => {
                if(results.rowCount < 1) {
                    return({ success: false })
                }

                return({
                    success: true,
                    senderInfo: results.rows[0]
                })
            })

            .catch(err => {
                console.log('error on // DB-QUERIES // GET SENDER INFO: ', err);
            })
}
