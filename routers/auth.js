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
  res.send(console.log("creating user"));
  userEmail = req.body.userEmail;
  userPassword = req.body.userPassword;

  auth
    .createUserWithEmailAndPassword(userEmail, userPassword)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
});

router.post("/login", function(req, res) {
  userEmail = req.body.userEmail;
  userPassword = req.body.userPassword;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      res.send({
        success: true,
        message: "user logged in as + " + firebase.auth().currentUser
      });
    } else {
      console.log("user is logged out");
    }
  });
});

router.post("/signout", function(req, req) {
  console.log("signing out");
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
});

module.exports = router;
