import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Error from "../shared/components/FormElements/error";
import styles from "./auth.module.css";

// this.props.location.state.detail.user
const Registration = (props) => {
  const history = useHistory();
  const reg = /^\d{9}/;
  const [teams, setTeams] = useState([]);

  const [registration, setRegistration] = useState({
    email: "",
    pass: "",
    confPass: "",
    id: "",
    name: "",
    surname: "",
    team: "",
    formIsValid: false,
    registerErrors: "",
  });

  const resetStates = () => {
    setRegistration((prevState) => {
      return {
        ...prevState,
        email: "",
        pass: "",
        confPass: "",
        team: "",
        id: "",
        name: "",
        surname: "",
        team: "",
        formIsValid: false,
        registerErrors: "",
      };
    });
  };

  const getTeams = async () => {
    try {
      let response = await Axios.get(`faultManagement/teams`);
      setTeams(response.data);
      setRegistration((prevState) => {
        return {
          ...prevState,
          team: response.data[0].name,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  //check if the form is valid
  useEffect(() => {
    const identifier = setTimeout(() => {
      setRegistration((registration) => {
        return {
          ...registration,
          formIsValid:
            reg.test(registration.id) &&
            registration.id.length === 9 &&
            registration.name.length > 0 &&
            registration.surname.length > 0 &&
            registration.email.includes("@") > 0 &&
            registration.pass.length > 3 &&
            registration.confPass.length > 3 &&
            registration.pass == registration.confPass,
        };
      });
    }, 200);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [
    registration.id,
    registration.name,
    registration.surname,
    registration.email,
    registration.pass,
    registration.confPass,
  ]);

  //clear errors if input changed
  useEffect(() => {
    const identifier = setTimeout(() => {
      if (registration.registerErrors.length > 0) {
        setRegistration((registration) => {
          return { ...registration, registerErrors: "" };
        });
      }
    }, 250);

    return () => {
      clearTimeout(identifier);
    };
  }, [
    registration.id,
    registration.surname,
    registration.name,
    registration.email,
  ]);

  //set error password not match to conf password
  useEffect(() => {
    if (
      registration.confPass.length > 0 &&
      registration.confPass !== registration.pass
    ) {
      setRegistration((registration) => {
        return {
          ...registration,
          registerErrors: "Confirm password not match with password",
        };
      });
    } else {
      setRegistration({ ...registration, registerErrors: "" });
    }
  }, [registration.confPass, registration.pass]);

  const registrationHandler = async (event) => {
    event.preventDefault();
    console.log("registration event");
    Axios.post("/register", {
      id: parseInt(registration.id),
      name: registration.name,
      surname: registration.surname,
      email: registration.email,
      pass: registration.pass,
      team: registration.team,
    })
      .then((response) => {
        console.log(response.data);
        resetStates();
        alert("Registration Succeed");
        // history.replace("/login");
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 400) {
          setRegistration({
            ...registration,
            registerErrors: err.response.data[0].message,
          });
        } else if (err.response.status === 401) {
          setRegistration({
            ...registration,
            registerErrors: err.response.data.msg,
          });
        }
      });
  };

  const ValidPassConfirm = (e) => {
    setRegistration({ ...registration, confPass: e.target.value });
  };

  return (
    <div className={styles["auth"]}>
      <h1 className={styles["auth-header"]}>Sign up</h1>
      <br />
      <Form onSubmit={registrationHandler}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>ID</Form.Label>
          <Form.Control
            autoFocus
            value={registration.id}
            onChange={(e) =>
              setRegistration({ ...registration, id: e.target.value })
            }
          />
        </Form.Group>
        <br />
        <Form.Group size="lg" controlId="email">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={registration.name}
            onChange={(e) =>
              setRegistration({ ...registration, name: e.target.value })
            }
          />
        </Form.Group>
        <br />
        <Form.Group size="lg" controlId="email">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            value={registration.surname}
            onChange={(e) =>
              setRegistration({ ...registration, surname: e.target.value })
            }
          />
        </Form.Group>
        <br />
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={registration.email}
            onChange={(e) =>
              setRegistration({ ...registration, email: e.target.value })
            }
          />
        </Form.Group>
        <br />
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={registration.pass}
            onChange={(e) =>
              setRegistration({ ...registration, pass: e.target.value })
            }
          />
        </Form.Group>
        <br />
        <Form.Group size="lg" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={registration.confPass}
            // onChange={(e) => this.ValidPassConfirm(e)}
            onChange={ValidPassConfirm}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Team Handler</Form.Label>
          <Form.Control
            as="select"
            value={registration.team}
            onChange={(e) => {
              setRegistration((prevState) => {
                return { ...prevState, team: e.target.value };
              });
            }}
          >
            {teams.map((team) => {
              return <option value={team.name}>{team.name}</option>;
            })}
          </Form.Control>
        </Form.Group>
        <br />
        <Button
          block
          size="lg"
          type="submit"
          disabled={!registration.formIsValid}
        >
          Sign up
        </Button>
        <br />
        <br />
        <Error Error={registration.registerErrors} />
        Already have an account? <Link to="/login">Log In</Link>
      </Form>
    </div>
  );
};

export default Registration;
