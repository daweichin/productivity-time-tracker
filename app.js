const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const auth = require("./routers/auth");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// this is actually setting the api endpoint with the auth object that has been exported from the auth route

// specify 'root' path sort of
app.use("/", auth);

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
