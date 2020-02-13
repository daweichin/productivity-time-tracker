const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

const fs = require("fs");

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

var options = {
  key: fs.readFileSync("/etc/letsencrypt/live/davidchintech.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/davidchintech.com/cert.pem"),
  ca: fs.readFileSync("/etc/letsencrypt/live/davidchintech.com/chain.pem")
};
// Make server listen for requests

const port = process.env.PORT || 443;

https.createServer(options, app).listen(port);
