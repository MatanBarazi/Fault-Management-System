const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { FaultModel, validNewFault } = require("../models/faultModel");
const { RequestModel } = require("../models/requestModel");
const { Purchase_Request_Model } = require("../models/purchase_request_Model");
const { UserModel } = require("../models/userModel");
const { ClientModel } = require("../models/clientModel");
const { TeamModel } = require("../models/teamModel");
const { ProductModel } = require("../models/productModel");

router.get("/faults", async (req, res) => {
  faults = await FaultModel.find().lean();
  let data = await mergeFaultsAndUsers(faults);
  res.json(data);
});

router.get("/requests", async (req, res) => {
  requests = await RequestModel.find().lean();
  let data = await mergeRequestsAndUsers(requests);
  res.json(data);
});

router.get("/purchaseRequests", async (req, res) => {
  purchaseRequests = await Purchase_Request_Model.find().lean();
  let data = await mergeRequestsAndUsers(purchaseRequests);
  res.json(data);
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

// router.get("/delete", (req, res) => {
//   const myPromise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('abcabc');
//     }, 300);
//   });
//   const myPromise2 = new Promise((resolve, reject) => {
//     resolve("foo");
//   });
//   TeamModel.deleteMany({ age: { $gte: 52 } }).then((res) => {
//     console.log(res);
//   });
//   myPromise1.then(async(res) => {
//     console.log(res);
//   });
//   myPromise2.then((res) => {
//     console.log(res);
//   });
//   console.log("casca")
//   res.json({ msg: "success" });
// });

const mergeFaultsAndUsers = async (faults) => {
  try {
    let data = await Promise.all(
      faults.map(async (fault) => {
        let client = await ClientModel.findOne(
          { id: fault.clientID },
          "-_id name surname phoneNumber"
        ).lean();
        if (fault.teamMemberID !== null) {
          let teamMember = await UserModel.findOne(
            { id: fault.teamMemberID },
            "-_id name surname phoneNumber"
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

const mergeRequestsAndUsers = async (requests) => {
  try {
    let data = await Promise.all(
      requests.map(async (request) => {
        if (request.teamMemberID !== null) {
          let teamMember = await UserModel.findOne(
            { id: request.teamMemberID },
            "-_id name surname"
          ).lean();
          return {
            ...request,
            teamMemberName: teamMember.name,
            teamMemberSurname: teamMember.surname,
          };
        }
        return request;
      })
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
