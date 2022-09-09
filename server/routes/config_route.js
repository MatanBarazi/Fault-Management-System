const indexR = require("./index");
const userR = require("./users");
const loginR = require("./login");
const registerR = require("./register");
const faultManagementR = require("./faultManagement");
const requestManagementR = require("./requestManagement");
const arraysR = require("./arrays");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", userR);
  app.use("/login", loginR);
  app.use("/register", registerR);
  app.use("/faultManagement", faultManagementR);
  app.use("/requestManagement", requestManagementR);
  app.use("/arrays", arraysR);
};
