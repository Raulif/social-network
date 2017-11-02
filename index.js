const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser')
const spicedPg = require('spiced-pg');
const cookieSession = require('cookie-session')
const db = spicedPg(process.env.DATABASE_URL || 'postgres:rauliglesias:Fourcade1@localhost:5432/socialnetwork');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const csurf = require('csurf')


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
// var hashPassword = function(plainTextPassword) {
//     return new Promise(function(resolve, reject) {
//         bcrypt.genSalt(function(err, salt) {
//             if (err) {
//                 return reject(err);
//             }
//             bcrypt.hash(plainTextPassword, salt, function(err, hash) {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(hash);
//             });
//         });
//     });
// }
//
// var checkPassword = function(textEnteredInLoginForm, hashedPasswordFromDatabase) {
//     return new Promise(function(resolve, reject) {
//         bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(doesMatch);
//             }
//         });
//     });
// }
//
console.log('in index');

if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

app.get('/', function(req, res){
    if(!req.session.user) {
        res.send('/welcome')
    } else {
        res.sendFile(__dirname + '/index.html');

    }
});

app.get('/welcome', function(req, res){
    if (!!req.session.user) {
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
        var firstName = req.body.firstname;
        var lastName = req.body.lastname;
        var email = req.body.email;
        var password = req.body.password;

        console.log(req.body);

        req.session.user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        const qRegisterUser = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`
        const params = [firstName, lastName, email, password]
        db.query(qRegisterUser, params).then(() => {
            res.json({success: true})
        }).catch(err => console.log("THERE WAS AN ERROR IN /postquery newuser",err));
    }
})

app.post('/attemptlogin', (req, res) => {
    if(!req.body.email || !req.body.password) {
        console.log('fields missing!');
        res.json({success: false})
    }
    else {
        var email = req.body.email;
        var password = req.body.password;
        const qUserLogin = `SELECT * FROM users WHERE email = $1`
        const params = [email, password]
        db.query(qUserLogin, params).then((results) => {
            if(results.rowCount < 1) {
                console.log('wrong login data');
                res.json({success: false})
            } else {
                let loginData = results.rows[0]
                req.session.user = {
                    id: loginData.user_id,
                    firstName: loginData.firstname,
                    lastName: loginData.lastname,
                    email: loginData.email
                }
                res.json({
                    success: true,
                    user: req.session.user
                })
            }
        })
    }

})


app.listen(8080, function() {
    console.log("I'm listening.")
});
