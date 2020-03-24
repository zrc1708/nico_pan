const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js') // 导入数据库登录信息
const fs = require("fs");
const path = require('path');
const send = require('koa-send');


const filerouters = new Router()

//文件大小格式转换 
var getsize = function(val){
    if(val.length<=3){
        return val+' b'
    }else if(val.length<=6){
        return val.substring(0,val.length-3)+' kb'
    }else{
        return val.substring(0,val.length-6)+' mb'
    }
}
// 递归删除文件夹
function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
// file日期格式转换
function getdate(val){
    let arr = (val+'').split(' ')
    // [ 'Sun', 'Mar', '22', '2020', '22:48:42', 'GMT+0800', '(GMT+08:00)' ]
    // 一月Jan,二月Feb,三月Mar,四月Apr,五月May,六月Jun,七月Jul,八月Aug,九月Sept,十月Oct,十一月Nov,十二月Dec
    // 2020-03-22 22:24:41
    if(arr[1]==='Jan'){
        arr[1]='01'
    }else if(arr[1]==='Feb'){
        arr[1]='02'
    }else if(arr[1]==='Mar'){
        arr[1]='03'
    }else if(arr[1]==='Apr'){
        arr[1]='04'
    }else if(arr[1]==='May'){
        arr[1]='05'
    }else if(arr[1]==='Jun'){
        arr[1]='06'
    }else if(arr[1]==='Jul'){
        arr[1]='07'
    }else if(arr[1]==='Aug'){
        arr[1]='08'
    }else if(arr[1]==='Sept'){
        arr[1]='09'
    }else if(arr[1]==='Oct'){
        arr[1]='10'
    }else if(arr[1]==='Nov'){
        arr[1]='11'
    }else if(arr[1]==='Dec'){
        arr[1]='12'
    }
    return `${arr[3]}-${arr[1]}-${arr[2]} ${arr[4]}`
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
    // 将文件信息写入数据库
    let category = file.name.split('.')[file.name.split('.').length-1]
    let date = getdate(file.lastModifiedDate)
    let size = getsize(file.size+'')
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `INSERT INTO file ( name, path , type , size , birthtime ) 
                VALUES ( '${file.name}', './${savepath+'/'+file.name}','${category}','${size}','${date}' );`
    const [rs] = await connection.query(sql);

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

// 文件下载接口(文件目录不包括自身)
filerouters.post('/download', async function (ctx) {
    const filename = ctx.request.body.filename
    const filepath = ctx.request.body.filepath
    // 设置实体头（表示消息体的附加信息的头字段）,提示浏览器以文件下载的方式打开
    // 也可以直接设置 ctx.set("Content-disposition", "attachment; filename=" + fileName);
    ctx.attachment(filename);
    await send(ctx, filename, { root: __dirname + '/'+filepath });
});

// 重命名文件接口
filerouters.post('/rename', async function (ctx) {
    const oldname = './'+ctx.request.body.oldname
    const newname = './'+ctx.request.body.newname
    const newfilename = newname.split('/')[newname.split('/').length-1]

    // 更改文件数据库状态
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE file SET name = '${newfilename}' , path = '${newname} '
                WHERE path = '${oldname}' and state = 1;`
    const [rs] = await connection.query(sql);

    await fs.rename(oldname.trim(),newname,(error) => {
        if (error) {
            throw error
        } 
    })
    return ctx.body = {
        message:"重命名成功！",
        code:200,
    };
});

// 删除文件接口
filerouters.post('/remove', async function (ctx) {
    const path = './'+ctx.request.body.path
    const type = ctx.request.body.type

    // 更改文件数据库状态
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `UPDATE file SET state = 0 WHERE 
                path like '%${path}%';`
    const [rs] = await connection.query(sql);

    if(type==='dir'){
        await delDir(path);//删除文件夹
    }else{
        await fs.unlink(path.trim(), (err) => {
            if (err) throw err;
        });
    }
    return ctx.body = {
        message:"删除文件成功！",
        code:200,
    };
});

// 获取最近上传的文件
filerouters.get('/getRecentlyUploadFiles/:num', async function (ctx) {
    let num = ctx.params.num
    // 更改文件数据库状态
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from file where state=1 order by id desc limit ${num}`
    const [rs] = await connection.query(sql);

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获取根据类型查找对应的文件
filerouters.get('/getTypeFiles/:type', async function (ctx) {
    let type = ctx.params.type

    // 根据不同的请求参数进行不同的sql查询
    const connection = await Mysql.createConnection(mysql_nico)
    let sql
    if(type==='ebook'){
        sql = `select * from file where state=1 and
         (type='pdf' or type='mobi' or type='epub') `
    }else if(type==='picture'){
        sql = `select * from file where state=1 and
         (type='png' or type='jpg' or type='jpeg' or type='gif') `
    }else if(type==='video'){
        sql = `select * from file where state=1 and
         (type='mp4' or type='flv' or type='wmv' or type='m4v' or type='rmvb' or type='mov' or type='mkv') 
         `
    }else if(type==='document'){
        sql = `select * from file where state=1 and
         (type='doc' or type='docx' or type='ppt' or type='pptx' or type='xls' or type='xlsx') `
    }else{
        sql = `select * from file where state=1 and
            type!='pdf' and type!='mobi' and type!='epub' and
            type!='png' and type!='jpg' and type!='jpeg' and type!='gif' and
            type!='mp4' and type!='flv' and type!='wmv' and type!='m4v' and type!='rmvb' and type!='mov' and type!='mkv' and
            type!='doc' and type!='docx' and type!='ppt' and type!='pptx' and type!='xls' and type!='xlsx'
            `
    }
    const [rs] = await connection.query(sql);

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 根据文件名查找
filerouters.get('/searchFile/:name', async function (ctx) {
    let name = ctx.params.name

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `select * from file where state=1 and name like '%${name}%'`
    const [rs] = await connection.query(sql);

    return ctx.body = {
        arr:rs,
        code:200,
    };
});

// 获得文件数量数据
filerouters.get('/getAllFileNum', async function (ctx) {
    let arr = [] 
    let sql = ''
    const connection = await Mysql.createConnection(mysql_nico)
    sql = `select COUNT(*) from file where state=1 and
        (type='pdf' or type='mobi' or type='epub') `
    var [rs] = await connection.query(sql);
    arr[0] = rs[0]['COUNT(*)']

    lsql = `select COUNT(*) from file where state=1 and
    (type='png' or type='jpg' or type='jpeg' or type='gif') `
    var [rs] = await connection.query(sql);
    arr[1] = rs[0]['COUNT(*)']

    return ctx.body = {
        // 测试用
        data:arr,
        arr:[
            {value:235, name:'视频广告'},
            {value:274, name:'联盟广告'},
            {value:310, name:'邮件营销'},
            {value:335, name:'直接访问'},
            {value:400, name:'搜索引擎'}
        ],
        code:200,
    };
});
module.exports = filerouters