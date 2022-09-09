const express = require("express");
//יודע לקחת כתובת ולעשות אליה מניפולציות
const path = require("path")
const http = require("http");
const cors = require("cors");

const dbConnect = require("./db/mongoConnect");//לפעמים משתמשים כדי לבדוק חיבור/עומס במסד נתונים
const {routesInit} = require("./routes/config_route");

const app=express();

//הגדרת פירסור מידע כג'ייסון
app.use(express.json());

app.use(cors());

//נגדיר את תקיית הפאבליק כתקייה סטטית שניתן לשים בה קבצים ולצד לקוח יהיה גישה
app.use(express.static(path.join(__dirname,"public")));

routesInit(app);

//req->מה שנקבל בדרך כלל מהצד לקוח או הדפדפן בראוט
//res->מה השרת מגיב לצד לקוח,במקרה שלנו דפדפן
app.get("/",(req,res) => {
    //אומר לו להחזיר מידע בפורמט ג'ייסון לצד לקוח
    res.json({msg:"express work perfect 1138"});
})


//מייצרים שרת שמשתמש במשתנה אפ שיש לו את כל היכולות המיוחדות של אקספרס 
const server = http.createServer(app);
//הגדרנו פורט
let port = "3001";
server.listen(port);
// process.env.PORT ||