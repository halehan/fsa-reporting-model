/// <reference path="../typings/index.d.ts" />
import * as express from "express";  
import * as cors from "cors";  
import * as bodyParser from "body-parser";  
import * as morgan from "morgan";

import * as apiController from "./controllers/api";

  
// ===============
// Express App
// ===============
var app = express();  
const port = 3000;

app.use(cors());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev')); // log requests to the console  

  //Transaction.  This is the main table FSACppReport
  app.get("/api/transaction/bids", apiController.getAllBids);
  app.get("/api/transaction/bid/:bidNumber", apiController.getTransactionByBidNumber);
  app.get("/api/transaction/:transId", apiController.getTransaction);
  app.get("/api/transaction/payment/:poId", apiController.getPaymentsByPoId);
  app.put("/api/transaction/payment/:id", apiController.updatePayment);
  app.post("/api/transaction/payment", apiController.insertPayment);
  app.post("/api/transaction", apiController.insertTransaction);
  app.put("/api/transaction", apiController.updateTransaction);
  app.delete("/api/transaction/:transId", apiController.deleteTransaction);

  //User services
  // app.put("/api/user/:loginId", apiController.putUser);
  app.get("/api/user/", apiController.getUsers);
  app.post("/api/user/", apiController.postUser);
  app.put("/api/user/:loginId", apiController.putUser);
  app.get("/api/user/:loginId",  apiController.getUser);

  //Login auth
  app.post("/authenticate",   apiController.authenticate);

  //Code Tables
  app.get("/api/poStatusType/", apiController.getPoStatusType);
  app.get("/api/agencyType/", apiController.getAgencyType);
  app.get("/api/agencyType/:agencyName", apiController.getAgencyTypeByName);
  app.get("/api/bidType/", apiController.getBidType);
  app.get("/api/bidType/:bidNumber", apiController.getAdminFee);
  app.get("/api/cityAgency/", apiController.getCityAgency);
  app.get("/api/dealer/", apiController.getDealer);
  app.get("/api/bidNumberType/", apiController.getBidTypeNumber);
  app.get("/api/specification/:bidId", apiController.getSpecByBidNumber);
  app.get("/api/vehicleType/:bidId/:specId", apiController.getVehicleType);
  app.get("/api/content/:contentName", apiController.getHomeContentByName);

  //Dashboard rest graphs


app.set("port", port);
app.listen(port, () => console.log('FSA CPP Service Running on  port: ' + port));