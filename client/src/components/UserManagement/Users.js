import React, { useContext, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import useStyles from "./styles";
import User from "./Users/User";
import AuthContext from "../../store/auth-context";

const Users = (props) => {
  const [users, setUsers] = useState(props.users);
  const classes = useStyles();
  const authCtx = useContext(AuthContext);
  
  const updateUsers = (users) => {
    setUsers(users);
  };

  useEffect(()=>{
    setUsers(props.users);
  },[props.users])

  return ( 
    <>
      <Grid
        className={classes.mainContainer}
        container
        alignItems="stretch"
        spacing={5}
      >
        {users
          .filter((user) => {
            if (
              authCtx.user.role === "system administrator" &&
              user.role !== "system administrator"
            )
              return true;
            return (
              authCtx.user.role === "team leader" &&
              user.team === authCtx.user.team
            );
          })
          .map((user) => (
            <Grid
              style={{ paddingRight: "70px" }}
              item
              
              sm={3}
              key={user._id}
            >
              <User user={user} updateUsers={updateUsers} />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default Users;
