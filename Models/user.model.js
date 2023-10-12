const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: String,
  email: {
    // index: { unique: true, dropDups: true },
    // type: String,
    unique: true,
    lowercase: true,
    // match:
    //   /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  phone_number: Number,
  // address: String,
  
});

module.exports = mongoose.model("User", userSchema);
