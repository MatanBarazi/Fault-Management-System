import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Error from "../shared/components/FormElements/error";

import styles from "./auth.module.css";
import AuthContext from "../store/auth-context";

// this.props.location.state.detail.user
const Login = (props) => {
  const regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const history = useHistory();
  const [login, setLogin] = useState({
    email: "",
    pass: "",
    loginErrors: "",
    formIsValid: false,
    invalidUser: false,
    user: null,
  });
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setLogin((login) => {
        return {
          ...login,
          formIsValid: regEmail.test(login.email) && login.pass.length > 3,
        };
      });
      console.log("formIsValid:" + login.formIsValid);
      if (login.loginErrors.length > 0) {
        setLogin((login) => {
          return { ...login, loginErrors: "" };
        });
        setLogin((prevState) => {
          return { ...prevState, invalidUser: false };
        });
      }
    }, 250);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [login.email, login.pass]);

  const loginHandler = (event) => {
    event.preventDefault();
    console.log("login event");
    Axios.post("/login", {
      email: login.email,
      pass: login.pass,
    })
      .then((response) => {
        // console.log(response.data)
        setLogin((prevValues) => {
          return {
            ...prevValues,
            loginErrors: "",
            user: response.data.user,
          };
        });

        const expirationTime = new Date(
          new Date().getTime() + 10 * 3600 * 1000
        );
        const objUserAndToken = {
          ...response.data.user,
          token: response.data.token,
        };
        authCtx.login(objUserAndToken, expirationTime.toISOString());
        console.log(authCtx.user);
        if (
          response.data.user.team === "Customer service" ||
          response.data.user.team === "Technical service"
        )
          history.replace("/faultManagement");
        else if (
          response.data.user.team === "Stock" ||
          response.data.user.team === "Purchase"
        )
          history.replace("/requestManagement");
        else if(response.data.user.role==="system administrator")
          history.replace("/userManagement");
        else history.replace("/");
      })
      .catch((err) => {
        setLogin((prevState) => {
          return { ...prevState, invalidUser: true };
        });
        console.log(err.response);
        if (err.response && err.response.status === 400) {
          setLogin((prevState) => {
            return { ...prevState, loginErrors: err.response.data[0].message };
          });
        } else if (err.response && err.response.status === 401) {
          setLogin((prevState) => {
            return { ...prevState, loginErrors: err.response.data.msg };
          });
        }
      });
  };

  return (
    <div className={`${styles["auth"]} ${login.invalidUser && styles.invalid}`}>
      <h1 className={styles["auth-header"]}>Login</h1>
      <br />
      <Form onSubmit={loginHandler}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
          />
        </Form.Group>
        <br />
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, pass: e.target.value })}
          />
        </Form.Group>
        <br />
        <Button block size="lg" type="submit" disabled={!login.formIsValid}>
          Login
        </Button>
        <br />
        <br />
        <Error Error={login.loginErrors} />
        {/* Don't have an account? <Link to="/registration">Sign up</Link> */}
      </Form>
    </div>
  );
};

export default Login;
