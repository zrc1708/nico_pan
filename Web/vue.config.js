module.exports = {
    
    chainWebpack:config =>{
        //  发布模式
        config.when(process.env.NODE_ENV==='production',config=>{
            // 先清除再添加自己的打包文件
          config.entry('app').clear().add('./src/main-prod.js')
  
          config.set('externals', {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            axios: 'axios',
            'element-ui': 'ELEMENT',
            echarts: 'echarts',
            nprogress: 'NProgress',
            // 'vue-quill-editor': 'VueQuillEditor'
          })
  
        //   config.plugin('html').tap(args=>{
        //     args[0].isProd = true
        //     return args
        //   })
        })
        // 开发模式
        config.when(process.env.NODE_ENV==='development',config=>{
          config.entry('app').clear().add('./src/main-dev.js')
  
        //   config.plugin('html').tap(args=>{
        //     args[0].isProd = false
        //     return args
        //   })
        })
      },
    publicPath: './',  //输出的根路径  默认是/ 如果你的网站是app.com/vue 这更改此配置项
}