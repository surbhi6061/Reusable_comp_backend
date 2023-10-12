require('dotenv').config();

const mongoose = require("mongoose");

var MongoClient = require("mongodb").MongoClient;

const initDB = () => {
  try {
    var uri = process.env.MONGO_URI;

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    var connection = mongoose.connection;

    mongoose.connect(uri, options);

    connection.on("error", (err) => {
      console.log("err", err);
    });

    connection.on("connected", (err, res) => {
      console.log("MongoDB connected successfully!");
      console.log("res:", res);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = initDB;
