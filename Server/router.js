const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js')// 导入数据库登录信息
const jwt = require('jsonwebtoken')

const router1 = new Router()

    //查询所有用户信息接口
    router1.get('/getuser', async ctx => {
        const connection = await Mysql.createConnection(mysql_nico)
        const sql = "SELECT * FROM user";
        const [rs] = await connection.query(sql);
        ctx.body = {
            rs
        }
    });

    //根据用户名和密码查询用户信息接口
    router1.post('/checkuser', async ctx => {
        const username = ctx.request.body.username;        
        const password = ctx.request.body.password;        
        const connection = await Mysql.createConnection(mysql_nico)
        const sql = `SELECT * FROM user where username = '${username}' and password= '${password}'`;
        const [rs] = await connection.query(sql);
        if(rs.length===1){
            let userToken = {
                username,
                id: rs[0].id,
            }
            let secret = 'niconiconi' // 指定密钥
            let token = jwt.sign(userToken, secret, { expiresIn: '2h' }) // 签发token
            ctx.body = {
                rs,
                token,
                code:200
            }
        }else{
            ctx.body = {
                message:'登录失败',
                code:201
            }
        }
        
    });

module.exports = router1
