var db = require('./Database'),
    express = require('express'),
    router = express.Router();

function request(req, res) {
    db.conn((con) => con.execute("SELECT * FROM exercise_record INNER JOIN exercise ON exercise.ExerciseID = exercise_record.ExerciseID WHERE UserID = ? AND Date = ?",
        [req.decoded.data, req.get("date")],
        function (err, results, fields) {
            con.release();
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                var data = [];
                for (var i = 0; i < results.length; i++) {
                    data.push({
                        "Name": results[i].Name,
                        "Sets": results[i].Sets,
                        "Reps": results[i].Reps,
                        "Weight": results[i].Weight,
                        "Duration": results[i].Duration,
                        "Intensity": results[i].Intensity,
                        "Incline": results[i].Incline,
                        "Resistence": results[i].Resistence,
                        "TypeID": results[i].TypeID,
                        "ExerciseID": results[i].ExerciseID,
                        "RecordID": results[i].RecordID
                    });
                }
                res.json({success: true, data: data});
            }
            
        })
    );
}

function getDates(req, res) {
    db.conn((con) => con.execute("SELECT DISTINCT(Date) FROM exercise_record WHERE UserID = ? AND MONTH(Date) = MONTH(?) AND YEAR(Date) = YEAR(?)",
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
        db.conn((con) => con.execute("INSERT INTO `fitsyque`.`exercise_record` VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            [req.decoded.data, req.body.ExerciseID, req.body.Date, req.body.Sets, req.body.Reps, req.body.Weight, req.body.Duration, req.body.Intensity, req.body.Incline, req.body.Resistence],
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
    } else {
        db.conn((con) => con.execute("UPDATE `fitsyque`.`exercise_record` SET Sets = ?, Reps = ?, Weight = ?, Duration = ?, Intensity = ?, Incline = ?, Resistence = ? WHERE RecordID = ? AND UserID = ?;",
            [req.body.Sets, req.body.Reps, req.body.Weight, req.body.Duration, req.body.Intensity, req.body.Incline, req.body.Resistence, req.body.RecordID, req.decoded.data],
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
}

function remove(req, res) {
    db.conn((con) => con.execute("DELETE FROM `fitsyque`.`exercise_record` WHERE UserID = ? AND RecordID = ?;",
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



router.get("/DayList", (req, res) => request(req, res));
router.get("/DayList/DotDates", (req, res) => getDates(req, res));
router.post("/DayList", (req, res) => push(req, res));
router.delete("/DayList", (req, res) => remove(req, res));


module.exports = router;