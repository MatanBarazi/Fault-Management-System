import React, { useState, useContext } from "react";
import AuthContext from "../store/auth-context";
// import image from "../images/Costumer service.jpg"
import video1 from "../images/crm2.mp4"

// this.props.location.login.user.email
const Home = (props) => {
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <div>
      {/* <video src={video1} autoPlay loop/> */}
      {/* <img
        src={image}
        alt="FMS wallpaper"
        height={300}
        width={500}
      /> */}
    </div>
  );
};

export default Home;
