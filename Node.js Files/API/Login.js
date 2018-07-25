var json = require('jsonwebtoken'),
    secret = require('../config').secret,
    jwt     = require('jsonwebtoken'),
    db = require('./Database'),
    express = require('express'),
    router = express.Router(),
    bcrypt = require('bcryptjs');




function createToken(username) {
     return jwt.sign({data: username}, secret, {
          expiresIn: 6000
    });
}

function login(req, res) {
    var login = sanitizeInput(req.body.login);
    var password = sanitizeInput(req.body.password);
    if (login == null | password == null) {
        res.json({success: false, reason: "Invalid inputs"});
    }
    db.conn((con) => {
        con.execute("SELECT * FROM user WHERE username = ?;", [login],
            function (err, results, fields) {
                con.release();
                if (err) {
                    console.log(err);
                } else {
                    if (results.length == 0) {
                         res.json({success: false, reason: "Non-valid username"});
                    } else {
                        var hashedPW = bcrypt.compareSync(password, results[0].Password);
                        if (hashedPW) {
                            res.json({success: true, token: createToken(results[0].UserID)});
                        } else {
                            res.json({success: false, reason: "Incorrect password"});
                        }
                    }
                }
            }
        );}
    );
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

router.post("/Login", (req, res) => login(req, res));

module.exports = router;