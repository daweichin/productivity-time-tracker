var firebase = require("firebase/app");
const express = require("express");
const router = express.Router();

require("firebase/auth");
require("firebase/database");

// Firebase code

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDFHt5elTNwC58mcoK7A5Kltvs1Ri4tOX8",
  authDomain: "productivity-tracker-a382f.firebaseapp.com",
  databaseURL: "https://productivity-tracker-a382f.firebaseio.com",
  projectId: "productivity-tracker-a382f",
  storageBucket: "productivity-tracker-a382f.appspot.com",
  messagingSenderId: "1063283447974",
  appId: "1:1063283447974:web:d46839f9a9cc25dc317c67"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post("/createUser", function(req, res) {
  userEmail = req.body.userEmail;
  userPassword = req.body.userPassword;
  auth
    .createUserWithEmailAndPassword(userEmail, userPassword)
    .then(function(user) {
      console.log("entered sign up loop");
      console.log(auth.currentUser.uid);
      firebase
        .database()
        .ref("users/" + auth.currentUser.uid)
        .set({
          uid: auth.currentUser.uid,
          email: userEmail,
          sessionOn: false,
          sessionId: 0
        });
      console.log("user signed up ");
      // TODO:: Implement res.redirect()
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      res.send({ error: errorMessage });
    });
});

router.post("/login", function(req, res) {
  userEmail = req.body.userEmail;
  userPassword = req.body.userPassword;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .then(function() {
      if (auth.currentUser) {
        res.json({
          success: true,
          message: "user logged in as + " + firebase.auth().currentUser,
          email: auth.currentUser.userEmail
        });
      } else {
        res.send("user has changed");
      }
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      res.send({ error: errorMessage });
    });
});

router.post("/signout", function(res, req) {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
      console.log("sign out successfull");
    })
    .catch(function(error) {
      res.send(console.log("signed out"));
    });
});

module.exports = router;
