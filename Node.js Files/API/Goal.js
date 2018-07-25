var db = require('./Database'),
    express = require('express'),
    router = express.Router();

function request(req, res) {
    db.conn((con) => con.execute("SELECT * FROM exercise_record INNER JOIN exercise ON exercise.ExerciseID = exercise_record.ExerciseID WHERE UserID = ? AND Date BETWEEN DATE_SUB(?, INTERVAL 2 WEEK) AND ?", [req.decoded.data, req.get("date"), req.get("date")],
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
                        "RecordID": results[i].RecordID,
                        "MuscleGroupID": results[i].MuscleGroupID
                    });
                }
                res.json({success: true, data: data});
            }
            
        })
    );
}

router.get("/Goal", (req, res) => request(req, res));


module.exports = router;