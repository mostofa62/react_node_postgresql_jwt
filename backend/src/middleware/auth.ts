import {Request, Response, NextFunction} from 'express';
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import {User} from '../models/user';

const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

let token_key = TOKEN_KEY || 'aneasyauthentication';

//custom request for 
export interface RequestCustom extends Request
{
    token?: string;
    user?:User
}

const verify_token = async(req:RequestCustom,res:Response, next:NextFunction)=>{
    try{
    const token =
    req.body.token 
    || req.query.token 
    || req.headers["x-access-token"];
    //|| req.headers["Authorization"].replace('Bearer', '').trim();


    if (!token) {
        return res.status(403).send({message:"A token is required for authentication"});
    }

    
    const decoded = jwt.verify(token, token_key);

    //console.log(decoded);
        
        const user = await User.findOne({
            where:{id: decoded.user_id,token:token }
        });
        

        if(!user){
            throw new Error('User Not Found');
        }
        
    req.token = token;
    req.user = user;
    next()

    }catch(error){
        console.log(error);
        return res.status(401).send({ message: "Invalid Token"});
    }

    

};

export { verify_token as Auth }