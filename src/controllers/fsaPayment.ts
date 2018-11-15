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
                  var row = fsaCppPayment({fsaCppItemId: req.body.fsaCppItemId, fsaCppReportId: req.body.fsaReportId, paymentDate:  req.body.paymentDate, 
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
     

          export let updatePayment = (req: Request, res: Response) => {

              var validToken = _api.authCheck(req, res);
              
              if( validToken == 'success') {
            
                var sworm = require('sworm');
                var db = sworm.db(Constants.configSworm); 
                var fsaCppPayment = db.model({table: 'FsaCppPayment'});
                var row = fsaCppPayment({fsaCppItemId: req.body.fsaCppItemId,  
                                        paymentDate:  req.body.paymentDate, paymentAmount: req.body.paymentAmount, 
                                        paymentNumber: req.body.paymentNumber, paymentCheckNum: req.body.paymentCheckNum, 
                                        correction: req.body.correction, auditDifference: req.body.auditDifference, lateFeeAmt: req.body.lateFeeAmt,
                                        lateFeeCheckNum: req.body.lateFeeCheckNum, lateFeeCheckDate: req.body.lateFeeCheckDate,
                                        fsaRefundAmount: req.body.fsaRefundAmount, fsaRefundCheckNum: req.body.fsaRefundCheckNum,
                                        fsaRefundDate: req.body.fsaRefundDate, poIssueDate:  req.body.poIssueDate, 
                                        fsaAlloc: req.body.fsaAlloc, facAlloc: req.body.facAlloc, ffcaAlloc: req.body.ffcaAlloc,
                                        totalAlloc: req.body.totalAlloc, comment: req.body.comment, dateReported: req.body.dateReported,  
                                        dateReceived: req.body.dateReceived,  updateDate: moment().toDate(), id: req.body.id})
              var rtn =  row.update();
          
              res.send(row);
            }  else {
              res.json({ message: 'Invalid Token' });	
            }
      
          } 