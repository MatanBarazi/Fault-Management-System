import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import DeleteButton from "../../../../shared/components/FormElements/Button";
import { AiFillDelete } from "react-icons/ai";
import {MdModeEdit} from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import styles from "./UserModal.module.css";
import Axios from "axios";

const DeleteUserModal = (props) => {
  const [show, setShow] = useState(false);

  const [savingForm, setSavingForm] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleRemoveUser = async () => {
    setSavingForm(true)
    try {
      const response = await Axios.delete(`/users/deleteUser/${props._id}`)
      props.updateUsers(response.data);
      setSavingForm(false)
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <DeleteButton title="delete" type="submit" color="orange" onClick={handleOpen}>
        <strong>Delete</strong> <AiFillDelete style={{marginBottom:"2px"}}  />
      </DeleteButton>

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
              <strong>Delete User</strong>
            </h3>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body><strong>Are you sure you want to delete this user ?</strong></Modal.Body>
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
            <Button variant="primary" type="submit" onClick={handleRemoveUser}>
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

export default DeleteUserModal;
