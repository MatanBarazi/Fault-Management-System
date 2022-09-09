import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import EditButton from "../../../../shared/components/FormElements/Button";
import { MdModeEdit } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styles from "./UserModal.module.css";
import Axios from "axios";
import Error from "../../../../shared/components/FormElements/error";

const EditUserModal = (props) => {
  const reg = /^\d{9}/;
  const [formIsValid, setFormIsValid] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({
    id: props.user.id.toString(),
    name: props.user.name,
    surname: props.user.surname,
    email: props.user.email,
    team: props.user.team,
    newPassword: "",
  });

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const resetStates = () => {
    setUser(() => {
      return {
        id: props.user.id.toString(),
        name: props.user.name,
        surname: props.user.surname,
        email: props.user.email,
        team: props.user.team,
        newPassword: "",
      };
    });
  };

  const submitSaveUser = (e) => {
    e.preventDefault();
    setSavingForm(true);
    Axios.post(`users/editUserDetails`, {
      _id: props.user._id,
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      newPassword: user.newPassword,
    })
      .then((response) => {
        props.updateUsers(response.data);
        handleClose();
        setSavingForm(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.msg);
        setSavingForm(false);
      });
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      setErrorMessage("");
      setFormIsValid(() => {
        return (
          reg.test(user.id) &&
          user.id.length === 9 &&
          user.name.length > 0 &&
          user.surname.length > 0 &&
          user.email.includes("@") > 0 &&
          (user.newPassword.length > 3 || user.newPassword.length === 0) &&
          (user.id !== props.user.id.toString() ||
            user.name !== props.user.name ||
            user.surname != props.user.surname ||
            user.email != props.user.email||
            user.newPassword!="")
        );
      });
    }, 200);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [user.id, user.name, user.surname, user.email, user.newPassword]);

  return (
    <>
      <EditButton
        title="edit"
        type="submit"
        color="yellow"
        onClick={handleOpen}
      >
        <strong>Edit</strong>{" "}
        <MdModeEdit style={{ marginBottom: "5px" }}  />
      </EditButton>

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
              <strong>Edit User</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitSaveUser}>
          <Modal.Body className={styles["modal-body"]}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>ID</strong>
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
                  <strong>Name</strong>
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
                  <strong>Surname</strong>
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
                  <strong>Team</strong>
                </Form.Label>
                <Form.Control type="text" value={user.team} readOnly />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Email</strong>
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
                  <strong>New Password</strong>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={user.newPassword}
                  onChange={(e) => {
                    setUser((prevState) => {
                      return {
                        ...prevState,
                        newPassword: e.target.value,
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
                Save
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
                <span> Saving...</span>
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditUserModal;
