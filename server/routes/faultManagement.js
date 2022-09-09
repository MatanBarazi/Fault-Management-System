const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { FaultModel, validNewFault, Activity } = require("../models/faultModel");
const { UserModel } = require("../models/userModel");
const { ClientModel } = require("../models/clientModel");
const { TeamModel } = require("../models/teamModel");
const { ProductModel } = require("../models/productModel");
const { RequestModel } = require("../models/requestModel");

router.get("/", async (req, res) => {
  try {
    let faults = await FaultModel.find({}).lean();
    let data = await mergeFaultsAndUsers(faults);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/NewFaultModel", async (req, res) => {
  let validBody = validNewFault(req.body);
  // if (validBody.error) {
  //   console.log("blat")
  //   return res.status(400).json(validBody.error.details);
  // }
  try {
    let fault = new FaultModel(req.body);
    fault.number = await generateFaultNumber();
    await fault.save(); //שומר את המידע ב db
    let faults = await FaultModel.find({}).lean();
    data = await mergeFaultsAndUsers(faults);
    res.json({ faults: data, faultNumber: fault.number });
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Error" });
  }
});

router.post("/EditFaultModel", async (req, res) => {
  let validBody = validNewFault(req.body);
  // if (validBody.error) {
  //   console.log("blat")
  //   return res.status(400).json(validBody.error.details);
  // }
  try {
    fault = await FaultModel.findOne({ _id: req.body._id });
    fault = updateFault(fault, req.body);
    await fault.save();
    let faults = await FaultModel.find({}).lean();
    data = await mergeFaultsAndUsers(faults);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Error" });
  }
});

const updateFault = (fault, updateFault) => {
  fault.number = updateFault.number;
  fault.status = updateFault.status;
  fault.clientID = updateFault.clientID;
  fault.team = updateFault.team;
  fault.description = updateFault.description;
  fault.teamMemberID = updateFault.teamMemberID;
  fault.urgencyLevel = updateFault.urgencyLevel;
  fault.activity = updateFault.activity;
  return fault;
};

router.post("/NewRequest", async (req, res) => {
  // let validBody = validNewFault(req.body);
  // if (validBody.error) {
  //   console.log("blat")
  //   return res.status(400).json(validBody.error.details);
  // }
  try {
    let request = new RequestModel(req.body);
    await RequestModel.deleteOne({ number: request.number });
    await request.save(); //שומר את המידע ב db
    res.json({});
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Error" });
  }
});

router.put("/clientID", async (req, res) => {
  let data = await UserModel.findOne({ id: req.body.id }, "-_id name surname");
  res.json(data);
});

router.patch("/updateFault", async (req, res) => {
  try {
    let fault = await FaultModel.findOne({ number: req.body.number });
    req.body.updates.map((update, pos) => {
      if (update === "activity") fault[update].push(req.body.values[pos]);
      else fault[update] = req.body.values[pos];
    });
    await fault.save();
    res.json({});
  } catch (err) {
    console.log(err);
  }
});

const generateFaultNumber = async () => {
  let data = await FaultModel.findOne({}, "-_id number").sort("-date_created");
  if (data) {
    return data.number + 1;
  } else {
    return data;
  }
};

const mergeFaultsAndUsers = async (faults) => {
  try {
    let data = await Promise.all(
      faults.map(async (fault) => {
        let client = await ClientModel.findOne(
          { id: fault.clientID },
          "-_id name surname"
        ).lean();
        if (fault.teamMemberID !== null) {
          let teamMember = await UserModel.findOne(
            { id: fault.teamMemberID },
            "-_id name surname"
          ).lean();
          return {
            ...fault,
            clientName: client.name,
            clientSurname: client.surname,
            clientPhoneNumber: client.phoneNumber,
            teamMemberName: teamMember.name,
            teamMemberSurname: teamMember.surname,
          };
        }
        return {
          ...fault,
          clientName: client.name,
          clientSurname: client.surname,
          clientPhoneNumber: client.phoneNumber,
        };
      })
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

router.put("/closeFault", async (req, res) => {
  try {
    fault = await FaultModel.findOne({ _id: req.body._id });
    fault.status = "Close";
    fault.activity = [...fault.activity, req.body.activity];
    await fault.save();
    let faults = await FaultModel.find({}).lean();
    data = await mergeFaultsAndUsers(faults);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.put("/doneFault", async (req, res) => {
  try {
    fault = await FaultModel.findOne({ _id: req.body._id });
    fault.team = "Customer service";
    fault.status = "Done";
    fault.activity = [...fault.activity, req.body.activity];
    fault.teamMemberID = null;
    await fault.save();
    let faults = await FaultModel.find({}).lean();
    data = await mergeFaultsAndUsers(faults);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/teams", async (req, res) => {
  teams = await TeamModel.find();
  res.json(teams);
});

router.get("/users", async (req, res) => {
  users = await UserModel.find();
  res.json(users);
});

router.get("/clients", async (req, res) => {
  clients = await ClientModel.find();
  res.json(clients);
});

router.get("/products", async (req, res) => {
  products = await ProductModel.find();
  res.json(products);
});

module.exports = router;
