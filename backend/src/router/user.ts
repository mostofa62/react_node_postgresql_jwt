import express,{Request, Response} from "express";
import { User } from "../models/user";
import {Auth, RequestCustom} from "../middleware/auth";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const { TOKEN_KEY,TOKEN_EXPIRATION } = process.env;


router.post("/register", async (req, res) => {


    try{
        const { name, email, password } = req.body;
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ 
            where:{ email:email }
        });

        if (oldUser) {
            return res.status(409).send({message:"User Already Exist. Please Login"});
        }

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
        name:name,      
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword
    });

    
    // return new user
    res.status(201).json({ message:'Registration Successfully', user:user});

    }catch(error){
        return res.status(401).send({ message: error});
    }

});


router.post("/login", async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send({message:"All input is required"});
      }
      // Validate if user exist in our database
      const user = await User.findOne({ 
        where:{
            email:email
        }
      });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user.id, email },
          TOKEN_KEY,
          {
            expiresIn: TOKEN_EXPIRATION,
          }
        );
  
        // save user token
        user.token = token;

        await user.save();
  
        // user
        res.status(200).json({
          'localId':user.id,
          'displayName':user.name,
          'idToken':user.token,
          //'expiresIn':TOKEN_EXPIRATION
          'expiresIn':3600
        });
      }else{
        res.status(400).send({message:"Invalid Credentials"});
      }
    } catch (err) {
      console.log(err);
    }
});

router.get('/me', Auth,(req:RequestCustom, res:Response) => {
    //console.log(req.user);
    let user = <User>req.user;
    res.status(200).send({ message: `Welcome 🙌 ${user.name}`});
});

router.post('/logout',Auth,async(req:RequestCustom, res:Response)=>{
  try {
    let user = <User>req.user;

    user.token = null;
    req.token = '';
    await user.save()
    res.send({message:'Logout Successfully'})
  } catch (error) {
      res.status(500).send()
  }
});

  

export { router as UserRoutes };