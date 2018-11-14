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

export let getDerivedItem = (req: Request, res: Response ) => {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
 
    db.query('select distinct I.* from FsaCppBidItemCodes I where I.bidNumber = @bidNumber and I.itemNumber = @itemNumber and I.itemType = @itemType ', {bidNumber: req.params.bidNumber, itemNumber: req.params.itemNumber, itemType: req.params.itemType }).then(function( results) {
      
      res.send(results);
     });
 
   

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

        var transaction = new fsaCppItem({  fsaCppPurchaseOrderId: req.body.fsaCppPurchaseOrderId,  bidItemCodeId: req.body.bidItemCodeId, itemNumber: req.body.itemNumber, itemDescription: req.body.itemDescription,
                                        itemType: req.body.itemType, itemMake: req.body.itemType, itemModel: req.body.itemModel,
                                        qty: req.body.qty, itemAmount:  req.body.itemAmount, adminFeeDue: req.body.adminFeeDue, 
                                        itemModelNumber: req.body.itemModelNumber, fsaFee: fsaFee, facFee: facFee, ffcaFee: ffcaFee, createdTime: moment().toDate(), 
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
  
        if (req.body.fsaFee != undefined) {fsaFee = req.body.fsaFee.toString(); }
        if (req.body.facFee != undefined) {facFee = req.body.facFee.toString(); }
        if (req.body.ffcaFee != undefined) {ffcaFee = req.body.ffcaFee.toString(); }
  
  
          var transaction = fsaCppItem({  id: req.body.id, bidItemCodeId: req.body.bidItemCodeId, itemNumber: req.body.itemNumber, itemDescription: 
            req.body.itemDescription, itemType: req.body.itemType, itemMake: req.body.itemMake, 
            itemModelNumber: req.body.itemModelNumber, qty: req.body.qty, itemAmount:  req.body.itemAmount, 
            adminFeeDue: req.body.adminFeeDue, fsaFee: fsaFee, facFee: facFee, ffcaFee: ffcaFee, 
            updatedBy: req.body.updatedBy,  updatedTime: moment().toDate() });
  
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