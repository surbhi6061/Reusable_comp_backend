
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var os = require("os");
const Cors = require("cors");

const db = require("./config/db");
db()

const signupRouter = require("./Routes/userRoute");

const app = express();


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(bodyParser.json({ limit: "10mb" }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Cors());

app.get("/health", (req, res) => {
  res.send("OK");
});


app.use("/", signupRouter);
// app.use("/user", userRouter);

app.listen(9000, () => {
  console.log("Server is listening !");
  console.log(`Server is running on port 9000`);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;
