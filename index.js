const express = require('express');
const app = express();
const compression = require('compression');
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

// const PENDING = 1
//     , ACCEPTED = 2
//     , REJECTED = 3
//     , CANCELLED = 4
//     , TERMINATED = 5;

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

    const qGetCurrentFriendship = `SELECT * FROM friendships WHERE sender_id = $1 AND recipient_id = $2 OR sender_id = $2 AND recipient_id = $1`
    const params = [req.session.user.id, otherUserId]
    db.query(qGetCurrentFriendship, params)
    .then((results) => {

        console.log(results.rows[results.rows.length-1]);
        let currentFriendship = results.rows[results.rows.length-1];

        req.session.friendship = {
            id: currentFriendship.id,
            status: currentFriendship.status
        }
        console.log(req.session.friendship)
        if(req.session.user.id === currentFriendship.sender_id) {
            req.session.user.isSender = true
        }
        else {
            req.session.user.isSender = false
        }

        console.log('isSender: ', req.session.user.isSender, 'friendship status: ', req.session.friendship.status);

        let userIsSender = req.session.user.isSender
        let currentStatus = req.session.friendship.status;

        req.session.friendship.nextAction = getNextAction(userIsSender, currentStatus)
        console.log(req.session.friendship.nextAction);
        res.json({
            success: true,
            nextAction: req.session.friendship.nextAction
        })
    }).catch(err => console.log("THERE WAS AN ERROR IN /get friendship",err));
})

app.post('/update-friendship/:id/', (req, res) => {
    let otherUser = req.params.id;
    let nextAction = req.session.friendship.nextAction
    let nextStatus = getNextStatus(nextAction)

    if(nextAction = 'Request Friendship') {

        const qNewFriendship = `INSERT INTO friendships (sender_id, recipient_id, status) VALUES ($1, $2, $3) RETURNING id`

        const params = [req.session.user.id, otherUser, nextStatus]

        db.query(qNewFriendship, params)
        .then((results) => {
            let queryResults = results.rows[0]
            req.session.friendship.id = queryResults.id
            req.session.friendship.status = nextStatus
            nextAction = getNextAction(true, req.session.friendship.status)
            res.json({
                success: true,
                nextAction: nextAction
            })
        })

    } else {

        const qUpdateFriendship = `UPDATE friendships SET status = $1 WHERE id = $2`

        const params = [nextStatus, req.session.friendship.id]

        db.query(qUpdateFriendship, params)
        .then((results) => {
            req.session.friendship.status = nextStatus
            nextAction = getNextAction(true, currentStatus)
            let queryResults = results.rows[0]
            res.json({
                success: true,
                nextAction: nextAction
            })
        })
    }
})

app.post('/reject-friendship-request/:id', (req, res) => {
    const qRejectFriendshipRequest = `UPDATE friendships SET status = $1 WHERE id = $2`

    const params = ['rejected', req.session.friendship.id]

    db.query(qRejectFriendshipRequest, params)
    .then((results) => {
        let queryResults = results.rows[0]
        res.json({
            success: true
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
            const qRegisterUser = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`
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
    console.log('entered queryGetPicture');
    const qGetProfilePicture = `SELECT picture_name FROM users WHERE id = $1`;
    const userId = [req.session.user.id];

    db.query(qGetProfilePicture, userId).then((results) => {
        if(results.rowCount == 0) {
            console.log('user has no profile picture');
            console.log(req.session.user);
            res.json({success: false})
        } else {
            console.log('in queryGetProfilePicture');
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
            const qInsertPictureName = `UPDATE users SET picture_name = $1 WHERE id = $2 RETURNING picture_name`;
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
    const qInsertUserBio = `UPDATE users SET bio = $1 WHERE id = $2`;
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
    console.log('getting user bio from server');
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
    console.log('getting user info from server');
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

app.listen(8080, function() {
    console.log("I'm listening.")
});
