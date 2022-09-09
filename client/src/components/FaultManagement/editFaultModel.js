import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import AuthContext from "../../store/auth-context";
import Spinner from "react-bootstrap/Spinner";
import styles from "./faultModel.module.css";
import Axios from "axios";
import {
  clientIdHandler,
  teamMemberIdHandler,
  teamHandler,
  displayDate,
  urgencyHandler,
  capitalizeFirstLetter,
  modifiedActivity,
  defaultFilter,
} from "../../utils/functions";

const EditFaultModel = (props) => {
  const [fault, setFault] = useState({
    number: props.fault.number,
    status: props.fault.status,
    team: props.fault.team,
    description: props.fault.description,
    urgencyLevel: props.fault.urgencyLevel,
    teams: [],
    formIsValid: false,
    activity: props.fault.activity,
  });
  const [client, setClient] = useState({
    id: props.fault.clientID,
    name: props.fault.clientName,
    surname: props.fault.clientSurname,
    phone: props.fault.clientPhoneNumber,
    idIsValid: true,
  });
  const [teamMember, setTeamMember] = useState({
    id:
      props.fault.teamMemberID === null
        ? ""
        : props.fault.teamMemberID.toString(),
    name: props.fault.teamMemberName,
    surname: props.fault.teamMemberSurname,
    idIsValid: props.fault.teamMemberID === null ? false : true,
  });
  let Activity = {
    user: "",
    id: "",
    action: "",
    data: "",
  };
  const authCtx = useContext(AuthContext);
  const [savingForm, setSavingForm] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const resetStates = () => {
    setFault((prevState) => {
      return {
        ...prevState,
        number: props.fault.number,
        description: props.fault.description,
        team: props.fault.team,
        formIsValid: false,
        urgencyLevel: props.fault.urgencyLevel,
        activity: props.fault.activity,
      };
    });
    setClient((prevState) => {
      return {
        id: props.fault.clientID,
        name: props.fault.clientName,
        surname: props.fault.clientSurname,
        phone: props.fault.clientPhoneNumber,
        idIsValid: true,
      };
    });
    console.log(props.fault.teamMemberID);
    setTeamMember((prevState) => {
      return {
        id:
          props.fault.teamMemberID == null
            ? ""
            : props.fault.teamMemberID.toString(),
        name: props.fault.teamMemberName,
        surname: props.fault.teamMemberSurname,
        idIsValid: props.fault.teamMemberID === null ? false : true,
      };
    });
  };

  const submitSaveFault = (e) => {
    e.preventDefault();
    setSavingForm(true);
    modifiedActivity(authCtx, props, fault, client, teamMember, Activity);
    Axios.post(`faultManagement/EditFaultModel`, {
      _id: props.fault._id,
      number: parseInt(fault.number),
      status: fault.status,
      clientID: parseInt(client.id),
      team: fault.team,
      teamMemberID: parseInt(teamMember.id),
      urgencyLevel: fault.urgencyLevel,
      description: fault.description,
      activity: [...props.fault.activity, Activity],
    })
      .then((response) => {
        props.updateFaults(defaultFilter(response.data, authCtx.user.team));
        handleClose();
        setSavingForm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // order teams that team handler first in the array
  const orderTeamsByTeamHandler = () => {
    let temp;
    let orderTeams = props.teams.filter((team) => {
      if (team.name === fault.team) {
        temp = team;
      }
      return team.name !== fault.team;
    });
    orderTeams.unshift(temp);
    setFault((prevState) => {
      return {
        ...prevState,
        teams: orderTeams,
      };
    });
  };

  useEffect(() => {
    orderTeamsByTeamHandler();
  }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setFault((prevState) => {
        return {
          ...prevState,
          formIsValid:
            fault.description.length > 0 &&
            client.idIsValid &&
            (teamMember.idIsValid ||
              teamMember.id === null ||
              teamMember.id.length === 0) &&
            (fault.description !== props.fault.description ||
              String(client.id) !== String(props.fault.clientID) ||
              teamMember.id !==
                (props.fault.teamMemberID == null
                  ? ""
                  : props.fault.teamMemberID.toString()) ||
              fault.urgencyLevel !== props.fault.urgencyLevel),
        };
      });
    }, 250);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [fault.description, fault.urgencyLevel, client.id, teamMember.id]);

  return (
    <>
      <button
        className="button"
        disabled={authCtx.user.team !== fault.team}
        onClick={handleOpen}
      >
        <a
          href="#editModal"
          className={`edit ${authCtx.user.team !== fault.team && "invalid"}`}
          data-toggle="modal"
        >
          <i
            className="material-icons icon-blue "
            data-toggle="tooltip"
            title="Edit"
          >
            <strong style={{ fontFamily: "none" }}>Edit </strong>
            {/* &#xE254; */}
            <span style={{ fontSize: "20px" }}>mode</span>
          </i>
        </a>
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={styles["modal"]}
        dialogClassName={styles["modal-dialog"]}
        contentClassName={styles["modal-content"]}
      >
        {/* closeButton */}
        <Modal.Header className={styles["modal-header"]}>
          <Modal.Title>
            <h3>
              <strong>Edit Fault</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitSaveFault}>
          <Modal.Body className={styles["modal-body"]}>
            <Row>
              <Form.Group as={Col} className={styles["form-group-sub-title"]}>
                <Form.Label style={{ textDecoration: "underline" }}>
                  <h4>
                    <strong>Client details</strong>
                    {/*--------------Client Details----------------*/}
                  </h4>
                </Form.Label>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Client ID</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={client.id}
                  onChange={(e) => {
                    clientIdHandler(e, setClient, props);
                  }}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Client name</strong>
                </Form.Label>
                {client.idIsValid ? (
                  <Form.Control
                    type="text"
                    value={client.name + ", " + client.surname}
                    readOnly
                  />
                ) : (
                  <Form.Control value="" type="text" readOnly />
                )}
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Phone</strong>
                </Form.Label>
                {client.idIsValid ? (
                  <Form.Control type="text" value={client.phone} readOnly />
                ) : (
                  <Form.Control value="" type="text" readOnly />
                )}
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} className={styles["form-group-sub-title"]}>
                <Form.Label
                  style={{ textDecoration: "underline", textAlign: "center" }}
                >
                  <h4>
                    <strong>Handler details</strong>
                    {/*--------------Handler Details----------------*/}
                  </h4>
                </Form.Label>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Team</strong>
                </Form.Label>
                <Form.Control
                  value={fault.team}
                  onChange={(e) => {
                    teamHandler(e, setFault, setTeamMember);
                  }}
                  readOnly
                />

                {/* {fault.teams.map((team) => {
                    return (
                      <option key={team._id} value={team.name}>
                        {team.name}
                      </option>
                    );
                  })} */}
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Team member name</strong>
                </Form.Label>
                {teamMember.idIsValid ? (
                  <Form.Control
                    type="text"
                    value={teamMember.name + ", " + teamMember.surname}
                    readOnly
                  />
                ) : (
                  <Form.Control value="" type="text" readOnly />
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Team member ID</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={teamMember.id}
                  onChange={(e) => {
                    teamMemberIdHandler(e, fault.team, setTeamMember, props);
                  }}
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} className={styles["form-group-sub-title"]}>
                <Form.Label
                  style={{ textDecoration: "underline", textAlign: "center" }}
                >
                  <h4>
                    <strong>Fault details</strong>
                    {/*--------------Fault Details----------------*/}
                  </h4>
                </Form.Label>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>No.</strong>
                </Form.Label>
                <Form.Control type="text" value={fault.number} readOnly />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Urgency level</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={fault.urgencyLevel}
                  as="select"
                  onChange={(e) => {
                    urgencyHandler(e, setFault);
                  }}
                >
                  <>
                    <option value={"Low"}>Low</option>
                    <option value={"Normal"}>Normal</option>
                    <option value={"High"}>High</option>
                  </>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Status</strong>
                </Form.Label>
                <Form.Control type="text" value={fault.status} readOnly />
              </Form.Group>
            </Row>

            <Form.Group size="lg" controlId="email">
              <Form.Label>
                <strong>Activity </strong>
              </Form.Label>
              <br />
              <Card>
                <Card.Body style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {props.fault.activity.map((activity, pos) => {
                    return (
                      <React.Fragment key={pos}>
                        <Card.Title>
                          <strong>
                            {activity.action} by {activity.user} ({activity.id})
                            - {displayDate(activity.date)}
                          </strong>
                        </Card.Title>
                        <Card.Text style={{ whiteSpace: "pre" }}>
                          {activity.data}
                        </Card.Text>
                      </React.Fragment>
                    );
                  })}
                </Card.Body>
              </Card>
            </Form.Group>

            <Form.Group size="lg" controlId="email">
              <Form.Label>
                <strong>Description </strong>
              </Form.Label>
              <br />
              <Form.Control
                as="textarea"
                value={fault.description}
                onChange={(e) =>
                  setFault((prevState) => {
                    return { ...prevState, description: e.target.value };
                  })
                }
                style={{ width: "100%", height: "200px" }}
              />
            </Form.Group>

            <br />
            {/* <Form.Control
                autoFocus
            /> */}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                handleClose();

                resetStates();
              }}
              disabled={fault.savingForm}
            >
              Close
            </Button>
            {!savingForm ? (
              <Button
                variant="primary"
                type="submit"
                disabled={!fault.formIsValid}
              >
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

export default EditFaultModel;
