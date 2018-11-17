import { Response, Request, NextFunction } from "express";
import * as moment from "moment";
import { Constants } from '../utils/constants';
import { api } from '../controllers/api';

let _api = new api();

        export let getPaymentsByItemId = (req: Request, res: Response) => {

          var validToken = _api.authCheck(req, res);

        if( validToken == 'success') {

          var sworm = require('sworm');
          var db = sworm.db(Constants.configSworm);

          db.query('select * from FsaCppPayment where fsaCppItemId = @itemId order by paymentNumber desc', {itemId: req.params.itemId}).then(function(results) {
            
            res.send(results);
            });

          } else {
            res.json({ message: 'Invalid Token' });	
          }

        }

        export let insertPayment = (req: Request, res: Response) => {

            var validToken = _api.authCheck(req, res);
                
                if( validToken == 'success') {
              
                  var sworm = require('sworm');
                  var db = sworm.db(Constants.configSworm); 
                  var fsaCppPayment = db.model({table: 'FsaCppPayment'});

                  let facAlloc: string;
                  let fsaAlloc: string;
                  let ffcaAlloc: string;
                  let lateFeeAmt: string;
                  let paymentAmount: string;
                  let fsaRefundAmount: string;
                  let totalAlloc: string;
            
                  if (req.body.fsaAlloc != undefined) {fsaAlloc = req.body.fsaAlloc.toString(); }
                  if (req.body.facAlloc != undefined) {facAlloc = req.body.facAlloc.toString(); }
                  if (req.body.ffcaAlloc != undefined) {ffcaAlloc = req.body.ffcaAlloc.toString(); }
                  if (req.body.lateFeeAmt != undefined) {lateFeeAmt = req.body.lateFeeAmt.toString(); }
                  if (req.body.paymentAmount != undefined) {paymentAmount = req.body.paymentAmount.toString(); }
                  if (req.body.fsaRefundAmount != undefined) {fsaRefundAmount = req.body.fsaRefundAmount.toString(); }
                  if (req.body.totalAlloc != undefined) {totalAlloc = req.body.totalAlloc.toString(); }

                  db.connect(function () {

                      var row = fsaCppPayment({ fsaCppPurchaseOrderId: req.body.fsaCppPurchaseOrderId, fsaCppItemId: req.body.fsaCppItemId, 
                                    fsaCppReportId: req.body.fsaReportId, paymentDate:  req.body.paymentDate, 
                                    paymentAmount: paymentAmount, paymentNumber: req.body.paymentNumber, 
                                    paymentCheckNum: req.body.paymentCheckNum, correction: req.body.correction, 
                                    auditDifference: req.body.auditDifference, lateFeeAmt: lateFeeAmt,
                                    lateFeeCheckNum: req.body.lateFeeCheckNum, lateFeeCheckDate: req.body.lateFeeCheckDate,
                                    fsaRefundAmount: fsaRefundAmount, fsaRefundCheckNum: req.body.fsaRefundCheckNum,
                                    fsaRefundDate: req.body.fsaRefundDate, poIssueDate:  req.body.poIssueDate, 
                                    fsaAlloc: fsaAlloc, facAlloc: facAlloc, ffcaAlloc: ffcaAlloc,
                                    totalAlloc: totalAlloc, dateReported: req.body.dateReported, 
                                    dateReceived: req.body.dateReceived, comment: req.body.comment, 
                                    updateDate: moment().toDate(), createdDate: moment().toDate()})
                                    
                      return row.insert().then(function () {
      
                      });
                 }).then(function () {
                  
                  console.log('After Insert');
                  res.json({ message: 'Transaction created '  + req.body.transactionNumber });	
      
                  });
                                    
              }  else {
                res.json({ message: 'Invalid Token' });	
              }
              
        } 
     

          export let updatePayment = (req: Request, res: Response) => {

              var validToken = _api.authCheck(req, res);
              
              if( validToken == 'success') {
            
                var sworm = require('sworm');
                var db = sworm.db(Constants.configSworm); 
                var fsaCppPayment = db.model({table: 'FsaCppPayment'});

                let facAlloc: string;
                let fsaAlloc: string;
                let ffcaAlloc: string;
                let lateFeeAmt: string;
                let paymentAmount: string;
                let fsaRefundAmount: string;
                let totalAlloc: string;
          
                if (req.body.fsaAlloc != undefined) {fsaAlloc = req.body.fsaAlloc.toString(); }
                if (req.body.facAlloc != undefined) {facAlloc = req.body.facAlloc.toString(); }
                if (req.body.ffcaAlloc != undefined) {ffcaAlloc = req.body.ffcaAlloc.toString(); }
                if (req.body.lateFeeAmt != undefined) {lateFeeAmt = req.body.lateFeeAmt.toString(); }
                if (req.body.paymentAmount != undefined) {paymentAmount = req.body.paymentAmount.toString(); }
                if (req.body.fsaRefundAmount != undefined) {fsaRefundAmount = req.body.fsaRefundAmount.toString(); }
                if (req.body.totalAlloc != undefined) {totalAlloc = req.body.totalAlloc.toString(); }


                var row = fsaCppPayment({fsaCppItemId: req.body.fsaCppItemId,  
                                        paymentDate:  req.body.paymentDate, paymentAmount: paymentAmount, 
                                        paymentNumber: req.body.paymentNumber, paymentCheckNum: req.body.paymentCheckNum, 
                                        correction: req.body.correction, auditDifference: req.body.auditDifference, lateFeeAmt: lateFeeAmt,
                                        lateFeeCheckNum: req.body.lateFeeCheckNum, lateFeeCheckDate: req.body.lateFeeCheckDate,
                                        fsaRefundAmount: fsaRefundAmount, fsaRefundCheckNum: req.body.fsaRefundCheckNum,
                                        fsaRefundDate: req.body.fsaRefundDate, poIssueDate:  req.body.poIssueDate, 
                                        fsaAlloc: fsaAlloc, facAlloc: facAlloc, ffcaAlloc: ffcaAlloc,
                                        totalAlloc: totalAlloc, comment: req.body.comment, dateReported: req.body.dateReported,  
                                        dateReceived: req.body.dateReceived,  updateDate: moment().toDate(), id: req.body.id})
              var rtn =  row.update();
          
              res.send(row);
            }  else {
              res.json({ message: 'Invalid Token' });	
            }
      
          } 