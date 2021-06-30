// required modules
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

// host and port
const hostname = '127.0.0.1';
const port = 3000;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

// db connection
mongoose.connect("mongodb://localhost:27017/instaFeedWorld", {
  useNewUrlParser : "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})


// Routers
var userRouter = require('./routes/user');

app.use('/user',userRouter);

// start the server
app.listen(port,hostname,()=>{
	console.log(`Server running at http://${hostname}:${port}/`);
})