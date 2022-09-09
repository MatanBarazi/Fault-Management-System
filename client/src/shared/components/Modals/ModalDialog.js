import React, {useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import styles from "./ModalDialog.module.css";
import Axios from "axios";
import {modifiedActivity} from "../../../utils/functions"

const ModalDialog = (props) => {
  const [show, setShow] = useState(false);
  const [savingForm, setSavingForm] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleStatus = async () => {
    try {
      setSavingForm(true);
      let activity=props.Activity(props.authCtx,props.type,props.className)
      const response = await Axios.put(props.native, {
        _id: props._id,
        activity:activity,
      });
      props.update(response.data);
      setSavingForm(false);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  // #closeModal
  return (
    <>
      <button className="button" onClick={handleOpen} disabled={props.btn_disabled} >
        <a href={props.href} className={`${props.className} ${props.btn_disabled && "invalid"}`} data-toggle="modal">
          <i
            className="material-icons"
            data-toggle="tooltip"
            title={props.header}
          >
            {/* &#xE872; */}
            <strong style={{ fontFamily: "none" }}>{props.btn_name} </strong>
            <span style={{ fontSize: props.icon_font }}> {props.icon} </span>
          </i>
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

        <Modal.Header className={`${styles["modal-header"]} ${styles[`modal-header-${props.type}`]} `}>
          <Modal.Title>
            <h3>
              <strong>{props.header}</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>{props.children}</Modal.Body>
        
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
            }}
            disabled={savingForm}
          >
            No
          </Button>
          {!savingForm ? (
            <Button variant="primary" type="submit" onClick={handleStatus}>
              Yes
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
      </Modal>
    </>
  );
};

export default ModalDialog;
