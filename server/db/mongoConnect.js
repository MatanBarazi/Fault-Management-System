const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://mor:1234@faultmanagement.wuyim.mongodb.net/express0?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);
// mongoose.connect('mongodb://localhost:27017/express0', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mongo connected");
  // we're connected!
});

module.exports = db;
