const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    res.json({msg:"express work perfect 2222"});

    
})

module.exports = router;