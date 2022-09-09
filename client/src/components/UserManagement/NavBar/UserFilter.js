import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../../store/auth-context";
import Form from "react-bootstrap/Form";
import { BiSearchAlt } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { CSSTransition } from "react-transition-group";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "../../../shared/components/FormElements/Button";
import styles from "./UserFilter.module.css";

const UserFilter = (props) => {
  const [filter, setFilter] = useState({
    id: "",
    name: "",
    surname: "",
    email: "",
    team: "",
    gender: "",
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const authCtx = useContext(AuthContext);

  const reset = () => {
    setFilter({
      id: "",
      name: "",
      surname: "",
      email: "",
      team: "",
      gender: "",
    });
    setFormIsValid(false);
  };

  const handleSearch = () => {
    props.updateUsers(
      props.users.filter((item) => {
        return (
          (filter.id !== "" ? item.id.toString() === filter.id : true) &&
          (filter.name !== "" ? item.name === filter.name : true) &&
          (filter.surname !== "" ? item.surname === filter.surname : true) &&
          (filter.email !== "" ? item.email === filter.email : true) &&
          (filter.team !== "" ? item.team === filter.team : true) &&
          (filter.gender !== "" ? item.gender === filter.gender : true)
        );
      })
    );
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setFormIsValid(
        filter.id !== "" ||
          filter.name !== "" ||
          filter.surname !== "" ||
          filter.email !== "" ||
          filter.team !== "" ||
          filter.gender !== ""
      );
    }, 250);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [filter]);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <>
      <CSSTransition
        in={props.isOpen}
        timeout={300}
        classNames="slide-in-up"
        mountOnEnter
        unmountOnExit
      >
        <Row>
          <Form.Group as={Col}>
            <Form.Label>
              <strong>ID</strong>
            </Form.Label>
            <Form.Control name="id" value={filter.id} onChange={handleChange} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>
              <strong>Name</strong>
            </Form.Label>
            <Form.Control
              name="name"
              value={filter.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>
              <strong>Surname</strong>
            </Form.Label>
            <Form.Control
              name="surname"
              value={filter.surname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>
              <strong>Email</strong>
            </Form.Label>
            <Form.Control
              name="email"
              value={filter.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>
              <strong>Team</strong>
            </Form.Label>
            {authCtx.user.role === "system administrator" ? (
              <Form.Control
                as="select"
                name="team"
                value={filter.team}
                onChange={handleChange}
              >
                <option value="" selected></option>
                <option value={"Customer service"}>Customer service</option>
                <option value={"Technical service"}>Technical service</option>
                <option value={"Stock"}>Stock</option>
                <option value={"Purchase"}>Purchase</option>
              </Form.Control>
            ) : (
              <Form.Control
                as="select"
                name="team"
                value={filter.team}
                onChange={handleChange}
              >
                <option value="" selected></option>
                <option value={authCtx.user.team}>{authCtx.user.team}</option>
              </Form.Control>
            )}
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>
              <strong>Gender</strong>
            </Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={filter.gender}
              onChange={handleChange}
            >
              <option value="" selected></option>
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} className={styles["responsive"]}>
            <Button
              type="submit"
              title="search"
              disabled={!formIsValid}
              onClick={handleSearch}
            >
              Search <BiSearchAlt />
            </Button>

            <Button
              title="reset"
              color="black"
              onClick={() => {
                reset();
                props.resetUsers();
              }}
            >
              Reset <HiOutlineRefresh />
            </Button>
          </Form.Group>
        </Row>
      </CSSTransition>
    </>
  );
};

export default UserFilter;
