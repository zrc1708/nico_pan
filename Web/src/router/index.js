import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Overview from '../components/Overview.vue'
import Lately from '../components/Lately.vue'
import All from '../components/All.vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css' 

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/home'},
  {path:'/home',component:Home,redirect:'/welcome',children:[
    {path:'/welcome',component:Welcome},
    {path:'/overview',component:Overview},
    {path:'/lately',component:Lately},
    {path:'/all',component:All},
  ]},
]

const router = new VueRouter({
  routes
})

router.afterEach(() => {
  NProgress.done()
})

// 挂载路由导航守卫  to表示将要访问的路径，from表示从哪个路径来
// next是一个函数，表示放行，next()放行，next('/login')强制跳转
router.beforeEach((to,from,next)=>{
  NProgress.start()
  next()
})

export default router
