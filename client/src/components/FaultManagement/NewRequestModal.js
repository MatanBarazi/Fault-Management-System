import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import MessageModal from "../../shared/components/Modals/messageModal";
import styles from "./faultModel.module.css";
import Axios from "axios";
import AuthContext from "../../store/auth-context";
import { capitalizeFirstLetter,defaultFilter } from "../../utils/functions";

const NewRequestModal = (props) => {
  const [request, setRequest] = useState({
    number: props.number,
    team: props.team,
    note: "",
    status: "New",
    urgencyLevel: props.urgencyLevel,
  });

  const authCtx = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [serial, setSerial] = useState("");
  const [model, setModel] = useState("");
  const [serialIsValid, setSerialIsValid] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleCloseMessage = () => {
    setShowCreatedMessage(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const resetStates = () => {
    setRequest((prevState) => {
      return {
        number: props.number,
        team: props.team,
        note: "",
        status: "New",
      };
    });
    setProducts([]);
    setModel("");
    setSerial("");
    setSerialIsValid(false);
  };

  const faultUpdateActivity = () => {
    let Activity = {};
    Activity.date = new Date();
    Activity.user = `${capitalizeFirstLetter(
      authCtx.user.name
    )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
    Activity.id = authCtx.user.id.toString();
    Activity.action = "Component request has been created";
    Activity.data = `\t-Status: Waiting for component\\s\n\t`;
    Activity.data += `-Request handler team: ${request.team}\n\t`;
    Activity.data += `-Requested component\\s:\n\t\t`;
    products.map((product) => {
      Activity.data += `Serial No.: ${product.serialNumber}\tModel: ${product.name} ${product.type}\n\t\t`;
    });
    return Activity;
  };

  const requestCreatedActivity = () => {
    let Activity = {};
    Activity.date = new Date();
    Activity.user = `${capitalizeFirstLetter(
      authCtx.user.name
    )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
    Activity.id = authCtx.user.id.toString();
    Activity.action = "Created";
    Activity.data = `\t-Handler Team: ${
      request.team
    }\n\t-Status: In treatment\n\t-Urgency level: ${request.urgencyLevel}\n\t`;
    if(request.note !== "")
      Activity.data+= `-Note: ${request.note}\n\t`
    Activity.data += `-Requested component\\s:\n\t\t`;
    products.map((product) => {
      Activity.data += `Serial No.: ${product.serialNumber}\tModel: ${product.name} ${product.type}\n\t\t`;
    });
    return Activity;
  };

  const submitNewRequest = async (e) => {
    try {
      e.preventDefault();
      setSavingForm(true);
      let faultActivity = faultUpdateActivity();
      let requestActivity = requestCreatedActivity();
      await Axios.post(`faultManagement/NewRequest`, {
        number: request.number,
        status: "In treatment",
        team: request.team,
        teamMemberID: null,
        products: products,
        note: request.note,
        urgencyLevel:request.urgencyLevel,
        activity: requestActivity,
      });
      await Axios.patch(`/faultManagement/updateFault`, {
        number: request.number,
        updates: ["request", "status", "activity"],
        values: [true, "Waiting for component", faultActivity],
      });
      let response = await Axios.get("/faultManagement");
      props.updateFaults(defaultFilter(response.data,authCtx.user.team));
      handleClose();
      resetStates();
      setSavingForm(false);
      setShowCreatedMessage(true);
    } catch (err) {
      console.log(err);
    }
  };

  const serial_handler = (e) => {
    let value = e.target.value;
    setSerial(value);
    setSerialIsValid(false);
    setModel("");
    let product = props.products.find(
      (product) => product.serialNumber === value
    );
    if (product) {
      setModel(`${product.name} ${product.type}`);
      setSerialIsValid(true);
    }
  };

  const add_serial = () => {
    let copyArr = products.slice();
    let [product] = props.products.filter(
      (product) => product.serialNumber === serial
    );
    if (product) {
      copyArr.push(product);
      setProducts([...copyArr]);
      setSerial("");
      setModel("");
      setSerialIsValid(false);
    }
  };

  const remove_serial = (index) => {
    let copyArr = products.slice();
    copyArr.splice(index, 1);
    console.log(index);
    console.log(copyArr);
    setProducts([...copyArr]);
  };

  return (
    <>
      <button className="button" disabled={props.request}>
        <a
          href="#requestModal"
          className={`request ${props.request && "invalid"}`}
          data-toggle="modal"
        >
          {props.request ? (
            <i
              className="material-icons icon-blue "
              onClick={handleOpen}
              data-toggle="tooltip"
              title="Component request sent"
            >
              <strong style={{ fontFamily: "none" }}>Sent</strong>
              <span style={{ fontSize: "21px" }}>grading</span>
            </i>
          ) : (
            <i
              className="material-icons icon-blue "
              onClick={handleOpen}
              data-toggle="tooltip"
              title="Component request"
            >
              <>
                <strong style={{ fontFamily: "none" }}>Request</strong>
                <span style={{ fontSize: "21px" }}>note_add</span>
              </>
            </i>
          )}
          {/* &#xE254; */}
          {/* <span style={{ fontSize: "21px" }}>note_add</span> */}
        </a>
      </button>

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
              <strong>New Component Request</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitNewRequest}>
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
              {/* <Form.Group as={Col}>
                <Form.Label>
                  <strong>Urgency level</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={fault.urgency}
                  as="select"
                  onChange={(e) => {
                    urgencyHandler(e, setFault);
                  }}
                >
                  <>
                    <option value={"Low"}>Low</option>
                    <option value={"Regular"}>Regular</option>
                    <option value={"High"}>Urgent</option>
                  </>
                </Form.Control>
              </Form.Group> */}
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>No.</strong>
                </Form.Label>
                <Form.Control type="text" value={request.number} readOnly />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Status</strong>
                </Form.Label>
                <Form.Control type="text" value={request.status} readOnly />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Urgency Level</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={request.urgencyLevel}
                  readOnly
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Products Serial No.</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={serial}
                  onChange={serial_handler}
                  style={{ width: "193px" }}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} style={{ marginRight: "50px" }}>
                <Form.Label>
                  <strong>Model</strong>
                </Form.Label>
                <Form.Control
                  style={{ width: "194px" }}
                  type="text"
                  value={model}
                  readOnly
                />
              </Form.Group>
            </Row>
            {products.map((product, index) => {
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
                  <a
                    href="#removeSerial"
                    className={styles.remove_serial}
                    data-toggle="modal"
                    onClick={() => {
                      remove_serial(index);
                    }}
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
                  </a>
                </Row>
              );
            })}
            <Row className="mb-3">
              <Form.Group>
                <Button
                  className={`button ${styles.add_serial}`}
                  disabled={!serialIsValid}
                  onClick={add_serial}
                >
                  <i
                    className="material-icons icon-blue "
                    data-toggle="tooltip"
                    title="add serial"
                  >
                    <strong style={{ fontFamily: "none", fontSize: "20px" }}>
                      Add S.N.{" "}
                    </strong>

                    <span style={{ fontSize: "21px" }}>control_point</span>
                  </i>
                  {/* <a href="#addSerial" data-toggle="modal">
                    <i
                      className="material-icons icon-blue"
                      data-toggle="tooltip"
                      title="add serial"
                    >
                      <strong style={{ fontFamily: "none", fontSize: "20px" }}>
                        Add S.N.{" "}
                      </strong>

                      <span style={{ fontSize: "21px" }}>control_point</span>
                    </i>
                  </a> */}
                </Button>
              </Form.Group>
            </Row>

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
                disabled={products.length === 0}
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

      <MessageModal
        show={showCreatedMessage}
        handleClose={handleCloseMessage}
        header="Component Request has created!"
        type="fault"
      >
        <Form.Group>
          <Form.Label>
            <h4>
              <strong>Request No. : </strong>
              {request.number}
              {}
            </h4>
          </Form.Label>
        </Form.Group>
      </MessageModal>
    </>
  );
};

export default NewRequestModal;
