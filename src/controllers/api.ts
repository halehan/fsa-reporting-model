"use strict";

import * as async from "async";
// import * as request from "request";
import { Response, Request, NextFunction } from "express";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { Constants } from '../utils/constants';
var SALT_WORK_FACTOR = 10;

// Branch fsa-model

export class api {

  api() {

  }

    verifyToken = function(req: Request, res: Response) {
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

  authCheck = function(req: Request, resp: Response) {

  
 // resp.setHeader('Cache-Control', 'no-cache');
 // console.log(req.headers);
  
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  var rtn;
 // console.log(Constants.credentials.superSecret);
  jwt.verify(token, Constants.credentials.superSecret, (err, decoded) => {      
    if (err) {
      rtn = 'fail';    
   //   resp.json({ message: 'Invalid Token' });
    } else {
      rtn = 'success';    
   //   resp.json({ message: 'Invalid Token' });
    }

  });

 // console.log(rtn);
  return rtn;
}

  getPoSpec = (req: Request, res: Response) => {

  var validToken = this.authCheck(req, res);

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





 getAdminFee = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = this.authCheck(req, res);

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

 getTransactionByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = this.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppReport where bidNUmber = @id order by updatedTime desc', {id: req.params.bidNumber}).then(function(results) {
     
  //   console.log(results);
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}

 getHomeContentByName = (req: Request, res: Response) => {

  var validToken = this.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppAppContent where contentName = @content', {content: req.params.contentName}).then(function(results) {
     
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}


 getPaymentsByPoId = (req: Request, res: Response) => {

  var validToken = this.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppPayment where fsaCppReportId = @id order by paymentNumber desc', {id: req.params.poId}).then(function(results) {
     
  //   console.log(results);
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}


 insertTransaction = (req: Request, res: Response) => {

var validToken = this.authCheck(req, res);

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

  sleep = (milliseconds: number) => {
  const sleep = ( ms ) => {
    const end = +(new Date()) + ms;
    while ( +(new Date()) < end ) { }
   }

}

 updateTransaction = (req: Request, res: Response) => {

  var validToken = this.authCheck(req, res);
  
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

  deleteTransaction = (req: Request, res: Response) => {

  var validToken = this.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('delete from FsaCppReport where TransactionNumber = @id', {id: req.params.transId}).then(function(results) {
     
     res.json({ message: 'Transaction deleted '  + req.params.transId });	
    });

  }

}

  getUsers = (req: Request, res: Response) => {

  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = this.authCheck(req, res);

 if( validToken == 'success') {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);

    db.query('select * from FsaUser').then(function(results) {

      res.send(results);
  });

 } else {
             res.json({ message: 'Invalid Token' });	
        }

}

  getSpecByBidNumber = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');


  var validToken = this.authCheck(req, res);
  // var validToken = 'success';
  
  if( validToken == 'success') {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
    db.query('select distinct specNumber, specDescription from VehicleTypeCodes where bidNumber = @id', {id: req.params.bidId}).then(function(results) {
      
     res.send(results);
  });

 }

}

