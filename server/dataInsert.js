const express = require('express');
const router = express.Router();

const asyncHandler = require('express-async-handler');
const db = require('./db');
const fs = require("fs");
const csv = require("csvtojson");
const moment = require('moment')

let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
console.log(time);

let default_path = process.cwd() + '/public';
console.log(default_path);

csv().fromFile(default_path + "/new.csv").then(asyncHandler(async(jsonArrayObj) => { //when parse finished, result will be emitted here.
    // console.log(jsonArrayObj.length);  
    // console.log(jsonArrayObj); 

    let number,name,password,username;

    for (let i = 0; i < jsonArrayObj.length; i++) {
        console.log(i); 
        console.log(jsonArrayObj[i].username); 
        number = jsonArrayObj[i].number;
        name = jsonArrayObj[i].name;
        password = jsonArrayObj[i].password;
        username = jsonArrayObj[i].username;
        try {
            await db(`insert into radcheck(username, attribute, op, value) VALUE(?, ?, ?, ?)`,[username, 'Cleartext-Password', ':=', password]);

        let query = await db(`Select id from radcheck where username = ?`, [username]);

        await db(`insert into userdata(id, number, name, admin, disable) VALUE(?, ?, ?, ?, ?)`,[query[0].id, number, name, 0, 0]);

        await db(`insert into userbillinfo(username, changeuserbillinfo, nextinvoicedue, billdue, creationdate, creationby) VALUE(?, ?, ?, ?, ?, ?)`,[username, 0, 0, 0, time,'radiusdb']);

        await db(`insert into userinfo(username, changeuserinfo, enableportallogin, creationdate, creationby) VALUE(?, ?, ?, ?, ?)`,[username, 0, 0, time, 'radiusdb']);
        } catch (error) {
            console.log(error);
        }
        
    }
    console.log('success'); 
   }))





// module.exports = router;