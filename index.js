const express = require('express');
const app = express();
const compression = require('compression');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const db = require('./modules/db-queries');
const spicedPg = require('spiced-pg');
const cookieSession = require('cookie-session');
const {getNextAction, getNextStatus} = require('./src/friendships/friendship-helper');
const session = require('express-session');
const csurf = require('csurf');
const { hashPassword, checkPassword } = require('./modules/hasher');
const toS3 = require('./modules/toS3').toS3;
const multer = require('multer')
const path = require('path')
const uidSafe = require('uid-safe')


// -------------------------- MIDDLEWARE ------------------------------------ //

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


//COMPRESSION
app.use(compression());

//EXPRESS STATIC
app.use('/public', express.static(`${__dirname}/public`))
app.use('/node_modules/font-awesome', express.static(`${__dirname}/node_modules/font-awesome`))

//COOKIE SESSION
app.use(cookieSession({
    secret: 'a really hard to guess secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

//BODY PARSER
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//BUNDLER
if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

// ---------------------------- ROUTES -------------------------------------- //

app.get('/get-friendship-requests', (req, res) => {

    const loggedInUserId = req.session.user.id

    db.getFriendshipRequests(loggedInUserId)

        .then(friendshipRequests => {
            console.log('friendshipRequests: ', friendshipRequests);
            if(friendshipRequests.length < 1) {
                res.json({
                    success: false
                })
            }

            else {
                res.json({
                    success: true,
                    friendships: friendshipRequests
                })
            }
        }).catch(err => console.log('error on INDEX // GET FRIENDSHIP REQUESTS: ', err));
})


app.post('/accept-friendship/:id', (req, res) => {

    const friendId = req.params.id
    const userId = req.session.user.id

    db.acceptFriendship(friendId, userId)

        .then(results => {
            if(results.success) {

                res.json({
                    success: true
                })
            }
        }).catch(err => console.log('error on // INDEX // POST ACCEPT FRIENDSHIP: ', err));
})


app.post('/end-friendship/:id', (req, res) => {

    const friendId = req.params.id
    const userId = req.session.user.id

    db.endFriendship(friendId, userId)

        .then(results => {
            if(results.success) {

                res.json({
                    success: true
                })
            }
        }).catch(err => console.log('error on // INDEX // POST END FRIENDSHIP: ', err));
})



app.get('/get-user/:id', (req, res) => {
    const otherUserId = [req.params.id];

    db.getUser(otherUserId)

        .then(results => {

            res.json({
                success: true,
                otherUser: results.otherUser
            })

        }).catch(err => console.log('error on // INDEX // GET USER: ', err));
})


app.get('/get-current-friendship/:id', (req, res) => {

    let otherUserId = req.params.id
    let userId = req.session.user.id

        db.getCurrentFriendship(userId, otherUserId)

            .then(results => {

                if (!results.success) {
                    req.session.friendship = {}
                    let userIsSender = true;
                    let currentStatus = 'no status'

                    let nextAction = getNextAction(userIsSender, currentStatus)

                    req.session.friendship.nextAction = nextAction

                    res.json({
                        success: true,
                        nextAction
                    })
                }

                else {
                    /*we select the last row, which is the last row created
                    in the table and is the current state of the friendship*/
                    console.log('results.friendships: ', results.friendships[results.friendships.length-1]);
                    let currentFriendship = results.friendships[results.friendships.length-1];
                    req.session.friendship = {
                        id: currentFriendship.id,
                        status: currentFriendship.status,
                        senderId: currentFriendship.sender_id
                    }

                    /*we identify if the logged-in user is the sender of the
                    last friendship action triggered by the button. This is
                    important in case the logged-in user sent a new friendship
                    request, in which case the next action possible will be
                    to cancel the request.*/

                    let userIsSender

                    if(req.session.user.id === req.session.friendship.senderId) {
                        userIsSender = true
                    }
                    else {
                        userIsSender = false
                    }

                    let currentStatus = req.session.friendship.status;

                    /*we find out what should be the next action that the
                    friendship button will trigger, according to the current
                    state of friendship and whether the logged-in user is the
                    sender of the last action or not.*/

                    let nextAction = getNextAction(userIsSender, currentStatus)

                    req.session.friendship.nextAction = nextAction
                    /*we send the next action to the front, it will be
                    displayed as HTML content of the button.*/

                    res.json({
                        success: true,
                        nextAction
                    })
                }
            })

            .catch(err => console.log('error on // INDEX // GET CURRENT FRIENDSHIP: ', err));
})


app.post('/update-friendship/:id/', (req, res) => {

    let otherUserId = req.params.id;

    /*currentNextAction is the action triggered by the friendship button. It
    matches the HTML content of the button.*/

    let currentNextAction = req.session.friendship.nextAction

    /*generate the status which will be entered in db, according to the action
    triggered by the friendship button*/

    let nextStatus = getNextStatus(currentNextAction)
    /*if the action which the button has triggered is 'Request Friendship'
    (currently no active friendship in db) the next action will create new db
    row.*/

    if(currentNextAction === 'Request Friendship') {
        /*the query qCreateNewFriendship creates a new row in the table, starts
        a new friendship.*/

        db.createNewFriendship(req.session.user.id, otherUserId, nextStatus)

            .then( () => {
                //nextStatus (prior to the query, becomes the currentStatus)
                let currentStatus = nextStatus

                req.session.friendship.status = currentStatus

                /*the logged-in user sent the new friendship request,
                therefore the logged-in user is the sender.*/
                let userIsSender = true;

                /*we find out which action will the friendship button trigger
                next time, according to the current status. The next action
                becomes the html value of the friendship button.*/
                let nextAction = getNextAction(userIsSender, currentStatus)
                req.session.friendship.nextAction = nextAction
                res.json({
                    success: true,
                    nextAction
                })
            })
            .catch(err => console.log('error on // INDEX // CREATE NEW FRIENDSHIP: ', err));

    } else {

        /*if the next action is not 'Request Friendship' (there is currently
        already an active friendship) the action triggered by the friendship
        button will update the db, instead of creating a new row.*/
        const friendshipId = req.session.friendship.id

        db.updateFriendship(nextStatus, friendshipId)
            .then(() => {
                //After updating the db, the next status becomes the current status.

                let currentStatus = nextStatus

                req.session.friendship.status = currentStatus
                /*we identify if the logged-in user is the sender of the last
                friendship action triggered by the button. This is important in
                case the logged-in user sent a new friendship request, in which
                case the next action possible will be to cancel the request.*/

                let userIsSender

                if(req.session.user.id === req.session.friendship.senderId) {
                    userIsSender = true
                }
                else {
                    userIsSender = false
                }

                /*we find out which will be the next action the logged-in user
                can trigger with the friendship button.*/
                let nextAction = getNextAction(userIsSender, currentStatus)

                req.session.friendship.nextAction = nextAction
                /*the next action we just generated will become the HTML value
                of the friendship button.*/

                res.json({
                    success: true,
                    nextAction
                })
            })

            .catch(err => console.log('error on // INDEX // UPDATE FRIENDSHIP: ', err));
    }
})

app.post('/reject-friendship-request/:id', (req, res) => {

    let otherUser = req.params.id
    let friendshipId = req.session.friendship.id

    db.rejectFriendshipRequest(friendshipId)
        .then(() => {

            let userIsSender = false;
            let currentStatus = newStatus
            let nextAction = getNextAction(userIsSender, currentStatus)

            res.json({
                success: true,
                nextAction
            })
        })

        .catch(err => console.log('error on // INDEX // REJECT FRIENDSHIP: ', err));
})


app.get('/welcome', function(req, res){
    if (req.session.user) {
        res.redirect('/')
    }
    else {
        res.sendFile(__dirname + '/index.html');

    }
});

app.post('/new-user', (req, res) => {

    if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {

        res.json({ success: false })

    }

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;

    hashPassword(req.body.password)

    .then((hash) => {

        let password = hash;

        req.session.user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hash
        }

        db.registerUser(firstname, lastname, email, password)

            .then(results => {
                req.session.user.id = results.id

                res.json({ success: true })
            })

            .catch(err => console.log('error on // INDEX // POST REGISTER USER: ' ,err));
    })
    .catch(err => console.log('error on // INDEX // HASH PASSWORD: ' ,err));
})

app.post('/attempt-login', (req, res) => {

    if(!req.body.email || !req.body.password) {
        res.json({success: false})
    }

    const email = req.body.email;
    const plainPassword = req.body.password;

    db.userLogin(email)

        .then(results => {
            if(!results.success) {
                res.json({ success: false })
            }

            const userData = results.userData

            const hashedPasswordFromDatabase = userData.password

            checkPassword(plainPassword, hashedPasswordFromDatabase)

            .then(() => {
                req.session.user = {
                    id: userData.id,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email
                }

                res.json({ success: true })

            })

            .catch(err => console.log('error on // INDEX // POST USER LOGIN: ' ,err));
        })
})

app.get('/get-profile-picture', (req, res) => {

    const userId = req.session.user.id;

    db.getProfilePicture(userId)

        .then(results => {
            if(!results.success) {
                res.json({success: false})
            }

            req.session.user.picturename = results.picturename
            res.json({
                success: true,
                picturename: req.session.user.picturename
            })

        })

        .catch(err => console.log('error on // INDEX // GET PROFILE PICTURE: ',err));
})


app.post('/upload-picture', uploader.single('file'), (req, res) => {

    if(req.file) {
        toS3(req.file)

        .then(() => {

            const fileName = req.file.filename

            const userId = req.session.user.id

            db.insertPictureName(fileName, userId)

                .then(results => {
                    if(!results.success) {
                        res.json({ success: false })
                    }

                    res.json({
                        success: true,
                        picturename: results.picturename
                    })
                })
                .catch(err => console.log('error on // INDEX // INSERT PICTURE NAME: ',err));
        })
        .catch(err => console.log('error on // INDEX // TO S3: ',err));
    }

    else {
        res.json({success: false})
    }
})

app.post('/update-user-bio', (req, res) => {

    const userBio = req.body.bio
    const userId = req.session.user.id

    db.insertUserBio(userBio, userId)

        .then(() => {
            req.session.user.bio = req.body.bio

            res.json({ success: true })
        })

        .catch(err => console.log('error on // INDEX // POST UPDATE USER BIO: ',err));
})

app.get('/get-user-bio', (req, res) => {

    if(req.session.user.bio) {

        res.json({
            success: true,
            bio: req.session.user.bio
        })
    }

    else {
        const userId = req.session.user.id

        db.getUserBio(userId)

            .then((results) => {

                if(!results.success) {
                    res.json({success: false})
                }

                res.json({
                    success: true,
                    bio: results.bio
                })
            })

            .catch(err => console.log('error on // INDEX // GET USER BIO: ',err));

    }
})


app.get('/get-user', (req, res) => {

    const email = req.session.user.email

    db.getFullUserInfo(email)

        .then(results => {

            if(!results.success) {
                res.json({ success: false })
            }

            const userInfo = results.userInfo
            req.session.user = {
                id: userInfo.id,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.email,
                picturename: userInfo.picture_name,
                bio: userInfo.bio && userInfo.bio
            }

            res.json({
                success: true,
                user: req.session.user
            })
        })

        .catch(err => console.log('error on // INDEX // GET USER: ',err));
})


//SOCKET IO

let arrayOfOnlineUsers = []

app.get('/connect/:socketId', (req, res) => {

    const userId = req.session.user.id;
    const socketId = req.params.socketId

    const userIdAlreadyConnected = arrayOfOnlineUsers.find( user => user.userId == userId)

    if(!userIdAlreadyConnected) {
        arrayOfOnlineUsers.push({
            userId,
            socketId
        })

        let newUser = req.session.user

        io.sockets.emit('userJoined', newUser)

        db.getLastMessages()

            .then(results => {

                const lastMessages = results.lastMessages

                lastMessages.sort(function(a,b) {
                    return new Date(a.created_at) - new Date(b.created_at)
                })

                io.sockets.sockets[socketId].emit('chatMessages', lastMessages)
            })

            .catch(err => console.log('error on // INDEX // GET LAST MESSAGES: ', err))
    }

    const arrayOfUserIds = arrayOfOnlineUsers.map( user => user.userId )

    db.getAllOnlineUsersById(arrayOfUserIds)

        .then(results => {
            if(!results.success) {
                res.json({ success: false })
            }

            const onlineUsers = results.onlineUsers

            io.sockets.sockets[socketId].emit('onlineUsers', onlineUsers)

            res.json({
                success: true,
                user: req.session.user
            })
        })

        .catch(err => console.log('error on // INDEX // GET ALL ONLINE USERS BY ID: ',err));

    db.getAllUsersFromDb()

        .then(results => {
            if(!results.success) {
                res.json({ success: false })
            }

            const allUsers = results.allUsers
            io.sockets.sockets[socketId].emit('allUsers', allUsers)
        })

        .catch(err => console.log('error on // INDEX // GET ALL USERS FROM DB: ',err));
})

io.on('connection', (socket) => {

    socket.on('disconnect', () => {

        const disconnectedSocket = arrayOfOnlineUsers.find(user => user.socketId === socket.id);

        const userIndexInArray = arrayOfOnlineUsers.indexOf(disconnectedSocket);

        arrayOfOnlineUsers.splice(userIndexInArray, 1);

        var anotherConnection = () => {
            return arrayOfOnlineUsers.find((user) =>{
                return user.userId == disconnectedSocket.userId;
            })
        }

        if(!anotherConnection()) {
            io.sockets.emit('userLeft', { id: disconnectedSocket.userId });
        }
    })

    socket.on('new-chat-message', (newChatMessageObj) => {

        const messageSender = arrayOfOnlineUsers.find((user) => user.socketId == socket.id)

        db.postNewMessage(messageSender.userId, newChatMessageObj.newMessage)

            .then((results) => {
                if(!results.success) {
                    res.json({ success: false })
                }

                let createdAt = results.createdAt
                let message_id = results.messageId

                db.getSenderInfo(messageSender.userId)

                    .then(results => {
                        let senderInfo = results.senderInfo

                        newMessage = {
                            message_id: newChatMessageObj.sender_id,
                            message: newChatMessageObj.newMessage,
                            created_at: createdAt,
                            sender_id: messageSender.userId,
                            sender_firstname: senderInfo.firstname,
                            sender_lastname: senderInfo.lastname,
                            sender_picture: senderInfo.picture_name
                        }

                        io.sockets.emit('broadcast-new-message', newMessage);

                    })

                    .catch(err => console.log('error on // INDEX // GET SENDER INFO: ', err))

                })

                .catch(err => console.log('error on // INDEX // POST NEW MESSAGE: ', err))
    })
})


//FALLBACK ROUTE
app.get('*', function(req, res){
    if(!req.session.user) {
        res.redirect('/welcome')
    } else {
        res.sendFile(__dirname + '/index.html');

    }
});

server.listen(8080, function() {
    console.log("I'm listening.")
});
