import { Response, Request, NextFunction } from "express";

import * as moment from "moment";
import { Constants } from '../utils/constants';
import { api } from '../controllers/api';

let _api = new api();

export let getTransaction = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppPurchaseOrder where id = @id', {id: req.params.transId}).then(function( results) {
     
     res.send(results);
    });

  }else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let getAdminFee = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

  if( validToken == 'success') {
 
    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
 
    db.query('select * from BidNumberType where bidNumber = @id', {id: req.params.bidNumber}).then(function(results) {
      
      res.send(results);
     });
 
   } else {
     res.json({ message: 'Invalid Token' });	
   }
 
 }

 export let getTransactionByPoNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppPurchaseOrder where poNumber = @id and markAsDeleted = 0 order by updatedTime desc', {id: req.params.poNumber}).then(function(results) {
     
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}


export let getTransactionByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppPurchaseOrder where bidNUmber = @id and markAsDeleted = 0 order by updatedTime desc', {id: req.params.bidNumber}).then(function(results) {
     
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let searchTransactionsFilter = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

  let status: string = req.params.status;
  let sql: string = 'select * from FsaCppPurchaseOrder where bidNUmber = @id and markAsDeleted = 0 ';
  let order: string = ' order by updatedTime desc';

  console.log(status);

  if (status.toUpperCase() === 'PAID' ) 
      sql = sql + " and poStatus in ('Yes', 'Over Payment')  ";

  if (status.toUpperCase() === 'UNPAID' ) 
  sql = sql +  " and poStatus in ('No', 'Partial Delivery', 'Shortage')   ";
  

  sql = sql + order;
  console.log(sql);

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query(sql, {id: req.params.bidNumber}).then(function(results) {
     
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}



export let getTransactionPaymentById = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

// if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('Select * from FsaCppPurchaseOrderCheckView V where V.id  = @id ', 
   {id: req.params.id}).then(function(results) {
     
     res.send(results);
    });

/*  } else {
    res.json({ message: 'Invalid Token' });	
  } */

}


export let getTransactionPaymentDetailsByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

// if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('Select * from FsaCppPurchaseOrderCheckView V where V.paymentCheckNum  = @checkNumber '  +
                       'and  V.dealerName   =  @dealerName ', 
   {checkNumber: req.params.checkNumber, dealerName: req.params.dealerName}).then(function(results) {
     
     res.send(results);
    });

/*  } else {
    res.json({ message: 'Invalid Token' });	
  } */

}

export let getTransactionPaymentByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

// if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);


   db.query('Select V.paymentCheckNum, V.dealerName, Count(*) as POS, sum(paymentAmount) as AdminFee from FsaCppPurchaseOrderCheckView V '  +
   'group by V.dealerName, V.paymentCheckNum having V.paymentCheckNum  =  @checkNumber ', 
   {checkNumber: req.params.checkNumber}).then(function(results) {
     
     res.send(results);
    });

}

export let searchPayment = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

// if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);


   db.query('Select V.paymentCheckNum, V.dealerName, Count(*) as POS, sum(paymentAmount) as AdminFee from FsaCppPurchaseOrderCheckView V '  +
   'group by V.dealerName, V.paymentCheckNum having V.paymentCheckNum  =  @checkNumber ', 
   {checkNumber: req.params.checkNumber}).then(function(results) {
     
     res.send(results);
    });

}



