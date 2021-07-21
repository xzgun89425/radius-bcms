const express = require('express');
const router = express.Router();

const asyncHandler = require('express-async-handler');
const db = require('../db');
const dateformat = require('dateformat');
const { errorMonitor } = require('events');
const sha256 = require('crypto-js/sha256');


process.env.TZ = 'Asia/Taipei'

function addDays(date,days){
    return date + days *60*60*24*1000;
}

/* GET home page. */
router.post('/login', asyncHandler(async(req, res, next) => {
    let query;
    let { account, password } = req.body;
    // console.log(req);
    // console.log(req.body);
    // console.log(account, password);
    let token;
    try {
        query = await db(`Select u.id, u.username, u.value, d.number, d.name, d.token, d.admin, d.token_create from radcheck as u, userdata as d where u.username = ? and d.disable = 0 and u.id = d.id`,[account]);
    } catch (error) {
        return res.json({ 'success': false, 'status': 401, 'message': error });
    }
    // console.log(query)
    // console.log(query[0])
    // console.log(query[0].value)

    if(query.length > 0){
        console.log(query[0].value == password)
        if(query[0].value == password){
            // console.log('here')
            let time = new Date();
            time = time.getTime();
            // console.log(new Date())
            // console.log(new Date().getTime())
            // console.log(new Date().toLocaleString())
            let id = query[0].id
            let token_create_time

            // console.log(query[0].token_create)

            if (query[0].token_create) {
                token_create_time = addDays(query[0].token_create,7)
            }else{
                token_create_time = 0
            }
            
            if (!query[0].token || token_create_time < time) {
                token = sha256(time+password).toString();
                // console.log(token,time,id)
                try {
                    await db(`update userdata set token = ?, token_create = ? where id = ?`,[token,time,id]);
                    query = await db(`Select u.id, u.username, u.value, d.number, d.name, d.token, d.admin, d.token_create from radcheck as u, userdata as d where u.username = ? and u.id = d.id`,[account]);
                } catch (error) {
                    return res.json({ 'success': false, 'status': 401, 'message': error });
                }
                
                return res.json({ 'success': true, 'status': 201, 'message': '登入成功', 'datas': query });
            }else{
                // query = await db(`Select u.id, u.username, u.value, d.number, d.name, d.token, d.admin, d.token_create from radcheck as u, userdata as d where u.username = ? and u.id = d.id`,[account]);
                return res.json({ 'success': true, 'status': 201, 'message': '登入成功', 'datas': query });
            }
        }else{
            return res.json({ 'success': false, 'status': 401, 'message': '密碼錯誤' });
        }
    }else{
        return res.json({ 'success': false, 'status': 401, 'message': '查無此帳號，請聯絡管理員' });
    }
}));

//我的帳號資料
router.post('/logout', asyncHandler(async(req, res, next) => {
    let { token } = req.body;
    let query;
    try {
        query = await db(`Select u.id, u.username, d.number, d.name, d.admin from radcheck as u, userdata as d where d.token = ? and u.id = d.id`,[token]);
        if (query.length > 0) {
            await db(`update userdata set token = ? where token = ?`,['', token]);
            return res.json({ 'success': true, 'status': 201, 'message': '登出成功' });
        }else{
          return res.json({ 'success': false, 'status': 401, 'message': 'Invalid token，請重新登入' });
        }
    } catch (error) {
        return res.json({ 'success': false, 'status': 401, 'message': error });
    }
}));

module.exports = router;