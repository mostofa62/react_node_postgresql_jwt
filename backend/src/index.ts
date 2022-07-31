import express from "express";
import { json } from "body-parser";
import * as dotenv from "dotenv";
import * as path from "path";

const cors = require('cors');


//import { Client } from 'pg';
import{ErrorRoute} from './router/error';

import { SequelizeDb } from './config/database';
//import { DatabaseError } from "sequelize/types";
import { User } from './models/user';
import {UserRoutes} from './router/user';



dotenv.config({ path: path.resolve(__dirname, '../.env') })

//console.log(process.env);

const app = express();
const {APP_PORT,DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE,DB_USERNAME, DB_PASSWORD} = process.env;
const port = APP_PORT || 5000;

app.use(json())
app.use(cors({
    origin: '*'
}));
  
//database creation if not exists
const {Client}  = require('pg');

const client = new Client({
    user: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
});

async function DatabaseInit() {

    try{
        await client.connect();
        await client.query(`CREATE DATABASE "${DB_DATABASE}";`);
        await client.end();
        console.log(`${DB_DATABASE} - database created succefully !!! `)
    }
    catch (error) {
        console.error(`database:'${error}`);
    }

}

//DatabaseInit();




//database connection
async function CheckConnection() {
try {
    await SequelizeDb.authenticate();
    console.log('Connection has been established successfully.');
    //await SequelizeDb.sync();
    //User.sync({force:true});
} catch (error) {
    console.error(`Unable to connect to the database:'${error}`);
}
}
CheckConnection();



app.get('/',(req,res)=>{
    res.send('Welcome to nodejs token based authentication api using typescript!!!');
});


app.use('/user',UserRoutes);
app.use(ErrorRoute);

app.listen(port, ()=>{
    console.log(`server is up on  ${port}`);

});