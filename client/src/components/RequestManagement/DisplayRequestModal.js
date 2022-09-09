import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import styles from "./RequestModal.module.css";
import AuthContext from "../../store/auth-context";
import Axios from "axios";
import {
  teamMemberIdHandler,
  displayDate,
  capitalizeFirstLetter,
  urgencyHandler,defaultFilter
} from "../../utils/functions";

const DisplayRequestModal = (props) => {
  const [request, setRequest] = useState({
    number: props.request.number,
    team: props.request.team,
    note: props.request.note,
    products: props.request.products,
    status: props.request.status,
    urgencyLevel: props.request.urgencyLevel,
    formIsValid: false,
  });
  const [teamMember, setTeamMember] = useState({
    id:
      props.request.teamMemberID == null
        ? ""
        : props.request.teamMemberID.toString(),
    name: props.request.teamMemberName,
    surname: props.request.teamMemberSurname,
    idIsValid: props.request.teamMemberID === null ? false : true,
  });
  const authCtx = useContext(AuthContext);
  const [savingForm, setSavingForm] = useState(false);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const resetStates = () => {
    setRequest((prevState) => {
      return {
        number: props.request.number,
        team: props.request.team,
        note: props.request.note,
        products: props.request.products,
        status: props.request.status,
        urgencyLevel: props.request.urgencyLevel,
      };
    });
    setTeamMember((prevState) => {
      return {
        id:
          props.request.teamMemberID === null
            ? ""
            : props.request.teamMemberID.toString(),
        name: props.request.teamMemberName,
        surname: props.request.teamMemberSurname,
        idIsValid: props.request.teamMemberID === null ? false : true,
      };
    });
  };

  const modifiedActivity = () => {
    let Activity = {};
    Activity.date = new Date();
    Activity.user = `${capitalizeFirstLetter(
      authCtx.user.name
    )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
    Activity.id = authCtx.user.id.toString();
    Activity.action = "Modified";
    Activity.data = `\t`;
    if (request.team !== props.request.team)
      Activity.data += `-Handler Team: ${request.team}\n\t`;
    if (request.status !== props.request.status)
      Activity.data += `-Status: ${request.status}\n\t`;
    if (
      teamMember.id !==
      (props.request.teamMemberID == null
        ? ""
        : props.request.teamMemberID.toString())
    ) {
      if (props.request.teamMemberID === null) {
        Activity.data += `+Handler Team ID: ${teamMember.id}\n\t`;
        Activity.data += `+Handler Team Member: ${teamMember.name} ${teamMember.surname}\n\t`;
      } else if (teamMember.id === "") {
        Activity.data += `-Handler Team Member is been removed.\n\t`;
      } else {
        Activity.data += `-Handler Team ID: ${teamMember.id}\n\t`;
        Activity.data += `-Handler Team Member: ${teamMember.name} ${teamMember.surname}\n\t`;
      }
    }
    if (request.urgencyLevel !== props.request.urgencyLevel)
      Activity.data += `-Urgency level: ${request.urgencyLevel}\n\t`;
    if (request.note !== props.request.note)
      Activity.data += `-Note: ${request.note}\n\t`;
    return Activity;
  };

  const submitSaveRequest = async (e) => {
    try {
      e.preventDefault();
      setSavingForm(true);
      let activity = modifiedActivity();
      await Axios.post(`requestManagement/EditRequestModal`, {
        _id: props.request._id,
        number: parseInt(request.number),
        status: request.status,
        team: request.team,
        teamMemberID: parseInt(teamMember.id),
        note: request.note,
        urgencyLevel: request.urgencyLevel,
        activity: [...props.request.activity, activity],
      });
      let response = await Axios.get("/requestManagement");
      props.updateRequests(defaultFilter(response.data,authCtx.user.team));
      handleClose();
      setSavingForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setRequest((prevState) => {
        return {
          ...prevState,
          formIsValid:
            (teamMember.idIsValid ||
              teamMember.id === null ||
              teamMember.id.length === 0) &&
            (request.note !== props.request.note ||
              teamMember.id !==
                (props.request.teamMemberID == null
                  ? ""
                  : props.request.teamMemberID.toString()) ||
              request.urgencyLevel !== props.request.urgencyLevel),
        };
      });
    }, 250);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [request.note,request.urgencyLevel, teamMember.id]);

  return (
    <>
      <button className="button" onClick={handleOpen}>
        <a href="#DisplayModal" className="display" data-toggle="modal">
          <i
            className="material-icons icon-blue "
            data-toggle="tooltip"
            title="Display"
          >
            <strong style={{ fontFamily: "none" }}>Display </strong>
            {/* &#xE254; */}
            <span style={{ fontSize: "20px" }}>visibility</span>
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
              <strong>Display</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitSaveRequest}>
          <Modal.Body className={styles["modal-body"]}>
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
                <Form.Control value={request.team} readOnly />
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
                    teamMemberIdHandler(e, request.team, setTeamMember, props);
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
                    <strong>Request details</strong>
                    {/*--------------Request Details----------------*/}
                  </h4>
                </Form.Label>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>No.</strong>
                </Form.Label>
                <Form.Control type="text" value={request.number} readOnly />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Urgency level</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={request.urgencyLevel}
                  as="select"
                  onChange={(e) => {
                    urgencyHandler(e, setRequest);
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
                <Form.Control type="text" value={request.status} readOnly />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Products Serial No.</strong>
                </Form.Label>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>model</strong>
                </Form.Label>
              </Form.Group>
            </Row>
            {request.products.map((product, index) => {
              return (
                <Row className="mb-3" key={index}>
                  <Form.Group as={Col}>
                    <Form.Control
                      type="text"
                      value={product.serialNumber}
                      readOnly
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Control
                      type="text"
                      value={`${product.name} ${product.type}`}
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                  {/* <a
                    href="#removeSerial"
                    className={styles.remove_serial}
                    data-toggle="modal"
                  >
                    <i
                      className="material-icons icon-blue "
                      data-toggle="tooltip"
                      title="remove serial"
                      style={{ margin: "4px" }}
                    >
                      <span style={{ fontSize: "21px" }}>
                        remove_circle_outline
                      </span>
                    </i>
                  </a> */}
                </Row>
              );
            })}

            <Form.Group size="lg" controlId="email">
              <Form.Label>
                <strong>Activity </strong>
              </Form.Label>
              <br />
              <Card>
                <Card.Body style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {props.request.activity.map((activity, pos) => {
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

            <Form.Group size="sm" controlId="email">
              <Form.Label>
                <strong>Note </strong>
              </Form.Label>
              <br />
              <Form.Control
                as="textarea"
                rows={1}
                value={request.note}
                onChange={(e) =>
                  setRequest((prevState) => {
                    return { ...prevState, note: e.target.value };
                  })
                }
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
              disabled={request.savingForm}
            >
              Close
            </Button>
            {!savingForm ? (
              <Button
                variant="primary"
                type="submit"
                disabled={!request.formIsValid}
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

export default DisplayRequestModal;
