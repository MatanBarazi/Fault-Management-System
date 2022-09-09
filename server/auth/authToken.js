const jwt = require("jsonwebtoken");

exports.authToken = (req,res,next) =>{
    //לבדוק אם בכלל נשלח טוקן
    let token = req.header("x-api-key")//נהוג ככה לקרוא למפתח
    if(!token){
        return res.status(401).json({msg:"you must send token"});
    }
    //לבדוק אם הטוקן תקני או בתוקף
    try{
        let decodeToken = jwt.verify(token,"MONKEYSSECRET");
        req.tokenData = decodeToken;
        //אם הכל בסדר נעבור לפנוקציה הבאה
        next();
    }
    catch(err){
        res.json({msg:"token invalid or expired"});
    }



}