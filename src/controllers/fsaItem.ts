import { Response, Request } from "express";
import * as moment from "moment";
import { Constants } from '../utils/constants';
import { api } from './api';

let _api = new api();


export let getPoItem = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppItem where fsaCppPurchaseOrderid = @id', {id: req.params.fsaPurchaseOrderId}).then(function( results) {
     
     res.send(results);
    });

  }else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let getItem = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppItem where id = @itemId', {itemId: req.params.itemId}).then(function( results) {
     
     res.send(results);
    });

  }else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let insertItem = (req: Request, res: Response) => {

var validToken = _api.authCheck(req, res);

    if( validToken == 'success') {

      var sworm = require('sworm');
 
      var db = sworm.db(Constants.configSworm);
      var fsaCppItem = db.model({table: 'FsaCppItem'});

      let facFee: string;
      let fsaFee: string;
      let ffcaFee: string;

      if (req.body.fsaFee != undefined) {fsaFee = req.body.fsaFee.toString(); }
 
      if (req.body.facFee != undefined) {facFee = req.body.facFee.toString(); }

      if (req.body.ffcaFee != undefined) {ffcaFee = req.body.ffcaFee.toString(); }

      db.connect(function () {

        var transaction = fsaCppItem({  fsaCppPurchaseOrderId: req.body.poId, itemNumber: req.body.itemNumber, itemDescription: req.body.itemDescription,
                                        itemType: req.body.itemType, itemMake: req.body.itemType, itemModel: req.body.itemModel,
                                        qty: req.body.qty, itemAmount:  req.body.itemAmount, adminFeeDue: req.body.adminFeeDue, 
                                        fsaFee: fsaFee, facFee: facFee, ffcaFee: ffcaFee, createdTime: moment().toDate(), 
                                        createdBy: req.body.createdBy,  updatedTime: moment().toDate()
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
        var fsaCppPurchaseOrder = db.model({table: 'FsaCppPurchaseOrder'});

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

        var transaction = fsaCppPurchaseOrder({id: req.body.id, poNumber: req.body.poNumber, bidNumber: req.body.bidNumber,
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