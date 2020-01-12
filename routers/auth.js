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
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

  res.send(console.log("creating user" + userEmail));
});

router.post("/login", function(req, res) {
  userEmail = req.body.userEmail;
  userPassword = req.body.userPassword;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .then(() => {
      firebase
        .database()
        .ref("users/" + auth.currentUser.uid)
        .set({
          uid: auth.currentUser.uid,
          email: userEmail
        });
      if (auth.currentUser) {
        res.json({
          success: true,
          message: "user logged in as + " + firebase.auth().currentUser,
          email: auth.currentUser.userEmail
        });
      } else {
        console.log("user has changed");
      }
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });

  // reason why this breaks is because its an event listener  attached to a global scope auth() object?
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     res.json({
  //       success: true,
  //       message: "user logged in as + " + firebase.auth().currentUser,
  //       email: user.userEmail
  //     });
  //   } else {
  //     console.log("user has changed");
  //   }
  // });

  // not sure why i need this
  return;
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
