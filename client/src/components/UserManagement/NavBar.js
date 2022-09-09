import React, { useState } from "react";
import CreateNewUserModal from "./NavBar/CreateNewUserModal"
import UserFilter from "./NavBar/UserFilter"
import { Container } from "@material-ui/core";
import CostumButton from "../../shared/components/FormElements/Button";
import { ImFilter } from "react-icons/im";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
    else setIsOpen(false);
  };

  return (
    <>
    <Container maxWidth style={{ padding:"10px 10px",background: "#212529" }}>
      <CostumButton
        style={{ width: "200px", height: "50px" }}
        title="user filter"
        color="blue"
        onClick={handleOpen}
      >
        <strong>User Filter</strong>{" "}
        <ImFilter style={{ marginBottom: "5px" }} />
      </CostumButton>
      <CreateNewUserModal updateUsers={props.updateUsers} /> 
      
    </Container>
    <Container maxWidth style={{padding:"10px 10px", background: "#fff" }}>
      <UserFilter users={props.users} isOpen={isOpen} updateUsers={props.updateUsers} resetUsers={props.resetUsers}/>
    </Container>
    </>
  );
};

export default NavBar;
