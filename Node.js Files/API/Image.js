var db = require('./Database'),
    express = require('express'),
    router = express.Router();

function request(req, res) {
    db.conn.execute("SELECT * FROM measurement_record WHERE UserID = ? AND Date = ?",
        [req.decoded.data, req.get("date")],
        function (err, results, fields) {
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                var data = [];
                for (var i = 0; i < results.length; i++) {
                    data.push({
                        "RecordID": results[i].RecordID,
                        "Calf": results[i].Calf,
                        "Thigh": results[i].Thigh,
                        "Hip": results[i].Hip,
                        "Waist": results[i].Waist,
                        "Chest": results[i].Chest,
                        "Bicep": results[i].Bicep,
                        "Image": results[i].Image
                    });
                }
                res.json({success: true, data: data});
            }
            
        });
}


function push(req, res) {
    db.conn.execute("INSERT INTO `fitsyque`.`measurement_record` VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [req.decoded.data, req.body.Date, req.body.Calf, req.body.Thigh, req.body.Hip, req.body.Waist, req.body.Chest, req.body.Bicep, req.body.Image],
        function(err, results, fields) {
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                db.conn.query("SELECT MAX(RecordID) as count FROM measurement_record",
                    function(err, results, fields) {
                        if (!err) {
                            res.json({success: true, id: results[0].count});
                        }
                });
                
            }
        });
}

router.get("/Measurement", (req, res) => request(req, res));
router.post("/Measurement/Push", (req, res) => push(req, res));


module.exports = router;