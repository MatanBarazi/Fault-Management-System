import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = (props) => {
  if (props.condition) {
    return <Route exact path={props.path} component={props.component}></Route>;
  } else {
    return <Redirect to="/" />;
  }
};

export default ProtectedRoute;
