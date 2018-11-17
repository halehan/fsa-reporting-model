import { Response, Request, NextFunction } from "express";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { Constants } from '../utils/constants';
import { api } from '../controllers/api';

let _api = new api();

var SALT_WORK_FACTOR = 10;


    let verifyToken = function(req: Request, res: Response) {
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


export let getHomeContentByName = (req: Request, res: Response) => {

  var validToken =  _api.authCheck(req, res);

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


  
  export let getUsers = (req: Request, res: Response) => {

  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,x-access-token');

  var validToken =  _api.authCheck(req, res);

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

 
export let  getUser = (req: Request, res: Response) => {

   var validToken =  _api.authCheck(req, res);
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
   console.log('found user');
 //   console.log(req.body.password);
 //   console.log(bcrypt.compareSync(req.body.password, pass)); // true
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
          expiresIn : 60*60*2 // expires in 2 hours
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


export let postUser = (req: Request, res: Response) => {
     
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

      
    export let putUser = (req: Request, res: Response) => {

    var validToken =  _api.authCheck(req, res);
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