const mongoose = require("mongoose");
const Joi = require("joi");

const teamSchema = new mongoose.Schema({
  name:String,
});

exports.TeamModel = mongoose.model("teams", teamSchema);

exports.validNewTeam = (_bodyData) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(1).max(50).required(),
  });
  return joiSchema.validate(_bodyData);
};
