import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import CostumButton from "../../../shared/components/FormElements/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Error from "../../../shared/components/FormElements/error";
import MessageModal from "../../../shared/components/Modals/messageModal";
import AuthContext from "../../../store/auth-context";
import styles from "./CreateNewUserModal.module.css";
import Axios from "axios";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { ImFilter } from "react-icons/im";


const CreateNewUserModal = (props) => {
  const reg = /^\d{9}/;
  const [savingForm, setSavingForm] = useState(false);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [formIsValid, setFormIsValid] = useState(true);
  const [teams, setTeams] = useState([]);
  const authCtx = useContext(AuthContext);

  const [user, setUser] = useState({
    id: "",
    name: "",
    surname: "",
    email: "",
    role: "regular",
    gender: "male",
    team: "Customer service",
    pass: "",
    confPass: "",
  });

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleCloseMassage = () => {
    setShowCreatedMessage(false);
  };

  const resetStates = () => {
    setUser((prevState) => {
      return {
        id: "",
        name: "",
        surname: "",
        email: "",
        role: "regular",
        gender: "male",
        team: "Customer service",
        pass: "",
        confPass: "",
      };
    });
  };

  const getTeams = async () => {
    try {
      let response = await Axios.get(`faultManagement/teams`);
      setTeams(response.data);
      setUser((prevState) => {
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

  const submitNewUser = (e) => {
    e.preventDefault();
    setSavingForm(true);
    Axios.post(`users/createNewUser`, {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      gender: user.gender,
      team: user.team,
      pass: user.pass,
    })
      .then((response) => {
        console.log(response.data);
        props.updateUsers(response.data);
        handleClose();
        setSavingForm(false);
        setShowCreatedMessage(true);
        resetStates();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.msg);
        setSavingForm(false);
      });
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setFormIsValid(() => {
        return (
          reg.test(user.id) &&
          user.id.length === 9 &&
          user.name.length > 0 &&
          user.surname.length > 0 &&
          user.email.includes("@") > 0 &&
          user.pass.length > 3 &&
          user.pass === user.confPass
        );
      });
    }, 250);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [user.id, user.name, user.surname, user.email, user.pass, user.confPass]);

  return (
    <>
      <CostumButton
        style={{ width: "200px", height: "50px" }}
        title="create new user"
        color="blue"
        onClick={handleOpen}
      >
        <strong>Create New User</strong>{" "}
        <BsFillPersonPlusFill style={{ marginBottom: "2px" }} />
      </CostumButton>

      {/* <a
        onClick={handleOpen}
        className={`btn ${styleBtn.btn} `}
        data-toggle="modal"
        style={{ fontSize: "24px", borderRadius: "6px", fontWeight: "600" }}
        title="create new user"
      >
        <i style={{ marginTop: "4px" }} className="material-icons">
          &#xE147;
        </i>{" "}
        <span> Create New User</span>
      </a> */}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={styles["modal"]}
        contentClassName={styles["modal-content"]}
      >
        {/* closeButton */}
        <Modal.Header className={styles["modal-header"]}>
          <Modal.Title>
            <h3>
              <strong>Create New User</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitNewUser}>
          <Modal.Body className={styles["modal-body"]}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>ID<span style={{ color: "orange" }}> *</span></strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={user.id}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        id: e.target.value,
                      };
                    });
                  }}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Name<span style={{ color: "orange" }}> *</span></strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={user.name}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        name: e.target.value,
                      };
                    });
                  }}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Surname<span style={{ color: "orange" }}> *</span></strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={user.surname}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        surname: e.target.value,
                      };
                    });
                  }}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Role</strong>
                </Form.Label>
                {authCtx.user.role === "system administrator" ? (
                  <Form.Control
                    type="text"
                    value={user.role}
                    as="select"
                    onChange={(e) => {
                      setUser((prevState) => {
                        return {
                          ...prevState,
                          role: e.target.value,
                        };
                      });
                    }}
                  >
                    <>
                      <option value={"regular"}>Regular</option>
                      <option value={"team leader"}>Team Leader</option>
                    </>
                  </Form.Control>
                ) : (
                  <Form.Control type="text" value="Regular" readOnly />
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Team</strong>
                </Form.Label>
                {authCtx.user.role === "system administrator" ? (
                  <Form.Control
                    as="select"
                    value={user.team}
                    onChange={(e) => {
                      setUser((prevState) => {
                        return {
                          ...prevState,
                          team: e.target.value,
                        };
                      });
                    }}
                  >
                    {teams.map((team) => {
                      return <option value={team.name}>{team.name}</option>;
                    })}
                  </Form.Control>
                ) : (
                  // team leader case
                  <Form.Control
                    value={user.team}
                    readOnly
                    onChange={(e) => {
                      setUser((prevState) => {
                        return {
                          ...prevState,
                          team: authCtx.user.team,
                        };
                      });
                    }}
                  />
                )}
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Gender</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={user.gender}
                  as="select"
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        gender: e.target.value,
                      };
                    });
                  }}
                >
                  <>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                  </>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Email<span style={{ color: "orange" }}> *</span></strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={user.email}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        email: e.target.value,
                      };
                    });
                  }}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Password<span style={{ color: "orange" }}> *</span></strong>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={user.newPassword}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        pass: e.target.value,
                      };
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Confirm Password<span style={{ color: "orange" }}> *</span></strong>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={user.newPassword}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        confPass: e.target.value,
                      };
                    });
                  }}
                />
              </Form.Group>
            </Row>

            <br />
            {/* <Form.Control
                autoFocus
            /> */}
          </Modal.Body>

          <Error Error={errorMessage} />

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                handleClose();
                resetStates();
              }}
              disabled={savingForm}
            >
              Close
            </Button>
            {!savingForm ? (
              <Button variant="primary" type="submit" disabled={!formIsValid}>
                Create
              </Button>
            ) : (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span> Creating...</span>
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>

      <MessageModal
        show={showCreatedMessage}
        handleClose={handleCloseMassage}
        header="User has been created!"
      >
        <Form.Group>
          <Form.Label>
            <h4>
              <strong>
                {`The user ${user.email} has been creacted successfully!`}
              </strong>
            </h4>
          </Form.Label>
        </Form.Group>
      </MessageModal>
    </>
  );
};

export default CreateNewUserModal;
