const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  surname: String,
  email: String,
  gender: String,
  pass: String,
  team: String,
  date_created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "regular",
  },
});

exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (_userId) => {
  let token = jwt.sign({ _id: _userId }, "MONKEYSSECRET", {
    expiresIn: "60mins",
  });
  return token;
};

exports.validUser = (_bodyData) => {
  let joiSchema = Joi.object({
    // id: Joi.number().min(8).max(10).required(),
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(300).required().email(),
    pass: Joi.string().min(3).max(100).required(),
    team: Joi.string().min(1).max(50),
  });
  return joiSchema.validate(_bodyData);
};

exports.validLogin = (_bodyData) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(300).required().email(),
    pass: Joi.string().min(3).max(100).required(),
  });
  return joiSchema.validate(_bodyData);
};
