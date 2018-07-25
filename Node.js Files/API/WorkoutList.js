var db = require('./Database'),
    express = require('express'),
    router = express.Router();

function request(req, res) {
    db.conn((con) => con.execute("SELECT * FROM exercise ORDER BY Name ASC;",
        [],
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
                        "MuscleID": results[i].MuscleGroupID,
                        "ExerciseID": results[i].ExerciseID
                    });
                }
                res.json({success: true, data: data});
            }
        })
    );
}


router.get("/WorkoutList", (req, res) => request(req, res));

module.exports = router;