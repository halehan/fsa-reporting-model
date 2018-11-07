import { Response, Request, NextFunction } from "express";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { Constants } from '../utils/constants';

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
  
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  var rtn;
 
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

}