const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
  UserModel,
  validUser,
  validLogin,
  genToken,
} = require("../models/userModel");
const { authToken } = require("../auth/authToken");

router.get("/", (req, res) => {
  res.json();
});

router.post("/", async (req, res) => {
  console.log(req.body.id);
  // let validBody = validUser(req.body);
  // if(validBody.error){
  //     return res.status(400).json(validBody.error.details);
  // }

  try {
    let user = new UserModel(req.body);
    user.pass = await bcrypt.hash(user.pass, 10);
    await user.save(); //שומר את המידע ב db
    user.pass = "*****";
    res.json(user);
  } catch (err) {
    res
      .status(401)
      .json({msg: "Email or ID already in system or there another problem" });
  }
});

module.exports = router;
