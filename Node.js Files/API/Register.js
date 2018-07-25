var db = require('./Database'),
    express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs');

function register(req, res) {
    var login = sanitizeInput(req.body.login);
    var password = sanitizeInput(req.body.password);
    var email = sanitizeInput(req.body.email);
    if (login == null | password == null | email == null) {
        res.json({success: false, reason: "Invalid input"});
        return;
    }
    db.conn((con) => con.execute("SELECT username, email FROM user WHERE username = ? OR email = ?;",
        [login, email],
        function (err, results, fields) {
            con.release();
            if (err) {
                res.json({success: false, reason: "There was an error connecting to the server! Please try later."});
            } else {
                if (results.length == 1) {
                    if (login.toLowerCase() == results[0].username.toLowerCase()) {
                        res.json({success: false, reason: "This username is already in use."});
                    } else if (email.toLowerCase() == results[0].email.toLowerCase()) {
                        res.json({success: false, reason: "This email is already in use."});
                    }
                } else {
                    res.json({success: true, reason: "worked"});
                    registerNewAccount(req, res, login, password, email);
                }
            }
        })
    );
}

function registerNewAccount(req, res, login, password, email) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            db.conn((con) => con.execute("SELECT COUNT(*) as count from `fitsyque`.`user`", [], function (err, results, fields) {
                con.release();
                    if(err) {
                        console.log(err);
                    } else {
                        db.conn.execute("INSERT INTO `fitsyque`.`user` VALUES (?, ?, ?, ?, ?, ?);",
                            [(results[0].count + 1), email, login, hash, salt, (new Date()).toISOString().substring(0, 10)],
                            function (err, results, fields) {
                                if(err) {
                                    console.log(err);
                                }
                            });
                    }
                })
            );   
        });
    });
}

function sanitizeInput(input) {
    if (!input
        || input.includes('“')
        || input.includes("'")
        || input.includes("'")
        || input.includes("‘")
        || input.includes('"')) {
        return null;
    }
    return input;
}

router.post("/Register", (req, res) => register(req, res));

module.exports = router;