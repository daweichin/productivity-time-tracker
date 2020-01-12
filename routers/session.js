var firebase = require("firebase/app");
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

require("firebase/auth");
require("firebase/database");

// Initialize Firebase

const auth = firebase.auth();
const database = firebase.database();

router.get("/getAllSessions", (req, res) => res.json({ test: "test" }));

router.get("/checkCurrentUser", function(req, res) {
  if (auth.currentUser) {
    res.json({
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email
    });
  } else {
    res.json({ error: "error has occured" });
  }
});

// Post Request
// Write user data into database
// Needs a rename

//store sessionId variable on the database
var trackObject = {
  trackstart: "",
  trackend: "",
  duration: "",
  sessionType: "",
  sessionId: 0,
  sessionOn: false
};

router.post("/startSession", function(req, res) {
  // firebase current userid
  userId = auth.currentUser.uid;

  // finding previous session ID value so as to not overwrite previous sessions if they exist
  // var previousSessionId = firebase
  //   .database()
  //   .ref("users/" + userId + "/" + trackObject.date + "/sessions")
  //   .once("value")
  //   .then(function(snapshot) {
  //     snapshot.val().sessionId;
  //   });

  // create new sessionId variable by incrementing 1
  // sessionId = parseInt(previousSessionId) + 1;

  // assign req params to temp object
  trackObject.sessionType = req.body.sessionType;
  trackObject.trackstart = req.body.startTime;
  // trackObject.sessionId = sessionId;
  trackObject.date = req.body.date;

  // writing request to firebase
  firebase
    .database()
    .ref(
      "sessions/" +
        userId +
        "/" +
        trackObject.date +
        "/" +
        trackObject.trackstart
    )
    .set(trackObject);

  // sending back object to frontend for debug purposes
  res.json(trackObject);
});

router.post("/endSession", function(req, res) {
  trackObject.trackend = req.body.endTime;
  trackObject.duration = req.body.duration;

  firebase
    .database()
    .ref(
      "sessions/" +
        userId +
        "/" +
        trackObject.date +
        "/" +
        trackObject.trackstart
    )
    .set(trackObject);

  console.log(trackObject);
  res.send(trackObject);

  // send this trackObject off to the database
});

router.get("/getSession", function(req, res) {
  userId = auth.currentUser.uid;
  var test = database.ref("sessions/" + userId);
  test.on("value", function(snapshot) {
    array = [];
    array.push(snapshot.val());
    console.log(array);
    res.json(array);
  });
});

function writeUserData(userId, name, email, imageUrl) {
  firebase
    .database()
    .ref("users/" + userId)
    .set({
      userID: userId,
      userEmail: email
    });
}

module.exports = router;
