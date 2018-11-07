/// <reference path="../typings/index.d.ts" />
import * as express from "express";  
import * as cors from "cors";  
import * as bodyParser from "body-parser";  
import * as morgan from "morgan";

import * as fsaPurchaseOrder from "./controllers/fsaPurchaseOrder";
import * as fsapayments from "./controllers/fsaPayment";
import * as fsaItem from "./controllers/fsaItem";
import * as fsaCodeServices from "./controllers/fsaCodeServices";
import * as fsaUserServices from "./controllers/fsaUser";

  
// ===============
// Express App
// ===============
var app = express();  
const port = 3000;

app.use(cors());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev')); // log requests to the console 1

//PurchaseOrder services

  //Transaction.  This is the main table FSACppReport
  app.get("/api/transaction/bids", fsaCodeServices.getAllBids);
  app.get("/api/transaction/bid/:bidNumber", fsaPurchaseOrder.getTransactionByBidNumber);
  app.get("/api/transaction/:transId", fsaPurchaseOrder.getTransaction);
  app.get("/api/transaction/payment/:itemId", fsapayments.getPaymentsByPoId);
  app.put("/api/transaction/payment/:id", fsapayments.updatePayment);
  app.post("/api/transaction/payment", fsapayments.insertPayment);
  app.post("/api/transaction", fsaPurchaseOrder.insertTransaction);
  app.put("/api/transaction", fsaPurchaseOrder.updateTransaction);
  app.delete("/api/transaction/:transId", fsaPurchaseOrder.deleteTransaction);

  //Items
  app.get("/api/item/purchaseOrder/:fsaPurchaseOrderId", fsaItem.getPoItem);
  app.get("/api/item/:itemId", fsaItem.getItem);
  app.post("/api/item", fsaItem.insertItem);
 
 
  //User services
  // app.put("/api/user/:loginId", apiController.putUser);
  app.get("/api/user/", fsaUserServices.getUsers);
  app.post("/api/user/",fsaUserServices.postUser);
  app.put("/api/user/:loginId", fsaUserServices.putUser);
  app.get("/api/user/:loginId",  fsaUserServices.getUser);

  //Login auth
  app.post("/authenticate",  fsaUserServices.authenticate);

  //Code Tables
  app.get("/api/item/bid/:bidId", fsaCodeServices.getItemTypeByBid);
  app.get("/api/item/:bidId/:itemId", fsaCodeServices.getItemType);
  app.get("/api/fee/:payee/:type/:payCd", fsaCodeServices.getFeeDistribution);

  app.get("/api/poStatusType/", fsaCodeServices.getPoStatusType);
  app.get("/api/agencyType/", fsaCodeServices.getAgencyType);
  app.get("/api/agencyType/:agencyName", fsaCodeServices.getAgencyTypeByName);
  app.get("/api/bidType/", fsaCodeServices.getBidType);
  app.get("/api/bidType/:bidNumber", fsaCodeServices.getAdminFee);
  app.get("/api/cityAgency/", fsaCodeServices.getCityAgency);
  app.get("/api/dealer/", fsaCodeServices.getDealer);
  app.get("/api/bidNumberType/", fsaCodeServices.getBidTypeNumber);
  //app.get("/api/specification/:bidId", fsaItem.getSpecByBidNumber);
  app.get("/api/vehicleType/:bidId/:itemId", fsaCodeServices.getItemType);
  app.get("/api/content/:contentName", fsaUserServices.getHomeContentByName);

  //Dashboard rest graphs

app.set("port", port);
app.listen(port, () => console.log('FSA CPP Service Running on  port: ' + port));