import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入elementUI及其样式
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局css样式
import '../src/assets/css/global.css'
// 导入nprogress及其样式
import NProgress from 'nprogress'
import 'nprogress/nprogress'
// 导入axios
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/'
axios.interceptors.request.use(config=>{
    // request拦截器中，展示进度条
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.interceptors.response.use(config=>{
  // response拦截器,隐藏进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
