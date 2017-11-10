const express = require('express');
const app = express();
const compression = require('compression');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser')
const spicedPg = require('spiced-pg');
const cookieSession = require('cookie-session')
const db = spicedPg(process.env.DATABASE_URL || 'postgres:rauliglesias:Fourcade1@localhost:5432/socialnetwork');
const {getNextAction, getNextStatus} = require('./src/friendship-helper')
const session = require('express-session')
const csurf = require('csurf')
const { hashPassword, checkPassword } = require('./src/hasher')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
const toS3 = require('./toS3').toS3;


var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 6000000
    }
});


app.use(compression());

app.use('/public', express.static(`${__dirname}/public`))
app.use(cookieSession({
    secret: 'a really hard to guess secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
// app.use(csurf())
//


if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

let onlineUsers = []

app.post('/connect/:socketId', (req, res) => {
    console.log('in post query user connect');
    const socketIdAlreadyConnected = onlineUsers.find( user => user.socketId == socketId)
    const userIdAlreadyConnected = onlineUsers.find( user => user.userId == userId)

    if(!socketIdAlreadyConnected && io.sockets.sockets[socketId]) {
        onlineUsers.push({
            userId: req.session.user.id,
            socketId: req.params.socketId
        })
    }
    const qFindAllUsersById = `
        SELECT id, firstname AS firstName, lastname AS lastName, email, bio, picture-name AS pictureName
        FROM users
        WHERE id = ANY($1)`

    const arrayOfUserIds = onlineUsers.map( user => user.id )
    console.log(arrayOfUserIds);

    db.query(qFindAllUsersById, [arrayOfUserIds])
    .then((onlineUsers) => {
        console.log('online users after query are: ', onlineUsers);
            io.socket.emit('onlineUsers', onlineUsers)
            res.json({
                success: true
            })
    }).catch(err => console.log("THERE WAS AN ERROR IN /get all users by id",err));
})


app.get('/get-friendship-requests', (req, res) => {
    console.log('inside get friendships requests');
    const loggedInUserId = req.session.user.id

    const qGetFriendshipRequests =`
        SELECT users.id, firstname, lastname, picture_name, status
        FROM friendships
        JOIN users
        ON (status = $1 AND recipient_id = $3 AND sender_id = users.id)
        OR (status = $2 AND recipient_id = $3 AND sender_id = users.id)
        OR (status = $2 AND sender_id = $3 AND recipient_id = users.id)`

    const params = ['pending', 'accepted', loggedInUserId]

    db.query(qGetFriendshipRequests, params)
    .then((results) => {
        if(results.rowCount < 1) {
            console.log('user has no friendship requests');
            res.json({
                success: false
            })
        }
        else {
            console.log('user has friends');
            console.log(results.rows);
            queryResults = results.rows
            res.json({
                success: true,
                friendships: queryResults
            })
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /get friendship requests",err));
})



app.post('/accept-friendship/:id', (req, res) => {

    const friendId = req.params.id
    const userId = req.session.user.id
    const status = 'accepted'

    const qAcceptFriendship = `
        UPDATE friendships
        SET status = $1
        WHERE sender_id = $2
        AND recipient_id = $3`

    const params = [status, friendId, userId]

    db.query(qAcceptFriendship, params)
    .then((results) => {
        const queryResults = results.rows[0]
        res.json({
            success: true
        })
    }).catch(err => console.log("THERE WAS AN ERROR IN /post accept friendship", err));
})



app.post('/end-friendship/:id', (req, res) => {

    const friendId = req.params.id
    const userId = req.session.user.id
    const status = 'terminated'

    const qEndFriendship = `
        UPDATE friendships
        SET status = $1
        WHERE sender_id = $2 AND recipient_id = $3
        OR recipient_id = $2 AND sender_id = $3`

    const params = [status, friendId, userId]

    db.query(qEndFriendship, params)
    .then((results) => {
        const queryResults = results.rows[0]
        res.json({
            success: true
        })
    }).catch(err => console.log("THERE WAS AN ERROR IN /post end friendship", err));
})



app.get('/get-user/:id', (req, res) => {
    const otherUserId = [req.params.id];
    const qGetOtherUserInfo = `SELECT * FROM users WHERE id = $1`;
    db.query(qGetOtherUserInfo, otherUserId)
    .then((results) => {
        res.json({
            success: true,
            otherUser: results.rows[0]
        })
    })
})

app.get('/get-current-friendship/:id', (req, res) => {

    let otherUserId = req.params.id

    console.log('ENTERING GET CURRENT FRIENDSHIP QUERY');

    //the query qGetCurrentFriendship gets the information on the friendship table which matches either the logged-in user or the other user

    const qGetCurrentFriendship = `
        SELECT *
        FROM friendships
        WHERE sender_id = $1 AND recipient_id = $2
        OR sender_id = $2 AND recipient_id = $1`

    const params = [req.session.user.id, otherUserId]
    db.query(qGetCurrentFriendship, params)
    .then((results) => {
        console.log(results);
        if (results.rowCount < 1) {
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
            //we select the last row, which is the last row created in the table and is the current state of the friendship
            let currentFriendship = results.rows[results.rows.length-1];
            req.session.friendship = {
                id: currentFriendship.id,
                status: currentFriendship.status,
                senderId: currentFriendship.sender_id
            }

            //we identify if the logged-in user is the sender of the last friendship action triggered by the button. This is important in case the logged-in user sent a new friendship request, in which case the next action possible will be to cancel the request.

            let userIsSender

            if(req.session.user.id === req.session.friendship.senderId) {
                userIsSender = true
            }
            else {
                userIsSender = false
            }

            let currentStatus = req.session.friendship.status;

            //we find out what should be the next action that the friendship button will trigger, according to the current state of friendship and whether the logged-in user is the sender of the last action.

            let nextAction = getNextAction(userIsSender, currentStatus)
            console.log(nextAction);
            req.session.friendship.nextAction = nextAction
            console.log('**** new nextAction after load query is: ', nextAction, ' this is based on current db status, which is: ', req.session.friendship.status);
            //we send the next action to the front, it will be displayed as html content of the button.

            res.json({
                success: true,
                nextAction
            })
        }
    }).catch(err => console.log("THERE WAS AN ERROR IN /get friendship",err));
})

app.post('/update-friendship/:id/', (req, res) => {
    console.log('ENTERING POST UPDATE FRIENDSHIP QUERY');

    let otherUser = req.params.id;

    //currentNextAction is the action triggered by the friendship button. it matches the html content of the button.

    let currentNextAction = req.session.friendship.nextAction
    console.log('*** "Current Next Action" in the update query prior to visiting the db is: -', currentNextAction, '-');

    //generate the status which will be entered in db, according to the action triggered by the friendship button

    let nextStatus = getNextStatus(currentNextAction)
    console.log('*** newly generated Next Status before visting the db, which is going to be used to update the db, is: -', nextStatus, '-, if the Current Next Action is -Accept Request- the Next Status should be: -accepted-');
    //if the action which the button has triggered is 'Request Friendship' (currently no active friendship in db) the next action will create new db row.

    if(currentNextAction === 'Request Friendship') {
        console.log('*** in Request Friendship query');

        //the query qCreateNewFriendship creates a new row in the table, starts a new friendship.

        const qCreateNewFriendship = `
            INSERT INTO friendships (sender_id, recipient_id, status)
            VALUES ($1, $2, $3)`

        const params = [req.session.user.id, otherUser, nextStatus]

        db.query(qCreateNewFriendship, params)
        .then((results) => {
            let queryResults = results.rows[0]

            //nextStatus (prior to the query, becomes the currentStatus)

            let currentStatus = nextStatus

            req.session.friendship.status = currentStatus

            //the logged-in user sent the new friendship request, therefore the logged-in user is the sender.

            let userIsSender = true;

            //we find out which action will the friendship button trigger next time, according to the current status. The next action becomes the html value of the friendship button.

            let nextAction = getNextAction(userIsSender, currentStatus)
            req.session.friendship.nextAction = nextAction
            res.json({
                success: true,
                nextAction
            })
        })

    } else {

        //if the next action is not 'Request Friendship' (there is currently already an active friendship) the action triggered by the friendship button will update the db, instead of creating a new row.

        const qUpdateFriendship = `
            UPDATE friendships
            SET status = $1
            WHERE id = $2`

        const params = [nextStatus, req.session.friendship.id]

        console.log('*** the Params which are going to be used to update the db on the friendship update query are, "nextStatus": -', nextStatus, '-, and "friendshipId": -', req.session.friendship.id, '-');

        db.query(qUpdateFriendship, params)
        .then((results) => {
            let queryResults = results.rows[0]
            console.log('*** the Results of the friendship update query are: ', queryResults);
            //After updating the db, the next status becomes the current status.

            let currentStatus = nextStatus

            console.log('*** After updating the db, the Next Status: -', nextStatus, '- becomes the current status: -', currentStatus, '-');

            req.session.friendship.status = currentStatus

            console.log('*** "req.session.friendship.status" has been updated with "currentStatus" and its value now is: -', req.session.friendship.status, '-');

            console.log('*** old action "currentNextAction" after the update query is: -', currentNextAction, '-, we are going to generate a new "nextAction" one soon.');


            //we identify if the logged-in user is the sender of the last friendship action triggered by the button. This is important in case the logged-in user sent a new friendship request, in which case the next action possible will be to cancel the request.

            let userIsSender

            if(req.session.user.id === req.session.friendship.senderId) {
                userIsSender = true
            }
            else {
                userIsSender = false
            }

            console.log('*** after update query "userIsSender" is: -', userIsSender, '-');

            //we find out which will be the next action the logged-in user can trigger with the friendship button.

            console.log('*** we are going to generate a new "nextAction" using two parameters. "userIsSender" with a value of: -', userIsSender, '-, and "currentStatus" with a value of: -', currentStatus, '-');

            let nextAction = getNextAction(userIsSender, currentStatus)
            req.session.friendship.nextAction = nextAction
            console.log('*** the newly generated "nextAction" after performing update query, which will be sent to front is: -', nextAction,'-');

            //the next action we just generated will become the html value of the friendship button.

            res.json({
                success: true,
                nextAction
            })
        })
    }
})

app.post('/reject-friendship-request/:id', (req, res) => {

    console.log('ENTERING REJECT REQUEST QUERY');
    let otherUser = req.params.id
    console.log('otherUser is: ', otherUser);
    let newStatus = 'rejected';
    let friendshipId = req.session.friendship.id
    console.log('*** "friendship Id" in rejection query is:', friendshipId);

    const qRejectFriendshipRequest = `
        UPDATE friendships
        SET status = $1
        WHERE id = $2`

    const params = [newStatus, friendshipId]

    db.query(qRejectFriendshipRequest, params)
    .then((results) => {
        let queryResults = results.rows[0]
        console.log('*** results of the rejection query after visiting the db are: ', queryResults);

        let userIsSender = false;
        let currentStatus = newStatus

        let nextAction = getNextAction(userIsSender, currentStatus)
        console.log('*** new "nextAction" generated after rejection query is: ', nextAction);

        res.json({
            success: true,
            nextAction
        })
    })
})

app.get('/welcome', function(req, res){
    if (req.session.user) {
        res.redirect('/')
    }
    else {
        res.sendFile(__dirname + '/index.html');

    }
});

app.post('/newuser', (req, res) => {
    if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        console.log('missing fields');
        res.json({success: false})
    } else {
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let email = req.body.email;

        hashPassword(req.body.password).then((hash) => {
            let password = hash;
            req.session.user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash
            }
            const qRegisterUser = `
                INSERT INTO users (firstname, lastname, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id`

            const params = [firstName, lastName, email, password]
            db.query(qRegisterUser, params).then(() => {
                res.json({
                    success: true
                })
            }).catch(err => console.log("THERE WAS AN ERROR IN /postquery newuser",err));
        })
    }
})

app.post('/attemptlogin', (req, res) => {
    if(!req.body.email || !req.body.password) {
        console.log('fields missing!');
        res.json({success: false})
    }
    else {
        var email = req.body.email;
        var plainPassword = req.body.password;

        const qUserLogin = `SELECT * FROM users WHERE email = $1`
        const params = [email]

        db.query(qUserLogin, params).then((results) => {
            if(results.rowCount < 1) {
                console.log('wrong login data');
                res.json({success: false})
            } else {
                const userData = results.rows[0]
                const hashedPasswordFromDatabase = userData.password
                checkPassword(plainPassword, hashedPasswordFromDatabase).then(() => {
                    req.session.user = {
                        id: userData.id,
                        firstName: userData.firstname,
                        lastName: userData.lastname,
                        email: userData.email
                    }
                    res.json({
                        success: true
                    })
                }).catch(err => console.log("THERE WAS AN ERROR IN /attemptlogin newuser",err));
            }
        })
    }
})

app.get('/getProfilePicture', (req, res) => {
    const qGetProfilePicture = `
        SELECT picture_name
        FROM users
        WHERE id = $1`;

    const userId = req.session.user.id;

    db.query(qGetProfilePicture, [userId]).then((results) => {
        if(results.rowCount == 0) {
            console.log('user has no profile picture');
            console.log(req.session.user);
            res.json({success: false})
        } else {
            req.session.user.pictureName = results.rows[0].picture_name
            res.json({
                success: true,
                pictureName: req.session.user.pictureName
            })
    }
    }).catch(err => console.log("THERE WAS AN ERROR IN /getProfilePicture",err));
})

app.post('/uploadPicture', uploader.single('file'), (req, res) => {
    console.log('This is req.file', req.file);
    if(req.file) {
        toS3(req.file)
        .then(() => {
            const qInsertPictureName = `
                UPDATE users
                SET picture_name = $1
                WHERE id = $2
                RETURNING picture_name`;

            const params = [req.file.filename, req.session.user.id]

            return db.query(qInsertPictureName, params)
            .then((results) => {
                console.log('success in queryUploadPicture');
                res.json({
                    success: true,
                    pictureName: results.rows[0].picture_name
                })
            })
        }).catch(err => res.json({success: false}));
    } else {
        res.json({success: false})
    }
})

app.post('/updateUserBio', (req, res) => {
    console.log('this is req.body on update user bio query: ', req.body);
    const qInsertUserBio = `
        UPDATE users
        SET bio = $1
        WHERE id = $2`;

    const params = [req.body.bio, req.session.user.id]
    db.query(qInsertUserBio, params)
    .then((results) => {
        req.session.user.bio = req.body.bio
        console.log(req.session.user.bio);
        res.json({
            success: true
        })
    }).catch(err => res.json({success: false}));
})

app.get('/getUserBio', (req, res) => {
    if(req.session.user.bio) {
        res.json({
            success: true,
            bio: req.session.user.bio
        })
    } else {
        const qGetUserBio = `SELECT bio FROM users WHERE id = $1`;
        const params = [req.session.user.id]
        db.query(qGetUserBio, params)
        .then((results) => {
            if(results.rowCount < 1) {
                console.log('user has no bio');
                res.json({success: false})
            } else {
                res.json({
                    success: true,
                    bio: results.rows[0].bio
                })
            }
        })
    }
})

app.get('/getUser', (req, res) => {
    res.send({
        success: true,
        user: req.session.user
    })
})



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
//
// io.on('connection', function(socket) {
//     console.log(`socket with the id ${socket.id} is now connected`);
//
//     socket.on('disconnect', function() {
//    var user = onlineUsers.find(function(user) {
//         return user.socketId == socket.id
//})
//      onlineUsers= onlineUsers.filter(function(u){
//        return u == user
//})

//      var stillOnline = onlineUsers.find(funciton(u) {
// return u.userId == user.userId
// })
//
// if(!stillOnline) {
//     id: user.
// }

//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });
//     socket.on('thanks', function(data) {
//         console.log(data);
//     });
//     io.sockets.emit('achtung', {
//     warning: 'This site will go offline for maintenance in one hour.'
// });
//     socket.emit('welcome', {
//        message: 'Welome. It is nice to see you'
//    });
// });
