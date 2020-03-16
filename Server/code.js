
    const Router = require('koa-router')


    const router3 = new Router()

    var svgCaptcha = require('svg-captcha');

    router3.get('/code', async (ctx) => {
        var captcha = svgCaptcha.create({ //这种生成的是随机数验证码
            size: 4, //验证码长度
            fontSize: 50, //字体大小
            ignoreChars: '0o1lLIig', // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            background: '#cccccc', // 验证码图片背景颜色
            width: 100,
            height: 40,
        });
        ctx.body = captcha;
        ctx.session.code = captcha.text.toLowerCase()
    });

    router3.get('/confirmcode', async (ctx) => {
             
        ctx.body = ctx.session.code 

    });

 
    module.exports = router3