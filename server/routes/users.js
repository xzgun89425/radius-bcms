var express = require('express');
var router = express.Router();

const asyncHandler = require('express-async-handler');
const db = require('../db');
const dateformat = require('dateformat');
const { errorMonitor } = require('events');
const sha256 = require('crypto-js/sha256');

const moment = require('moment')



//我的帳號資料
router.post('/data', asyncHandler(async(req, res, next) => {
    let { token } = req.body;
    let query;
    try {
        query = await db(`Select u.id, u.username, d.number, d.name, d.admin from radcheck as u, userdata as d where d.token = ? and u.id = d.id`,[token]);
        if (query.length > 0) {
          return res.json({ 'success': true, 'status': 200, 'message': 'success', 'datas': query });
        }else{
          return res.json({ 'success': false, 'status': 401, 'message': 'Invalid token，請重新登入' });
        }
    } catch (error) {
        return res.json({ 'success': false, 'status': 401, 'message': error });
    }
}));

//一般資料修改
router.post('/data/change', asyncHandler(async(req, res, next) => {
  let { token, username, number, name} = req.body;
  let query,query_check;
  try {
    query_check = await db(`Select u.id, u.username, d.number, d.name, d.admin from radcheck as u, userdata as d where d.token = ? and u.id = d.id`,[token]);
    if (query_check.length > 0) {
      if (!username) {
        return res.json({ 'success': false, 'status': 401, 'message': '帳號為必填' });
      }
      await db(`update radcheck as u, userdata as d set u.username = ?, d.number = ?, d.name = ? where d.token = ? and u.id = d.id`,[username, number, name, token]);

      await db(`update userbillinfo as ub, userinfo as ui set ub.username = ?, ui.username = ? where ub.username = ? and ub.username = ui.username`,[username, username, query_check[0].username]);

      await db(`update radpostauth set username = ? where username = ?`,[username, query_check[0].username]);

      query = await db(`Select u.id, u.username, d.number, d.name, d.admin from radcheck as u, userdata as d where d.token = ? and u.id = d.id`,[token]);
      return res.json({ 'success': true, 'status': 201, 'message': '修改成功', 'datas': query });
    }else{
      return res.json({ 'success': false, 'status': 401, 'message': 'Invalid token，請重新登入' });
    }
    
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));

//密碼修改
router.post('/data/pw_change', asyncHandler(async(req, res, next) => {
  let { token, old_pw, new_pw ,new_pw_check} = req.body;
  let query,query_check;
  try {
    query_check = await db(`Select u.id, u.username, u.value, d.number, d.name, d.token, d.admin, d.token_create from radcheck as u, userdata as d where d.token = ? and u.id = d.id`,[token]);
    if (query_check.length > 0) {
      if (!old_pw || !new_pw || !new_pw_check) {
        return res.json({ 'success': false, 'status': 401, 'message': '所有欄位為必填' });
      }
      if(old_pw == query_check[0].value){
          if (new_pw != new_pw_check) {
            return res.json({ 'success': false, 'status': 401, 'message': '新密碼不一致，請重新輸入' });
          }
          await db(`update radcheck as u, userdata as d set u.value = ? where d.token = ? and u.id = d.id`,[new_pw, token]);
    
          return res.json({ 'success': true, 'status': 201, 'message': '修改成功' });
      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '舊密碼輸入錯誤，請重新輸入' });
      }
      
    }else{
      return res.json({ 'success': false, 'status': 401, 'message': 'Invalid token，請重新登入' });
    }
    
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));

// 所有員工
router.post('/list', asyncHandler(async(req, res, next) => {
  let { token } = req.body;
  let query_check,query_result;
  try {
    query_check = await db(`Select * from userdata where token = ? and admin = 1`, [token]);
      if (query_check.length > 0) {

          // query_result = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = d.id and token != ?`,[token]);
          query_result = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = d.id`);

          return res.json({ 'success': true, 'status': 200, 'message': 'success', 'datas': query_result });

      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '權限錯誤' });
      }
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));

// 新增員工
router.post('/list/add', asyncHandler(async(req, res, next) => {
  let { token, username, password, number, name, admin, disable } = req.body;
  let query_check,query_result;
  let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  console.log(time);
  try {
    query_check = await db(`Select * from userdata where token = ? and admin = true`, [token]);
      if (query_check.length > 0) {
        if (!username || !password) {
          return res.json({ 'success': false, 'status': 401, 'message': '帳號及密碼為必填' });
        }
        await db(`insert into radcheck(username, attribute, op, value) VALUE(?, ?, ?, ?)`,[username, 'Cleartext-Password', ':=', password]);

        let query = await db(`Select id from radcheck where username = ?`, [username]);

        await db(`insert into userdata(id, number, name, admin, disable) VALUE(?, ?, ?, ?, ?)`,[query[0].id, number, name, admin, disable]);

        await db(`insert into userbillinfo(username, changeuserbillinfo, nextinvoicedue, billdue, creationdate, creationby) VALUE(?, ?, ?, ?, ?, ?)`,[username, 0, 0, 0, time, 'radiusdb']);

        await db(`insert into userinfo(username, changeuserinfo, enableportallogin, creationdate, creationby) VALUE(?, ?, ?, ?, ?)`,[username, 0, 0, time, 'radiusdb']);

        query_result = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = d.id`);

        return res.json({ 'success': true, 'status': 201, 'message': '員工「'+ name + '」新增成功', 'datas': query_result });
      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '權限錯誤' });
      }
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));



// 員工id資料get
router.post('/list/get', asyncHandler(async(req, res, next) => {
  let { token, id } = req.body;
  let query_check,query_result;
  try {
    query_check = await db(`Select * from userdata where token = ? and admin = true`, [token]);
      if (query_check.length > 0) {

          query_result = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = ? and u.id = d.id`,[id]);
          
          return res.json({ 'success': true, 'status': 200, 'message': 'success', 'datas': query_result });
      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '權限錯誤' });
      }
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));

// 員工id資料change
router.post('/list/get/change', asyncHandler(async(req, res, next) => {
  let { token, id, username, number, name, disable, admin } = req.body;
  let query_check,query_result;
  try {
    query_check = await db(`Select u.id, u.username, d.number, d.name, d.admin from radcheck as u, userdata as d where d.token = ? and u.id = d.id and admin = true`,[token]);
      if (query_check.length > 0) {
        if (!username) {
          return res.json({ 'success': false, 'status': 401, 'message': '帳號為必填' });
        }
        await db(`update radcheck as u, userdata as d set u.username = ?, d.number = ?, d.name = ?, d.disable = ?, d.admin = ? where u.id = ? and u.id = d.id`,[username, number, name, disable, admin, id]);
        
        await db(`update userbillinfo as ub, userinfo as ui set ub.username = ?, ui.username = ? where ub.username = ? and ub.username = ui.username`,[username, username, query_check[0].username]);

        await db(`update radpostauth set username = ? where username = ?`,[username, query_check[0].username]);
          
        query_result = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = d.id`);
        return res.json({ 'success': true, 'status': 201, 'message': '修改成功', 'datas': query_result });
      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '權限錯誤' });
      }
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));