  getUser = (req: Request, res: Response) => {

   var validToken = this.authCheck(req, res);
  // var validToken = 'success';
  
  if( validToken == 'success') {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);

    db.query('select * from FsaUser where loginId = @id', {id: req.params.loginId}).then(function(err, results) {
      if (err){
        res.send(err);
      }
  //    console.log(results);
      res.send(results);
  });

 }

}

  authenticate = (req: Request, res: Response) => {

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
    console.log('found user');
    console.log(req.body.password);
    console.log(bcrypt.compareSync(req.body.password, pass)); // true
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


    postUser = (req: Request, res: Response) => {
     
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
          
            bcrypt.hash(req.body.password, salt, function(err, hash){
                console.log(hash);    
                console.log(bcrypt.compareSync("halehanp2$", hash)); // true
                console.log(bcrypt.compareSync("catBoy", hash)); // false

                var sworm = require('sworm');
 
                var db = sworm.db(Constants.configSworm);
                var fsaUser = db.model({table: 'FsaUser'});

                var user = fsaUser({loginId: req.body.loginId, password: hash, firstName: req.body.firstName, 
                 lastName: req.body.lastName, createdDate: moment().toDate()});
                 
                db.connect(function () {
                  // connected

                 return user.save().then(function () {
                    res.json({ message: 'User created successfully ' + req.body.loginId + '  ' + req.body.firstName +'  ' + req.body.lastName });
                  });  
              
                }).then(function () {
                  console.log('After Insert');
                  
              
              });
            });
        });
      
      };

       insertPayment = (req: Request, res: Response) => {

        var validToken = this.authCheck(req, res);
        
        if( validToken == 'success') {
      
          var sworm = require('sworm');
          var db = sworm.db(Constants.configSworm); 
          var fsaCppPayment = db.model({table: 'FsaCppPayment'});
          var row = fsaCppPayment({fsaCppReportId: req.body.fsaReportId, paymentDate:  req.body.paymentDate, 
                             paymentAmount: req.body.paymentAmount, paymentNumber: req.body.paymentNumber, 
                             paymentCheckNum: req.body.paymentCheckNum, correction: req.body.correction, 
                             auditDifference: req.body.auditDifference, lateFeeAmt: req.body.lateFeeAmt,
                             lateFeeCheckNum: req.body.lateFeeCheckNum, lateFeeCheckDate: req.body.lateFeeCheckDate,
                             fsaRefundAmount: req.body.fsaRefundAmount, fsaRefundCheckNum: req.body.fsaRefundCheckNum,
                             fsaRefundDate: req.body.fsaRefundDate, poIssueDate:  req.body.poIssueDate, 
                             fsaAlloc: req.body.fsaAlloc, facAlloc: req.body.facAlloc, ffcaAlloc: req.body.ffcaAlloc,
                             totalAlloc: req.body.totalAlloc, dateReported: req.body.dateReported, 
                             dateReceived: req.body.dateReceived, comment: req.body.comment, updateDate: moment().toDate(), 
                             id: req.body.id, createdDate: moment().toDate()}) 
                             
         var rtn =  row.insert();
    
         res.send(row);
       }  else {
        res.json({ message: 'Invalid Token' });	
      }
      
      } 
     

       updatePayment = (req: Request, res: Response) => {

        var validToken = this.authCheck(req, res);
        // var validToken = 'success';
        
        if( validToken == 'success') {
      
          var sworm = require('sworm');
          var db = sworm.db(Constants.configSworm); 
          var fsaCppPayment = db.model({table: 'FsaCppPayment'});
          var row = fsaCppPayment({fsaCppReportId: req.body.fsaReportId, paymentDate:  req.body.paymentDate, 
                                  paymentAmount: req.body.paymentAmount, paymentNumber: req.body.paymentNumber, 
                                  paymentCheckNum: req.body.paymentCheckNum, correction: req.body.correction, 
                                  auditDifference: req.body.auditDifference, lateFeeAmt: req.body.lateFeeAmt,
                                  lateFeeCheckNum: req.body.lateFeeCheckNum, lateFeeCheckDate: req.body.lateFeeCheckDate,
                                  fsaRefundAmount: req.body.fsaRefundAmount, fsaRefundCheckNum: req.body.fsaRefundCheckNum,
                                  fsaRefundDate: req.body.fsaRefundDate, poIssueDate:  req.body.poIssueDate, 
                                  fsaAlloc: req.body.fsaAlloc, facAlloc: req.body.facAlloc, ffcaAlloc: req.body.ffcaAlloc,
                                  totalAlloc: req.body.totalAlloc,comment: req.body.comment, dateReported: req.body.dateReported,  
                                  dateReceived: req.body.dateReceived,  updateDate: moment().toDate(), id: req.body.id})
         var rtn =  row.update();
    
        res.send(row);
       }  else {
        res.json({ message: 'Invalid Token' });	
      }
      
      } 
     
  
    putUser = (req: Request, res: Response) => {

    var validToken = this.authCheck(req, res);
    // var validToken = 'success';
    
    if( validToken == 'success') {
  
      var sworm = require('sworm');
      var db = sworm.db(Constants.configSworm); 
      var fsaUser = db.model({table: 'FsaUser'});
      var user = fsaUser({firstName: req.body.firstName, lastName:  req.body.lastName, 
                         phone: req.body.phone, address: req.body.address, city: req.body.city,
                         state: req.body.state, zip: req.body.zip, updatedDate: moment().toDate(), 
                         id: req.body.id})
     var rtn =  user.update();
 //    console.log(rtn);

   // res.json({ message: 'success' });	
    res.send(user);
   }  else {
    res.json({ message: 'Invalid Token' });	
  }
  
  } 

   getBidTypeNumber = (req: Request, res: Response) => {

    if( this.authCheck(req, res) == 'success') {
 
     var sworm = require('sworm');
     var db = sworm.db(Constants.configSworm);
 
     db.query('select * from BidNumberType order by endDate desc').then(function(results) {
       if (results)
          res.send(results);
   });

  } else {
    res.json({ message: 'Invalid Token' });	
    }
}


    getDealer = (req: Request, res: Response) => {

    if( this.authCheck(req, res) == 'success') {
 
     var sworm = require('sworm');
     var db = sworm.db(Constants.configSworm);
 
     db.query('select * from DealershipCodes').then(function(results) {
       if (results)
          res.send(results);
   });

  } else {
    res.json({ message: 'Invalid Token' });	
    }
}


  getAllBids = ( req: Request, res: Response) => {

  var validToken = this.authCheck(req, res);
 
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

}