import { Response, Request, NextFunction } from "express";
import { Constants } from '../utils/constants';
import { api } from '../controllers/api';

let _api = new api();

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

  export let getBidTypeNumber = (req: Request, res: Response) => {

    if( _api.authCheck(req, res) == 'success') {
 
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


  export let getDealer = (req: Request, res: Response) => {

    if( _api.authCheck(req, res) == 'success') {
 
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

export let  getAgencyTypeByName = (req: Request, res: Response) => {

  if( _api.authCheck(req, res) == 'success') {
 
    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
    let query: string = 'Select AT.agencyPayCode, C.cityAgencyName from AgencyType AT, CityAgencyCodes C' +
    '  where C.agencyTypeId = AT.agencyTypeId and C.cityAgencyName = @agencyName ';

    db.query(query, {agencyName: req.params.agencyName}).then(function(results) {
  
    res.send(results);
  });

 } else {
   res.json({ message: 'Invalid Token' });	
 }

}

  export let getAgencyType = (req: Request, res: Response) => {

    if( _api.authCheck(req, res) == 'success') {
 
     var sworm = require('sworm');
     var db = sworm.db(Constants.configSworm);
 
     db.query('select * from AgencyTypeCodes ').then(function(results) {
   
       res.send(results);
   });
 
  } else {
    res.json({ message: 'Invalid Token' });	
  }
 
 }

 
 export let getBidType = (req: Request, res: Response) => {

  if( _api.authCheck(req, res) == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from BidType').then(function(results) {
    
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

}


export let getCityAgency = (req: Request, res: Response) => {

  if( _api.authCheck(req, res) == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select C.cityAgencyName as cityAgencyName, C.agencyTypeId as agencyTypeId, A.agencyPayCode as agencyPayCode, A.agencyName as agencyName from CityAgencyCodes' +  
  ' C, AgencyType A where C.agencyTypeId = A.agencyTypeId order by C.cityAgencyName asc').then(function(results) {
    
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

}

export let getItemType = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);
 
 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select * from FsaCppBidItemCodes where bidNumber = @id and itemNumber = @itemId', {id: req.params.bidId, itemId: req.params.itemId}).then(function(results) {
   
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

}

export let getFeeDistribution = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);
 
 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   console.log(req.params.payee);
   console.log(req.params.type);
   console.log(req.params.payCd);

   db.query('select * from AdminFeeDistributionPct where RTRIM(LTRIM(payeePartner)) = @payee and RTRIM(LTRIM(bidType)) = @type and  RTRIM(LTRIM(payCD)) = @payCd', {payee: req.params.payee, type: req.params.type, payCd: req.params.payCd}).then(function(results) {
   
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

}

export let getItemTypeByBid = (req: Request, res: Response) => {

  var validToken = _api.authCheck(req, res);
 // var validToken = 'success';
 
 if( validToken == 'success') {

   var sworm = require('sworm');
   var db = sworm.db(Constants.configSworm);

   db.query('select distinct itemNumber, itemDescription from FsaCppBidItemCodes where bidNumber = @id', {id: req.params.bidId}).then(function(results) {
   
   //  console.log(results);
     res.send(results);
 });

} else {
  res.json({ message: 'Invalid Token' });	
}

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

export let getPoStatusType = (req: Request, res: Response) => { 

  if( _api.authCheck(req, res) == 'success') {

    var sworm = require('sworm');
    var db = sworm.db(Constants.configSworm);
 
    db.query('select * from PoStatusType').then(function(results) {
     
   
      res.send(results);
  });
 
 } else {
   res.json({ message: 'Invalid Token' });	
 }

}