// 員工id密碼重設
router.post('/list/get/pw_reset', asyncHandler(async(req, res, next) => {
  let { token, id } = req.body;
  let query_check,query_result;
  
    query_check = await db(`Select * from userdata where token = ? and admin = true`, [token]);
      if (query_check.length > 0) {
        try {
          await db(`update radcheck set value = ? where id = ?`,['!Q2w#E4r', id]);
        } catch (error) {
          return res.json({ 'success': false, 'status': 401, 'message': error });
        }
        return res.json({ 'success': true, 'status': 201, 'message': '密碼重設成功' });
      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '權限錯誤' });
      }
  
}));

// 員工帳號刪除
router.post('/list/get/delete', asyncHandler(async(req, res, next) => {
  let { token, id } = req.body;
  let query_check,query_result;
  try {
    query_check = await db(`Select * from userdata where token = ? and admin = true`, [token]);
      if (query_check.length > 0) {
        let query = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = ? and u.id = d.id`,[id]);

        await db(`delete from radcheck where id = ?`,[id]);
        await db(`delete from userdata where id = ?`,[id]);
        await db(`delete from userbillinfo where username = ?`,[query[0].username]);
        await db(`delete from userinfo where username = ?`,[query[0].username]);
        await db(`delete from radpostauth where username = ?`,[query[0].username]);
        
        query_result = await db(`Select u.id, u.username, d.number, d.name, d.disable, d.admin from radcheck as u, userdata as d where u.id = d.id`);

        return res.json({ 'success': true, 'status': 201, 'message': '刪除成功', 'datas': query_result });
      }else{
        return res.json({ 'success': false, 'status': 401, 'message': '權限錯誤' });
      }
  } catch (error) {
      return res.json({ 'success': false, 'status': 401, 'message': error });
  }
}));

module.exports = router;
