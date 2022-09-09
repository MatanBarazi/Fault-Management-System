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
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  //נבדוק אם המייל שנשלח בבאדי קיים במסד נתונים
  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ msg: "Email not found" });
  }
  //נבדוק שהסיסמא שנשלחה מתאימה להצפנה שנמצאת במסד
  let passValid = await bcrypt.compare(req.body.pass, user.pass);
  if (!passValid) {
    return res.status(401).json({ msg: "Password wrong" });
  }
  //נחזיר הודעה שהכל בסדר ונייצר טוקן
  let newToken = genToken(user.id);
  res.json({ token: newToken, user: user });
});

module.exports = router;
