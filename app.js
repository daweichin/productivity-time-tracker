const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

// Make server listen for requests

const port = 5000;

app.listen(port, () => {
  console.log("server listening on " + port);
});
