const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  serialNumber: String,
  name: String,
  type: String,
});

exports.ProductModel = mongoose.model("products", productSchema);

exports.validNewProduct = (_bodyData) => {
  let joiSchema = Joi.object({
    serialNumber: Joi.number().min(1).max(99).required(),
    name: Joi.string().min(1).max(99).required(),
    type: Joi.number().min(9).max(9).required(),
  });
  return joiSchema.validate(_bodyData);
};

