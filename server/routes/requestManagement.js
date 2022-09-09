const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { UserModel } = require("../models/userModel");
const { ClientModel } = require("../models/clientModel");
const { TeamModel } = require("../models/teamModel");
const { RequestModel } = require("../models/requestModel");
const { FaultModel } = require("../models/faultModel");
const { Purchase_Request_Model } = require("../models/purchase_request_Model");

router.get("/", async (req, res) => {
  try {
    let requests = await RequestModel.find({}).lean();
    let data = await mergeRequestsAndUsers(requests);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/EditRequestModal", async (req, res) => {
  // let validBody = validNewFault(req.body);
  // if (validBody.error) {
  //   console.log("blat")
  //   return res.status(400).json(validBody.error.details);
  // }
  try {
    let request = await RequestModel.findOne({ _id: req.body._id });
    request = updateRequest(request, req.body);
    await request.save();
    res.json({});
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Error" });
  }
});

const updateRequest = (request, updateRequest) => {
  request.number = updateRequest.number;
  request.status = updateRequest.status;
  request.team = updateRequest.team;
  request.note = updateRequest.note;
  request.teamMemberID = updateRequest.teamMemberID;
  request.urgencyLevel = updateRequest.urgencyLevel;
  request.activity = updateRequest.activity;
  return request;
};

router.post("/NewPurchaseRequest", async (req, res) => {
  // let validBody = validNewFault(req.body);
  // if (validBody.error) {
  //   console.log("blat")
  //   return res.status(400).json(validBody.error.details);
  // }
  try {
    let purchaseRequest = new Purchase_Request_Model(req.body);
    await Purchase_Request_Model.deleteOne({number:purchaseRequest.number});
    await purchaseRequest.save(); //שומר את המידע ב db
    res.json({});
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Error" });
  }
});

router.put("/closeRequest", async (req, res) => {
  try {
    let request = await RequestModel.findOne({ _id: req.body._id });
    request.status = "Close";
    request.activity = [...request.activity, req.body.activity.requestActivity];
    let faultNumber = request.number;
    await request.save();
    let fault = await FaultModel.findOne({ number: faultNumber });
    fault.status = "In treatment";
    fault.request = false;
    fault.activity = [...fault.activity, req.body.activity.faultActivity];
    await fault.save();
    let requests = await RequestModel.find({}).lean();
    data = await mergeRequestsAndUsers(requests);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.put("/closePurchaseRequest", async (req, res) => {
  try {
    let purchaseRequest = await Purchase_Request_Model.findOne({
      _id: req.body._id,
    });
    purchaseRequest.status = "Close";
    purchaseRequest.activity=[...purchaseRequest.activity, req.body.activity.purchaseRequestActivity];
    let purchaseRequestNumber = purchaseRequest.number;
    await purchaseRequest.save();
    let request = await RequestModel.findOne({ number:purchaseRequestNumber });
    request.status = "In treatment";
    request.existPurchaseRequest = false;
    request.activity = [...request.activity, req.body.activity.requestActivity];
    await request.save();
    let purchaseRequests = await Purchase_Request_Model.find({}).lean();
    data = await mergeRequestsAndUsers(purchaseRequests);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/updateRequest", async (req, res) => {
  try {
    let request = await RequestModel.findOne({ number: req.body.number });
    req.body.updates.map((update,pos)=>{
      if(update==="activity")
        request[update].push(req.body.values[pos]);
      else
      request[update] = req.body.values[pos];
    })
    await request.save();
    res.json({});
  } catch (err) {
    console.log(err);
  }
});

router.patch("/updatePurchaseRequest", async (req, res) => {
  try {
    let request = await Purchase_Request_Model.findOne({ number: req.body.number });
    req.body.updates.map((update,pos)=>{
      if(update==="activity")
        request[update].push(req.body.values[pos]);
      else
      request[update] = req.body.values[pos];
    })
    await request.save();
    res.json({});
  } catch (err) {
    console.log(err);
  }
});

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
