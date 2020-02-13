const express = require("express");
const app = express();
const bodyParser = require("body-parser");
<<<<<<< HEAD
const https = require("https");

const fs = require("fs");
=======
>>>>>>> parent of fd39a1c... added https

const auth = require("./routers/auth");
const session = require("./routers/session");

app.use(express.static("public"));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is actually setting the api endpoint with the auth object that has been exported from the auth route

// specify 'root' path for api endpoints
app.use("/", auth);
app.use("/", session);

// middleware test
app.use(function(req, res, next) {
  console.log("Time:", Date.now());
  next();
});

// Make server listen for requests

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server is running on port " + port);
});
