import React, { useState, useEffect } from "react";
let timeoutID;

const AuthContext = React.createContext({
  user: {},
  isLoggedIn: false,
  login: (user) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedUser = localStorage.getItem("user");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("user");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    user: storedUser,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const userData = retrieveStoredToken();
  let initialUser;
  if (userData) {
    initialUser = JSON.parse(userData.user);
  }
  const [user, setUser] = useState(initialUser);

  const userIsLoggedIn = !!user; //was ... = !!token need to see why need token

  const loginHandler = (user, expirationTime) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("expirationTime", expirationTime);
    setUser(user);

    const remainingTime = calculateRemainingTime(expirationTime);
    timeoutID = setTimeout(logoutHandler, remainingTime);
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("expirationTime");
    setUser(null);
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  };

  useEffect(() => {
    if (userData) {
      console.log(userData.duration);
      timeoutID = setTimeout(logoutHandler, userData.duration);
    }
  }, [userData, logoutHandler]);

  const contextValue = {
    user: user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
