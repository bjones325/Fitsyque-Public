var db = require('./Database'),
    express = require('express'),
    router = express.Router();
    
function requestWorkoutList(req, res) {
    db.conn((con) => con.execute("SELECT DISTINCT(Name), TypeID, exercise.ExerciseID FROM exercise_record INNER JOIN exercise ON exercise.ExerciseID = exercise_record.ExerciseID WHERE UserID = ? AND Date BETWEEN ? AND ?",
        [req.decoded.data, req.get("beginDate"), req.get("endDate")],
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
                        "TypeID": results[i].TypeID,
                        "ExerciseID": results[i].ExerciseID
                    });
                }
                res.json({success: true, data: data});
            }
            
        })
    );
}

function requestData(req, res) {
    db.conn((con) => con.execute("SELECT * FROM exercise_record INNER JOIN exercise ON exercise.ExerciseID = exercise_record.ExerciseID WHERE exercise.ExerciseID = ? AND UserID = ? AND Date BETWEEN ? AND ?",
        [req.get("ExerciseID"), req.decoded.data, req.get("beginDate"), req.get("endDate")], 
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
                        "TypeID": results[i].TypeID
                    });
                }
                res.json({success: true, data: data});
            }
        })
    );
}

function selectData(req, res, val) {
    db.conn((con) => con.execute("SELECT " + val + " as value FROM exercise_record INNER JOIN exercise ON exercise.ExerciseID = exercise_record.ExerciseID WHERE exercise.ExerciseID = ? AND UserID = ? AND Date BETWEEN ? AND ? GROUP BY Date",
        [req.get("ExerciseID"), req.decoded.data, req.get("beginDate"), req.get("endDate")], 
        function (err, results, fields) {
            con.release();
            if (err) {
                res.json({success: false});
                console.log(err);
            } else {
                var data = [];
                for (var i = 0; i < results.length; i++) {
                    data.push({
                        "y": Number(results[i].value),
                        "marker": Number(results[i].value)
                    });
                }
                res.json({success: true, data: data});
            }
        })
    );
}

router.get("/Graph/WorkoutList", (req, res) => requestWorkoutList(req, res));
router.get("/Graph/Data", (req, res) => requestData(req, res));
router.get("/Graph/Data/Total_Weight", (req, res) => selectData(req, res, "SUM(Weight)"));
router.get("/Graph/Data/Total_Reps", (req, res) => selectData(req, res, "SUM(Reps)"));
router.get("/Graph/Data/Average_Reps", (req, res) => selectData(req, res, "AVG(Weight)"));
router.get("/Graph/Data/Average_Weight", (req, res) => selectData(req, res, "AVG(Reps)"));
router.get("/Graph/Data/Min_Weight", (req, res) => selectData(req, res, "MIN(Weight)"));
router.get("/Graph/Data/Max_Weight", (req, res) => selectData(req, res, "MAX(Weight)"));


module.exports = router;