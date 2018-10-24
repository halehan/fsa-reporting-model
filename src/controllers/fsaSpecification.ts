import { Response, Request, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { Constants } from '../utils/constants';
import { api } from '../controllers/api';

let _api = new api();

var SALT_WORK_FACTOR = 10;

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

export let getPoSpec = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppSpecification where fsaCppReportid = @id', {id: req.params.fsaReportId}).then(function( results) {
     
     res.send(results);
    });

  }else {
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


export let getSpecByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');


  var validToken = _api.authCheck(req, res);
  // var validToken = 'success';
  
  if( validToken == 'success') {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
    db.query('select distinct specNumber, specDescription from VehicleTypeCodes where bidNumber = @id', {id: req.params.bidId}).then(function(results) {
      
     res.send(results);
  });

 }

}