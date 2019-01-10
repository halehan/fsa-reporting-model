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

   const sqlString: string = 'Select I.id, I.itemNumber, I.itemDescription, I.itemType, I.itemMake, I.itemModelNumber,I.qty, I.itemAmount, I.adminFeeDue, ' +
   'ISNULL(sum(P.paymentAmount),0) as paymentAmount,  I.adminFeeDue - ISNULL(sum(P.paymentAmount),0) as balance from FsaCppItem I ' + 
   'LEFT OUTER JOIN FsaCppPayment P on I.id = P.fsaCppItemId where I.markAsDeleted = 0 and I.fsaCppPurchaseOrderId = @id ' +
   'group by I.id, I.itemNumber, I.itemDescription, I.itemType, I.itemMake, I.itemModelNumber, I.qty, I.itemAmount, I.adminFeeDue'

   db.query(sqlString, {id: req.params.fsaPurchaseOrderId}).then(function( results) {

    // db.query('select * from FsaCppItem where fsaCppPurchaseOrderid = @id and markAsDeleted = 0', {id: req.params.fsaPurchaseOrderId}).then(function( results) {
     
     res.send(results);
    });

  }else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let getDerivedItem = (req: Request, res: Response ) => {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
 
    db.query('select distinct I.* from FsaCppBidItemCodes I where I.bidNumber = @bidNumber and I.itemNumber = @itemNumber and I.itemType = @itemType ', {bidNumber: req.params.bidNumber, itemNumber: req.params.itemNumber, itemType: req.params.itemType }).then(function( results) {
      
      res.send(results);
     });
 
   

}

export let getItemAmountByPoId = (req: Request, res: Response) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select I.fsaCppPurchaseOrderId, sum(i.itemAmount) as amt from FsaCppItem I where I.fsaCppPurchaseOrderId = @id and markAsDeleted = 0 group by I.fsaCppPurchaseOrderId', 
   {id: req.params.poId}).then(function(results) {
     
     res.send(results);
    });

  } else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let getItem = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppItem where id = @itemId and markAsDeleted = 0', {itemId: req.params.itemId}).then(function( results) {
     
     res.send(results);
    });

  }else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let deleteItem = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('update FsaCppItem set markAsDeleted = 1 where id = @itemId', {itemId: req.params.itemId}).then(function( results) {
     
     res.send(results);
    });

  }else {
    res.json({ message: 'Invalid Token' });	
  }

}

export let deleteItemsByPo = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);

 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('update FsaCppItem set markAsDeleted = 1 where fsaCppPurchaseOrderId = @poId', {poId: req.params.poId}).then(function( results) {
     
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
      let adminFeeDue: string;
      let itemAmount: string;
      let markAsDeleted: number;

      markAsDeleted = 0;

      if (req.body.fsaFee != undefined) {fsaFee = req.body.fsaFee.toString(); }
      if (req.body.facFee != undefined) {facFee = req.body.facFee.toString(); }
      if (req.body.ffcaFee != undefined) {ffcaFee = req.body.ffcaFee.toString(); }
      if (req.body.adminFeeDue != undefined) {adminFeeDue = req.body.adminFeeDue.toString(); }
      if (req.body.itemAmount != undefined) {itemAmount = req.body.itemAmount.toString(); }

      db.connect(function () {

        var transaction = new fsaCppItem({ fsaCppPurchaseOrderId: req.body.fsaCppPurchaseOrderId,  bidItemCodeId: req.body.bidItemCodeId, itemNumber: req.body.itemNumber,
                                        itemDescription: req.body.itemDescription, itemType: req.body.itemType, itemMake: req.body.itemMake, itemModel: req.body.itemModel,
                                        qty: req.body.qty, itemAmount: itemAmount, adminFeeDue: adminFeeDue, itemModelNumber: req.body.itemModelNumber, fsaFee: fsaFee, 
                                        facFee: facFee, ffcaFee: ffcaFee, markAsDeleted: 0, createdBy: req.body.createdBy
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

  export let updateItem = (req: Request, res: Response) => {

    var validToken = _api.authCheck(req, res);
    
     console.log(validToken);
    
        if( validToken == 'success') {
    
          var sworm = require('sworm');
     
          var db = sworm.db(Constants.configSworm);
          var fsaCppItem = db.model({table: 'FsaCppItem'});

          let facFee: string;
          let fsaFee: string;
          let ffcaFee: string;
          let adminFeeDue: string;
          let itemAmount: string;

          if (req.body.fsaFee != undefined) {fsaFee = req.body.fsaFee.toString(); }
          if (req.body.facFee != undefined) {facFee = req.body.facFee.toString(); }
          if (req.body.ffcaFee != undefined) {ffcaFee = req.body.ffcaFee.toString(); }
          if (req.body.adminFeeDue != undefined) {adminFeeDue = req.body.adminFeeDue.toString(); }
          if (req.body.itemAmount != undefined) {itemAmount = req.body.itemAmount.toString(); }
  
  
          var transaction = fsaCppItem({  id: req.body.id, bidItemCodeId: req.body.bidItemCodeId, itemNumber: req.body.itemNumber, itemDescription: 
            req.body.itemDescription, itemType: req.body.itemType, itemMake: req.body.itemMake, 
            itemModelNumber: req.body.itemModelNumber, qty: req.body.qty, itemAmount:  itemAmount, 
            adminFeeDue: adminFeeDue, fsaFee: fsaFee, facFee: facFee, ffcaFee: ffcaFee, 
            updatedBy: req.body.updatedBy, markAsDeleted: req.body.markAsDeleted });
  
          transaction.update().then(function () {
                res.json({ message: 'Item Updated '  + req.body.id });
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