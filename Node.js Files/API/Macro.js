var db = require('./Database'),
    express = require('express'),
    router = express.Router();

function request(req, res) {
    db.conn((con) => con.execute("SELECT RecordID, Fat, Protein, Carb FROM macronutrient_record WHERE UserID = ? AND Date = ?",
        [req.decoded.data, req.get("date")],
        function (err, results, fields) {
            con.release();
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                res.json({success: true, data: results});
            }
            
        })
    );
}

function getDates(req, res) {
    db.conn((con) => con.execute("SELECT DISTINCT(Date) FROM macronutrient_record WHERE UserID = ? AND MONTH(Date) = MONTH(?) AND YEAR(Date) = YEAR(?)",
        [req.decoded.data, req.get("date"), req.get("date")],
        function (err, results, fields) {
            con.release();
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                res.json({success: true, data: results});
            }    
        })
    );
}


function push(req, res) {
    if (req.body.Update == 0) {
        db.conn((con) => con.execute("INSERT INTO `fitsyque`.`macronutrient_record` VALUES (NULL, ?, ?, ?, ?, ?);",
            [req.decoded.data, req.body.Date, req.body.Fat, req.body.Protein, req.body.Carb],
            function(err, results, fields) {
                con.release();
                if (err) {
                    res.json({success: false});
                } else {
                    res.json({success: true});
                }
            })
        );
    } else {
        db.conn((con) => con.execute("UPDATE `fitsyque`.`macronutrient_record` SET Fat = ?, Protein = ?, Carb = ? WHERE RecordID = ? AND UserID = ?",
            [req.body.Fat, req.body.Protein, req.body.Carb, req.body.RecordID, req.decoded.data],
            function(err, results, fields) {
                con.release();
                if (err) {
                    res.json({success: false});
                    console.log(err)
                } else {
                    res.json({success: true});
                }
            })
        );
    }
}

function remove(req, res) {
    db.conn((con) => con.execute("DELETE FROM `fitsyque`.`macronutrient_record` WHERE UserID = ? AND RecordID = ?;",
        [req.decoded.data, req.body.RecordID],
        function(err, results, fields) {
            con.release();
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                res.json({success: true});
            }
        })
    );
}

router.get("/Macro", (req, res) => request(req, res));
router.get("/Macro/DotDates", (req, res) => getDates(req, res));
router.post("/Macro", (req, res) => push(req, res));
router.post("/Macro/Delete", (req, res) => remove(req, res));


module.exports = router;