import React, { useContext, useEffect, useState } from "react";
import { Grid, withWidth } from "@material-ui/core";
import Users from "./UserManagement/Users";
import NavBar from "./UserManagement/NavBar";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";

const UserManagement = (props) => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getUsers = async () => {
    try {
      let response = await Axios.get("/users");
      setAllUsers(response.data);
      setUsers(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(async () => {
    await getUsers();
  }, []);
  const updateUsers = (users) => {
    setUsers(users);
  };

  const resetUsers = () => {
    setUsers(allUsers);
  };

  return isLoading ? (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />
  ) : (
    <Grid style={{minWidth:"1400px"}}>
      <NavBar users={allUsers} updateUsers={updateUsers} resetUsers={resetUsers}/>
      <Users users={users}/>
    </Grid>
  );
};

export default UserManagement;
