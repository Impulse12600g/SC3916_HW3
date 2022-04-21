/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();//create a user
        //properties on that user
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){//save the record
            if (err) {
                if (err.code == 11000)//if its a duplicate
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);//return an error
            }

            res.json({success: true, msg: 'Successfully created new user.'})// otherwise successful
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();// same new user w/ properties
    userNew.username = req.body.username;
    userNew.password = req.body.password;
    //query the user
    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {// send back the error
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {//comp pass with matched pass
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };//new token with assigned secret key
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});// if not match
            }
        })
    })
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