export let insertTransaction = (req: Request, res: Response) => {

var validToken = _api.authCheck(req, res);

 console.log(validToken);

    if( validToken == 'success') {

      var sworm = require('sworm');
 
      var db = sworm.db(Constants.configSworm);
      var fsaCppPurchaseOrder = db.model({table: 'FsaCppPurchaseOrder'});

      let poAmt: string;
      let actualPo: string;
      let adminFeeDue: string;

      if (req.body.poAmount == undefined || req.body.poAmount == null ) {
        poAmt = '0.0';
        adminFeeDue = '0.0';
      } else {
        poAmt = req.body.poAmount.toString();
        adminFeeDue = req.body.adminFeeDue.toString();
      }
/*
  

      if (req.body.adminFeeDue == undefined || req.body.adminFeeDue == null ) {
        adminFeeDue = '0.0';
      } else {
        adminFeeDue = req.body.adminFeeDue.toString();
      }


      if (req.body.actualPo == undefined || req.body.actualPo == null ) {
        actualPo = '0.0';
      } else {
        actualPo = req.body.actualPo.toString();
      }

         if (req.body.poAmount != undefined || req.body.poAmount === null) {
          poAmt = req.body.poAmount.toString();
      } 


      if (req.body.actualPo != undefined) {
          actualPo = req.body.actualPo.toString();
     }

     if (req.body.adminFeeDue != undefined) {
          adminFeeDue = req.body.adminFeeDue.toString();
     }  */

      db.connect(function () {

        var transaction = fsaCppPurchaseOrder({ poNumber: req.body.poNumber, bidNumber: req.body.bidNumber, payCd: req.body.payCd, poStatus: req.body.poStatus,
                                        bidType: req.body.bidType, adminFeeDue: adminFeeDue, poAmount: poAmt, dealerName: req.body.dealerName,  
                                        poReportedBy: req.body.poReportedBy, poComplete: req.body.poComplete, markAsDeleted: 0, poFinal: 0 ,cityAgency: req.body.cityAgency, 
                                        poIssueDate: req.body.poIssueDate, dateReported: req.body.dateReported, dealerFlag: req.body.dealerFlag, 
                                        agencyFlag: req.body.agencyFlag, comments: req.body.comments, createdBy: req.body.createdBy
                                      });
                                      
        return transaction.insert().then(function () {
      
        });
      }).then(function () {
          
        console.log('After Insert');
        res.json({ message: 'Transaction created '  + req.body.transactionNumber });	
      
      });


    } else {
      res.json({ message: 'Invalid Token' });	
    }
};

export let sleep = (milliseconds: number) => {
  const sleep = ( ms ) => {
    const end = +(new Date()) + ms;
    while ( +(new Date()) < end ) { }
   }

}

export let updateTransaction = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);
  
   console.log(validToken);
  
      if ( validToken == 'success') {
  
        var sworm = require('sworm');
   
        var db = sworm.db(Constants.configSworm);
        var fsaCppPurchaseOrder = db.model({table: 'FsaCppPurchaseOrder'});

        let poAmt: string = req.body.poAmount.toString();
        let adminFeeDue: string = req.body.adminFeeDue.toString(); 

       // convert to String from Number

        var transaction = fsaCppPurchaseOrder({ id: req.body.id, poNumber: req.body.poNumber, bidNumber: req.body.bidNumber,
          poAmount: poAmt, adminFeeDue: adminFeeDue, dealerName: req.body.dealerName, bidType: req.body.bidType,
          poStatus: req.body.poStatus, poFinal: req.body.poFinal, poReportedBy: req.body.poReportedBy, cityAgency: req.body.cityAgency, 
          poIssueDate: req.body.poIssueDate, dateReported: req.body.dateReported, payCd: req.body.payCd, 
          comments: req.body.comments, dealerFlag: req.body.dealerFlag,  agencyFlag: req.body.agencyFlag, 
          updatedBy: req.body.updatedBy });

        //Connected
        this.sleep(1000);
        transaction.update().then(function () {
              res.json({ message: 'Transaction Updated '  + req.body.id });
            });

      } else {
        res.json({ message: 'Invalid Token' });	
      }
  };

export let deletePurchaseOrder = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('update FsaCppPurchaseOrder set markAsDeleted = 1 where id = @id', {id: req.params.id}).then(function(results) {
     
     res.json({ message: 'Transaction deleted '  + req.params.id });	
    });

  }

}

export let getAllBids = ( req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);
 
 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from BidNumberType  order by StartDate desc').then(function(results) {
   
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

}