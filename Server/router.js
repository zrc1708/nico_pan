const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js')// 导入数据库登录信息

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
        const sql = `SELECT * FROM users where username = '${username}' and userpassword= '${password}'`;
        const [rs] = await connection.query(sql);

        ctx.body = {
            rs
        }
    });

module.exports = router1
