const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser')
const spicedPg = require('spiced-pg');
const cookieSession = require('cookie-session')
const db = spicedPg(process.env.DATABASE_URL || 'postgres:rauliglesias:Fourcade1@localhost:5432/socialnetwork');
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

console.log('in index');

if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

// app.post('/uploadpicture', uploader.single('imageFile'), function(req, res) {
//     // If nothing went wrong the file is already in the uploads directory
//
//     if(req.file) {
//         toS3(req.file)
//         .then(function(){
//             //only after this, do the insert query to DB
//             const qInsertImage = `INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)`
//
//             const params = [req.file.filename, req.body.username, req.body.imgtitle, req.body.imgdescription]
//
//             return db.query(qInsertImage, params).then((results)=> {
//
//                 res.json({success: true})
//             })
//         })
//         .catch(err => res.json({success: false}));
//     } else {
//         res.json({success: false})
//     }
// });


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
            console.log(req.session.user.password);
            const qRegisterUser = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`
            const params = [firstName, lastName, email, password]
            db.query(qRegisterUser, params).then(() => {
                res.json({success: true})
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
