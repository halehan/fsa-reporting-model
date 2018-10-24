"use strict";

import * as async from "async";
import { Response, Request, NextFunction } from "express";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { Constants } from '../utils/constants';
var SALT_WORK_FACTOR = 10;
import { api } from '../controllers/api';

let _api = new api();

// Branch fsa-model

  export let verifyToken = function(req: Request, res: Response) {

    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];

    if( token ) {

        jwt.verify(token, Constants.credentials.superSecret, (err, decoded) => {

            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // all good, continue
              //  req.decoded = decoded; 
               // next();
            }
        });

    }  else {

        res.send({ success: false, message: 'No token exists.' });
    }
}


export let getTransaction = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppReport where id = @id', {id: req.params.transId}).then(function( results) {
     
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

export let getTransactionByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppReport where bidNUmber = @id order by updatedTime desc', {id: req.params.bidNumber}).then(function(results) {
     
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let insertTransaction = (req: Request, res: Response) => {

var validToken = _api.authCheck(req, res);

 console.log(validToken);

    if( validToken == 'success') {

      var sworm = require('sworm');
 
      var db = sworm.db(Constants.configSworm);
      var fsaCppReport = db.model({table: 'FsaCppReport'});

      let poAmt: string;
      let actualPo: string;
      let adminFeeDue: string;

      if (req.body.poAmount != undefined) {
          poAmt = req.body.poAmount.toString();
      }

      if (req.body.actualPo != undefined) {
          actualPo = req.body.actualPo.toString();
     }

     if (req.body.adminFeeDue != undefined) {
          adminFeeDue = req.body.adminFeeDue.toString();
     }

      db.connect(function () {

      
        // connected
        var transaction = fsaCppReport({poNumber: req.body.poNumber, bidNumber: req.body.bidNumber, payCd: req.body.payCd,
                                        actualPo: actualPo, adminFeeDue: adminFeeDue, poAmount: poAmt,
                                        dealerName: req.body.dealerName, spec: req.body.spec, QTY: req.body.qty, 
                                        poReportedBy: req.body.poReportedBy, vehicleType: req.body.vehicleType, 
                                        poComplete: req.body.poComplete,  cityAgency: req.body.cityAgency, 
                                        poIssueDate: req.body.poIssueDate, dateReported: req.body.dateReported, 
                                        correction: req.body.correction, dealerFlag: req.body.dealerFlag,  agencyFlag: req.body.agencyFlag, 
                                        comments: req.body.comments, estimatedDelivery: req.body.estimatedDelivery,
                                        createdTime: moment().toDate(), createdBy: req.body.createdBy,  updatedTime: moment().toDate()
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
  
      if( validToken == 'success') {
  
        var sworm = require('sworm');
   
        var db = sworm.db(Constants.configSworm);
        var fsaCppReport = db.model({table: 'FsaCppReport'});

     /*   console.log('req.body.poAmount ' + req.body.poAmount);
        console.log('req.body.correction ' + req.body.correction);
        console.log('req.body.actualPo '+ req.body.actualPo);  */

        let poAmt: string = req.body.poAmount.toString();
    //    let correction: string = req.body.correction.toString();
        let actualPo: string = req.body.actualPo.toString();
        let adminFeeDue: string = req.body.adminFeeDue.toString(); 

    //    let poAmt: number = '21.21';
    //    let correction: string = '33.33';
    //    let actualPo: number = 44.44;

    //convert to String from Number

        var transaction = fsaCppReport({id: req.body.id, poNumber: req.body.poNumber, bidNumber: req.body.bidNumber,
          poAmount: poAmt, correction: req.body.correction,  actualPo: actualPo, 
          adminFeeDue: adminFeeDue, dealerName: req.body.dealerName, vehicleType: req.body.vehicleType, 
          spec: req.body.spec, QTY: req.body.qty, poComplete: req.body.poComplete, poReportedBy: req.body.poReportedBy,
          cityAgency: req.body.cityAgency, poIssueDate: req.body.poIssueDate, dateReported: req.body.dateReported, 
          payCd: req.body.payCd, comments: req.body.comments, estimatedDelivery:  req.body.estimatedDelivery, 
          dealerFlag: req.body.dealerFlag,  agencyFlag: req.body.agencyFlag, updatedTime: moment().toDate(), 
          updatedBy: req.body.updatedBy});

      /*    console.log('poAmount = ' + req.body.poAmount);
          console.log('correction = ' + req.body.correction);
          console.log('actualPo = ' + req.body.actualPo); */
         
        //Connected
        this.sleep(1000);
        transaction.update().then(function () {
              res.json({ message: 'Transaction Updated '  + req.body.id });
            });

      } else {
        res.json({ message: 'Invalid Token' });	
      }
  };

export let deleteTransaction = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('delete from FsaCppReport where TransactionNumber = @id', {id: req.params.transId}).then(function(results) {
     
     res.json({ message: 'Transaction deleted '  + req.params.transId });	
    });

  }

}

export let authenticate = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

 
  console.log('In the authenticate method');

  var sworm = require('sworm');
  var db = sworm.db(Constants.configSworm);

db.query('select * from FsaUser where loginId = @id', {id: req.body.loginId}).then(function(results) {

  console.log(results);

  if (results.length == 0) {
   // this.putActivity(this.loginId, 'Authentication failed. User not found.');
    res.json({ success: false, message: 'Authentication failed. User not found.' });
   
  } else  {
    var pass = results[0].password;
   // console.log('found user');
   // console.log(req.body.password);
   // console.log(bcrypt.compareSync(req.body.password, pass)); // true
    // check if password matches
    if (!bcrypt.compareSync(req.body.password, pass)) {
      console.log('Authentication failed. Wrong password.');
    //  this.putActivity(this.loginId, 'Authentication failed. Wrong password.');
      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      
    } else {
      console.log('Prior to calling putActivity');
  //    this.putActivity(this.loginId, 'Success');

    // if user is found and password is right
    // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
  const payload = {
//        admin: user.admin 
  };
      var token = jwt.sign(payload, Constants.credentials.superSecret, {
          expiresIn : 60*60*24 // expires in 24 hours
      });

      // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });

    }   
  
  }

});  // end db.query()


}

export let getAllBids = ( req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);
 
 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from BidNumberType  order by StartDate desc').then(function(results) {
   
  //   console.log(results);
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

}