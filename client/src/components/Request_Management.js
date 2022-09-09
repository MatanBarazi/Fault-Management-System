import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import styles from "./Request_Management.module.css";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import AuthContext from "../store/auth-context";
import DisplayRequestModal from "./RequestManagement/DisplayRequestModal";
import ModalDialog from "../shared/components/Modals/ModalDialog";
import NewPurchaseRequestModal from "./RequestManagement/NewPurchaseRequestModal";
import RequestsFilter from "./RequestManagement/RequestsFilter";
import Order from "./RequestManagement/Order";
import { BsFilterRight } from "react-icons/bs";
import {
  displayDate,
  getTimeDuration,
  requestActivity,
  closePurchaseRequestActivity,
  defaultFilter,
  teamFilter,
} from "../utils/functions";

const RequestManagement = (props) => {
  const authCtx = useContext(AuthContext);
  const [allRequests, setAllRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    if (!isOpen) setIsOpen(true);
    else setIsOpen(false);
  };

  const evenPos = (pos) => pos % 2 == 0;

  const getData = async () => {
    let time = Date.now();
    try {
      let [components, purchases, users] = await Promise.all([
        Axios.get("arrays/requests"),
        Axios.get("arrays/purchaseRequests"),
        Axios.get(`arrays/users`),
      ]);
      let requests = [...components.data, ...purchases.data];
      setAllRequests(requests);
      setRequests(defaultFilter(requests, authCtx.user.team));
      setUsers(users.data);
      setIsLoading(false);
      setIsOpen(true);
    } catch (err) {
      console.log(err);
    }
    console.log(Date.now() - time);
  };

  useEffect(async () => {
    await getData();
  }, []);

  useEffect(() => {
    if (authCtx.user.role === "system administrator") {
      setIsLoading(true);
      getData();
    }
  }, [authCtx]);

  const updateRequestsAfterCreating = (requests) => {
    // let data;
    // try {
    //   if (requests[0].team === "Stock")
    //     data = await Axios.get("arrays/purchaseRequests");
    //   else data = await Axios.get("arrays/requests");
    //   setAllRequests([...requests, ...data]);
    //   setRequests(defaultFilter(requests, authCtx.user.team));
    // } catch (err) {
    //   console.log("update requests after creating - error");
    // }
    getData();
  };

  const updateRequests = (requests) => {
    setRequests(teamFilter(requests, authCtx.user.team));
  };

  const resetRequests = () => {
    setRequests(defaultFilter(allRequests, authCtx.user.team));
  };

  return (
    <main>
      {/* className="container-xl" */}
      <div className={`container-xl ${styles["container-max-width"]}`}>
        {/* className="table-responsive" */}
        <div className={styles.table_responsive}>
          <div className={styles.table_wrapper}>
            <div className={styles.table_title}>
              <div className="row">
                <div className="col-sm-3">
                  {authCtx.user.team === "Stock" ? (
                    <h2>
                      <strong>Component Request List</strong>
                    </h2>
                  ) : (
                    <h2>
                      <strong>Purchase Request List</strong>
                    </h2>
                  )}
                </div>
                {!isLoading && (
                  <div className="col-sm-9">
                    <a className={`btn ${styles.btn}`}>
                      <BsFilterRight
                        onClick={handleOpen}
                        style={{ fontSize: "25px" }}
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <table className="table table-striped table-hover">
              <RequestsFilter
                requests={allRequests}
                users={users}
                isOpen={isOpen}
                updateRequests={updateRequests}
                resetRequests={resetRequests}
              />
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date created</th>
                  <th>Status</th>
                  <th>Urgency level</th>
                  <th>Time Duration</th>
                  <th>Handler Team member</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading ? (
                  requests.length === 0 ? (
                    <tr id={"fault-even-pos"}>
                      <td colSpan="9">
                        <strong>Not Found</strong>
                      </td>
                    </tr>
                  ) : (
                    requests.map((request, pos) => {
                      return (
                        <React.Fragment key={request.number}>
                          <tr
                            id={
                              evenPos(pos) ? "fault-even-pos" : "fault-odd-pos"
                            }
                          >
                            <td>{request.number}</td>
                            <td>{displayDate(request.date_created)}</td>
                            <td>
                              <strong>{request.status} </strong>
                            </td>
                            <td
                              className={`urgencyLevel-${request.urgencyLevel}`}
                            >
                              <strong>{request.urgencyLevel}</strong>
                            </td>
                            <td>{getTimeDuration(request.date_created)}</td>
                            {request.teamMemberID === null ? (
                              <td></td>
                            ) : (
                              <td>{`${request.teamMemberName}, ${request.teamMemberSurname}`}</td>
                            )}

                            <td>
                              <DisplayRequestModal
                                request={request}
                                users={users}
                                updateRequests={updateRequests}
                                // updateFaults={updateFaults}
                              />
                              {authCtx.user.team === "Stock" ? (
                                <>
                                  <NewPurchaseRequestModal
                                    request={request}
                                    updateRequests={updateRequestsAfterCreating}
                                    team="Purchase"
                                  />
                                  <ModalDialog
                                    type="request"
                                    _id={request._id}
                                    authCtx={authCtx}
                                    Activity={requestActivity}
                                    native="/requestManagement/closeRequest"
                                    update={updateRequestsAfterCreating}
                                    className="close"
                                    btn_name="Close"
                                    btn_disabled={
                                      request.status ===
                                      "Waiting for component purchase"
                                    }
                                    icon="lock"
                                    icon_font="20px"
                                    href="#closeModal"
                                    header="Close request"
                                  >
                                    <Form.Group>
                                      <Form.Label>
                                        <strong>
                                          Are you sure you want to close the
                                          request ?
                                        </strong>
                                      </Form.Label>
                                    </Form.Group>
                                  </ModalDialog>
                                </>
                              ) : (
                                <>
                                  <Order
                                    request={request}
                                    updateRequests={updateRequests}
                                    team="Purchase"
                                  />
                                  <ModalDialog
                                    type="request"
                                    _id={request._id}
                                    authCtx={authCtx}
                                    Activity={closePurchaseRequestActivity}
                                    native="/requestManagement/closePurchaseRequest"
                                    update={updateRequestsAfterCreating}
                                    className="close"
                                    btn_name="Close"
                                    icon="lock"
                                    icon_font="20px"
                                    href="#closeModal"
                                    header="Close purchase request"
                                  >
                                    <Form.Group>
                                      <Form.Label>
                                        <strong>
                                          Are you sure you want to close the
                                          purchase request ?
                                        </strong>
                                      </Form.Label>
                                    </Form.Group>
                                  </ModalDialog>
                                </>
                              )}
                            </td>
                          </tr>
                          {/* <tr
                                id={
                                  evenPos(pos) ? "fault-even-pos" : "fault-odd-pos"
                                }
                              >
                                <td colSpan="8" className="fault-description">
                                  <span>{request.note}</span>
                                </td>
                              </tr> */}
                        </React.Fragment>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td colSpan="8">
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestManagement;
