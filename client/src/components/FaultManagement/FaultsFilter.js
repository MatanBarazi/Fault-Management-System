import React, { useContext, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
//import Button from "react-bootstrap/Button";
import { BiSearchAlt } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { CSSTransition } from "react-transition-group";
//import {  } from "../../utils/functions";
import Button from "../../shared/components/FormElements/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./FaultsFilter.module.css";

const FaultsFilter = (props) => {
  const [filter, setFilter] = useState({
    number: "",
    status: "",
    from_date_created: "",
    handler_team: "",
    urgency_level: "",
  });
  const [client, setClient] = useState({
    display: "",
    id: "",
    idIsValid: true,
  });
  const [teamMember, setTeamMember] = useState({
    display: "",
    id: "",
    idIsValid: true,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const reset = () => {
    setFilter({
      number: "",
      status: "",
      from_date_created: "",
      handler_team: "",
      urgency_level: "",
    });
    setClient({ display: "", id: "", idIsValid: true });
    setTeamMember({ display: "", id: "", idIsValid: true });
    setFormIsValid(false);
  };

  const handlerID = (e, set, persons, idIsValid, id) => {
    let value = e.target.value;
    if (idIsValid && id.length !== 0) {
      set((prevState) => {
        return { ...prevState, id: "", display: "", idIsValid: false };
      });
    } else {
      set((prevState) => {
        return { ...prevState, id: value, display: value, idIsValid: false };
      });
    }
    if (value.length === 9) {
      let [person] = persons.filter((person) => person.id === parseInt(value));
      if (person) {
        set((prevState) => {
          return {
            ...prevState,
            display: `${person.name}, ${person.surname}`,
            idIsValid: true,
          };
        });
      }
    } else if (value.length === 0) {
      set((prevState) => {
        return {
          ...prevState,
          idIsValid: true,
        };
      });
    }
  };

  const handleSearch = () => {
    props.updateFaults(
      props.faults.filter((item) => {
        return (
          (filter.number !== ""
            ? item.number.toString() === filter.number
            : true) &&
          (filter.status !== "" ? item.status === filter.status : true) &&
          (filter.urgency_level !== ""
            ? item.urgencyLevel === filter.urgency_level
            : true) &&
          (filter.handler_team !== ""
            ? item.team === filter.handler_team
            : true) &&
          (filter.from_date_created !== ""
            ? item.date_created >= filter.from_date_created
            : true) &&
          (client.id !== "" ? item.clientID.toString() == client.id : true) &&
          (teamMember.id !== ""
            ? item.teamMemberID.toString() == teamMember.id
            : true)
        );
      })
    );
  };

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity");
      setFormIsValid(
        (filter.number !== "" ||
          filter.status !== "" ||
          filter.from_date_created !== "" ||
          filter.handler_team !== "" ||
          filter.urgency_level !== "" ||
          client.id !== "" ||
          teamMember.id !== "") &&
          teamMember.idIsValid &&
          client.idIsValid
      );
    }, 250);

    return () => {
      console.log("Clean-Up Timeout");
      clearTimeout(identifier);
    };
  }, [teamMember.id, client.id, filter]);

  return (
    <thead>
      <CSSTransition
        in={props.isOpen}
        timeout={300}
        classNames="slide-in-up"
        mountOnEnter
        unmountOnExit
      >
        <tr>
          <th colSpan="9">
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Fault No.</Form.Label>
                <Form.Control
                  name="number"
                  value={filter.number}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={filter.status}
                  onChange={handleChange}
                  name="status"
                >
                  <option value="" selected></option>
                  <option value="In treatment">In treatment</option>
                  <option value="Waiting for component">
                    Waiting for component
                  </option>
                  <option value="Close">Close</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>From date</Form.Label>
                <Form.Control
                  name="from_date_created"
                  value={filter.from_date_created}
                  onChange={handleChange}
                  type="date"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Client ID</Form.Label>
                <Form.Control
                  value={client.display}
                  onChange={(e) => {
                    handlerID(
                      e,
                      setClient,
                      props.clients,
                      client.idIsValid,
                      client.display
                    );
                  }}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Handler team</Form.Label>
                <Form.Control
                  as="select"
                  name="handler_team"
                  value={filter.handler_team}
                  onChange={handleChange}
                >
                  <option value="" selected></option>
                  <option value={"Customer service"}>Customer service</option>
                  <option value={"Technical service"}>Technical service</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Handler Member ID</Form.Label>
                <Form.Control
                  value={teamMember.display}
                  onChange={(e) => {
                    handlerID(
                      e,
                      setTeamMember,
                      props.users,
                      teamMember.idIsValid,
                      teamMember.display
                    );
                  }}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label> Urgency level</Form.Label>
                <Form.Control
                  as="select"
                  name="urgency_level"
                  value={filter.urgency_level}
                  onChange={handleChange}
                >
                  <option value="" selected></option>
                  <option value={"Low"}>Low</option>
                  <option value={"Normal"}>Normal</option>
                  <option value={"High"}>High</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} className={styles["responsive"]}>
                <Button
                  type="submit"
                  title="search"
                  disabled={!formIsValid}
                  onClick={handleSearch}
                >
                  Search <BiSearchAlt />
                </Button>

                <Button
                  title="reset"
                  color="black"
                  onClick={() => {
                    reset();
                    props.resetFaults();
                  }}
                >
                  Reset <HiOutlineRefresh />
                </Button>
              </Form.Group>
            </Row>
          </th>
        </tr>
      </CSSTransition>
    </thead>
  );
};

export default FaultsFilter;
