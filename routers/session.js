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
  sessionId = parseInt(trackObject.sessionId) + 1;

  // get the val of the session type
  trackObject.sessionType = req.body.sessionType;
  trackObject.trackstart = req.body.startTime;
  trackObject.sessionId = sessionId;

  userId = auth.currentUser.uid;

  firebase
    .database()
    .ref("users/" + userId + "/sessions/" + trackObject.sessionId)
    .set(trackObject);

  res.json(trackObject);
});

router.post("/endSession", function(req, res) {
  trackObject.trackend = req.body.endTime;
  trackObject.duration = req.body.duration;

  firebase
    .database()
    .ref("users/" + userId + "/sessions/" + trackObject.sessionId)
    .set(trackObject);

  console.log(trackObject);
  res.send(trackObject);

  // send this trackObject off to the database
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
