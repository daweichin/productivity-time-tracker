var firebase = require("firebase/app");
const express = require("express");
const bodyParser = require("body-parser");
var moment = require("moment");
moment().format();

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
var trackObject = {};

router.post("/startSession", function(req, res) {
  console.log(req.body);
  // assign req params to temp object
  trackObject.sessionType = req.body.sessionType;
  trackObject.trackstart = req.body.startTime;
  trackObject.trackend = "Session Ongoing";
  trackObject.duration = "---";
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

// End session API
router.post("/endSession", function(req, res) {
  database
    .ref("/sessions/" + trackObject.userId + "/" + trackObject.sessionId)
    .once("value", function(snapshot) {
      trackObject = snapshot.val();
    });

  trackObject.trackend = req.body.endTime;

  // calculate duration here

  console.log(trackObject);
  var duration = moment
    .utc(
      moment(trackObject.trackend, "HH:mm:ss").diff(
        moment(trackObject.trackstart, "HH:mm:ss")
      )
    )
    .format("HH:mm:ss");

  console.log(duration);
  trackObject.duration = duration;

  //set sessionOn variable attached to user as off
  firebase
    .database()
    .ref("users/" + auth.currentUser.uid + "/sessionOn")
    .set(false);

  // update session
  firebase
    .database()
    .ref("sessions/" + trackObject.userId + "/" + trackObject.sessionId)
    .set(trackObject);

  // increment session by 1
  trackObject.sessionId = parseInt(trackObject.sessionId) + 1;
  console.log("line 127: " + trackObject.sessionId);
  firebase
    .database()
    .ref("users/" + auth.currentUser.uid + "/sessionId")
    .set(trackObject.sessionId);

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
