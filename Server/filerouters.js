const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js') // 导入数据库登录信息
const fs = require("fs");
const path = require('path');
const send = require('koa-send');


const filerouters = new Router()

var getsize = function(val){
    if(val.length<=3){
        return val+' b'
    }else if(val.length<=6){
        return val.substring(0,val.length-3)+' kb'
    }else{
        return val.substring(0,val.length-6)+' mb'
    }
}

//查询所有文件
filerouters.post('/getfile', async ctx => {
    // 获取进行文件查找的路径
    const savepath = ctx.request.body.serverpath; 
    //设置根目录
    var root = './'+savepath;
    var arr = [];
    //调用函数遍历根目录，同时传递 文件夹路径和对应的数组
    //请使用同步读取
    fileDisplay(root, arr);

    function fileDisplay(dirPath, arr) {
        var filesList = fs.readdirSync(dirPath);
        for (var i = 0; i < filesList.length; i++) {
            //描述此文件/文件夹的对象
            var fileObj = {};
            fileObj.name = filesList[i];
            //拼接当前文件的路径(上一层路径+当前file的名字)
            var filePath = path.join(dirPath, filesList[i]);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            var stats = fs.statSync(filePath);
            fileObj.size = getsize(stats.size+'')
            fileObj.path = filePath
            fileObj.birthtime = stats.birthtime
            if (stats.isDirectory()) {
                //如果是文件夹
                fileObj.type = 'dir';
                fileObj.child = [];
                arr.push(fileObj);
                //递归调用
                fileDisplay(filePath, arr[i].child);
            } else {
                //不是文件夹,则添加type属性为文件后缀名
                fileObj.type = path.extname(filesList[i]).substring(1);
                arr.push(fileObj);
            }
        }
    }
    ctx.body={
        arr,
        code:200
    }
});

//创建文件夹接口
filerouters.post('/mkdir', async ctx => {
    const dirname = ctx.request.body.mkdirpath; 
    fs.mkdirSync(`./${dirname}`);

    ctx.body={
        message:'文件夹创建成功',
        code:200
    }
});

// 文件上传接口
filerouters.post('/uploadfile', async (ctx, next) => {
    // 测试上传路径的获取
    const savepath = ctx.request.body.savePath
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    // console.log(file);
    // 创建可读流
    const reader = fs.createReadStream(file.path);

    let filePath = path.join(__dirname, savepath+'') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return ctx.body = {
        message:"上传成功！",
        code:200,
        };
  });


module.exports = filerouters