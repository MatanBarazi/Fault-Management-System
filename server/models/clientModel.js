const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const clientSchema = new mongoose.Schema({
  id: Number,
  name: String,
  surname: String,
  email: String,
  phoneNumber: String,
});

exports.ClientModel = mongoose.model("clients", clientSchema);

exports.validClient = (_bodyData) => {
  let joiSchema = Joi.object({
    id: Joi.number().min(9).max(9).required(),
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(300).required().email(),
  });
  return joiSchema.validate(_bodyData);
};

