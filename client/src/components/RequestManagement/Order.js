import React, { useContext, useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import MessageModal from "../../shared/components/Modals/messageModal";
import styles from "./RequestModal.module.css";
import AuthContext from "../../store/auth-context";
import { send } from "emailjs-com";
import Axios from "axios";
import {
  teamMemberIdHandler,
  displayDate,
  capitalizeFirstLetter,
  urgencyHandler,
  defaultFilter,
} from "../../utils/functions";

const Order = (props) => {
  const [request, setRequest] = useState({
    number: props.request.number,
    team: props.team,
    note: "",
    status: "New",
    urgencyLevel: props.request.urgencyLevel,
  });

  const [toSend, setToSend] = useState({
    from_name: "Purchase team",
    to_email: "webappsce@gmail.com",
    message: "",
    to_name: "",
    reply_to: "",
  });
  const authCtx = useContext(AuthContext);
  const [choosenProducts, setChoosenProducts] = useState(
    props.request.products
  );
  const [notChoosenProducts, setNotChoosenProducts] = useState([]);
  const [serial, setSerial] = useState("");
  const [model, setModel] = useState("");
  const [serialIsValid, setSerialIsValid] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const [show, setShow] = useState(false);
  const form = useRef();

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
        number: props.request.number,
        team: props.team,
        note: "",
        status: "New",
        urgencyLevel: props.request.urgencyLevel,
      };
    });
    setToSend((prevState) => {
      return {
        from_name: "Purchase team",
        to_email: "webappsce@gmail.com",
        message: "",
        to_name: "",
        reply_to: "",
      };
    });
    setChoosenProducts(props.request.products);
    setNotChoosenProducts([]);
    setModel("");
    setSerial("");
    setSerialIsValid(false);
  };

  const OrderActivity = () => {
    let Activity = {};
    Activity.date = new Date();
    Activity.user = `${capitalizeFirstLetter(
      authCtx.user.name
    )} ${capitalizeFirstLetter(authCtx.user.surname)}`;
    Activity.id = authCtx.user.id.toString();
    Activity.action = "Component order has been sent";
    Activity.data = `\t-Status: Waiting for component order\\s\n\t`;
    Activity.data += `-Order components\\s:\n\t\t`;
    choosenProducts.map((product) => {
      Activity.data += `Serial No.: ${product.serialNumber}\tModel: ${product.name} ${product.type}\n\t`;
    });
    return Activity;
  };

  const createOrderComponentsDetails = () => {
    let orderComponent = "<h3>Order components:</h3>";
    orderComponent += "<ul>";
    choosenProducts.map((product) => {
      orderComponent += `<li> Serial No.: ${product.serialNumber} , Model: ${product.name} ${product.type} </li>`;
    });
    orderComponent += "</ul>";
    return orderComponent;
  };

  const sendEmail = async (e) => {
    try {
      e.preventDefault();
      setSavingForm(true);
      let orderDetails = createOrderComponentsDetails();
      await send(
        "service_nufcz9l",
        "template_dbvv02n",
        { ...toSend, orderDetails: orderDetails },
        "HNGMfPAmoequ8VK_l"
      );
      let orderActivity = OrderActivity();
      await Axios.patch(`/requestManagement/updatePurchaseRequest`, {
        number: request.number,
        updates: ["existPurchaseRequest", "status", "activity"],
        values: [true, "Waiting for component order", orderActivity],
      });
      let response = await Axios.get("/arrays/purchaseRequests");
      props.updateRequests(defaultFilter(response.data,authCtx.user.team));
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
    let product = notChoosenProducts.find(
      (product) => product.serialNumber === value
    );
    if (product) {
      setModel(`${product.name} ${product.type}`);
      setSerialIsValid(true);
    }
  };

  const add_serial = () => {
    let copyChoosenProducts = choosenProducts.slice();
    let index = notChoosenProducts.findIndex(
      (product) => product.serialNumber === serial
    );
    let product = notChoosenProducts[index];
    // let [product] = notChoosenProducts.filter(
    //   (product) => product.serialNumber === serial
    // );

    if (product) {
      let copyNotChoosenProducts = notChoosenProducts.slice();
      copyNotChoosenProducts.splice(index, 1);
      setNotChoosenProducts(copyNotChoosenProducts);
      copyChoosenProducts.push(product);
      setChoosenProducts([...copyChoosenProducts]);
      setSerial("");
      setModel("");
      setSerialIsValid(false);
    }
  };

  const remove_serial = (index) => {
    let copyChoosenProducts = choosenProducts.slice();
    let copyNotChoosenProducts = notChoosenProducts.slice();
    copyNotChoosenProducts.push(copyChoosenProducts[index]);
    setNotChoosenProducts(copyNotChoosenProducts);
    copyChoosenProducts.splice(index, 1);
    setChoosenProducts([...copyChoosenProducts]);
  };

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <>
      <button
        className="button"
        onClick={handleOpen}
        disabled={props.request.existPurchaseRequest}
      >
        <a
          href="#requestModal"
          className={`purchase_request ${
            props.request.existPurchaseRequest && "invalid"
          }`}
          data-toggle="modal"
        >
          {props.request.existPurchaseRequest ? (
            <i
              className="material-icons icon-blue "
              data-toggle="tooltip"
              title="Component\s is been ordered"
            >
              <strong style={{ fontFamily: "none" }}>Sent</strong>
              <span style={{ fontSize: "21px" }}>grading</span>
            </i>
          ) : (
            <i
              className="material-icons icon-blue "
              onClick={handleOpen}
              data-toggle="tooltip"
              title="Order"
            >
              <>
                <strong style={{ fontFamily: "none" }}>Order</strong>
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
              <strong>Order Form</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Form ref={form} onSubmit={sendEmail}>
          <Modal.Body className={styles["modal-body"]}>
            <br />
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Products Serial No.</strong>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={serial}
                  onChange={serial_handler}
                  style={{ width: "194px" }}
                >
                  <option value="none" selected hidden>
                    Select Serial No.
                  </option>
                  {notChoosenProducts.map((product) => {
                    return (
                      <option key={product._id} value={product.serialNumber}>
                        {product.serialNumber}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} style={{ marginRight: "50px" }}>
                <Form.Label>
                  <strong>model</strong>
                </Form.Label>
                <Form.Control
                  style={{ width: "194px" }}
                  type="text"
                  value={model}
                  readOnly
                />
              </Form.Group>
            </Row>

            {choosenProducts.map((product, index) => {
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
                </Button>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Name</strong>
                </Form.Label>
                <Form.Control
                  value={toSend.from_name}
                  onChange={handleChange}
                  name="from_name"
                  placeholder="email sender name"
                  type="text"
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Email</strong>
                </Form.Label>
                <Form.Control
                  value={toSend.to_email}
                  onChange={handleChange}
                  name="to_email"
                  placeholder="to email"
                  type="email"
                  required
                />
              </Form.Group>
            </Row>

            <Form.Group size="sm" controlId="email">
              <Form.Label>
                <strong>Message </strong>
              </Form.Label>
              <br />
              <Form.Control
                name="message"
                as="textarea"
                rows={1}
                value={toSend.message}
                onChange={handleChange}
                required
                // onChange={(e) =>
                //   setRequest((prevState) => {
                //     return { ...prevState, note: e.target.value };
                //   })
                // }
              />
            </Form.Group>

            <br />
            {/* <Form.Control
                autoFocus
            /> */}

            {/* <input type="hidden" name="contact_number" />
            <label>Name</label>
            <input type="text" name="from_name" />
            <label>Email</label>
            <input type="email" name="from_email" />
            <label>Message</label>
            <textarea name="message" />
            <input type="submit" value="Send" /> */}
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
                disabled={choosenProducts.length === 0}
              >
                Send
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
                <span> Sending...</span>
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>

      <MessageModal
        show={showCreatedMessage}
        handleClose={handleCloseMessage}
        header="Message"
        type="request"
      >
        <Form.Group>
          <Form.Label>
            <h4>
              <strong>The order has been sent </strong>
            </h4>
          </Form.Label>
        </Form.Group>
      </MessageModal>
    </>
  );
};

export default Order;
