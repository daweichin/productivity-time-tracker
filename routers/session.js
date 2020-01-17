var firebase = require("firebase/app");
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

require("firebase/auth");
require("firebase/database");

// Initialize Firebase

const auth = firebase.auth();
const database = firebase.database();

router.get("/checkCurrentUser", function(req, res) {
  if (auth.currentUser) {
    firebase
      .database()
      .ref("users/" + auth.currentUser.uid)
      .once("value", function(snapshot) {
        callback(snapshot);
      });
  } else {
    res.json({ error: "error has occured" });
  }

  function callback(snapshot) {
    console.log(snapshot.val());
    temp = snapshot.val();
    var sessionOn = temp.sessionOn;
    var sessionId = temp.sessionId;
    var userId = firebase.auth().currentUser.uid;
    console.log(
      "The current session is " +
        sessionOn +
        "with current session id being " +
        sessionId +
        "and the user is " +
        userId
    );

    res.json({
      userId: userId,
      userEmail: auth.currentUser.email,
      sessionOn: sessionOn,
      sessionId: sessionId
    });
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
  sessionOn: false,
  userId: ""
};

router.post("/startSession", function(req, res) {
  console.log(req.body);
  // assign req params to temp object
  trackObject.sessionType = req.body.sessionType;
  trackObject.trackstart = req.body.startTime;
  trackObject.sessionId = req.body.sessionId;
  trackObject.date = req.body.date;
  trackObject.userId = req.body.userId;

  console.log("Starting session " + trackObject.sessionId);

  //set sessionOn variable attached to user as on
  firebase
    .database()
    .ref("users/" + auth.currentUser.uid + "/sessionOn")
    .set(true);

  // writing request to firebase sessions node
  firebase
    .database()
    .ref("/sessions/" + trackObject.userId + "/" + trackObject.sessionId)
    .set(trackObject);

  // sending back object to frontend for debug purposes and event lifecycle handling
  console.log("start object:" + trackObject);
  res.json(trackObject);
});

router.post("/endSession", function(req, res) {
  trackObject.trackend = req.body.endTime;
  trackObject.duration = req.body.duration;

  //set sessionOn variable attached to user as off
  firebase
    .database()
    .ref("users/" + auth.currentUser.uid + "/sessionOn")
    .set(false);

  // increment session by 1
  trackObject.sessionId = parseInt(trackObject.sessionId) + 1;
  firebase
    .database()
    .ref("users/" + auth.currentUser.uid + "/sessionId")
    .set(trackObject.sessionId);

  // update session
  firebase
    .database()
    .ref("sessions/" + trackObject.userId + "/" + trackObject.sessionId)
    .set(trackObject);

  console.log("end object:" + trackObject);
  res.send(trackObject);
});

router.get("/getSession", function(req, res) {
  userId = auth.currentUser.uid;
  var test = database.ref("sessions/" + userId);
  test.once("value", function(snapshot) {
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
