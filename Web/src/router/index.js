import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "home" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "wlecome" */ '../components/Welcome.vue')
// import Overview from '../components/Overview.vue'
const Overview = () => import(/* webpackChunkName: "Overview" */ '../components/Overview.vue')
// import Lately from '../components/Lately.vue'
const Lately = () => import(/* webpackChunkName: "Lately" */ '../components/Lately.vue')
// import All from '../components/All.vue'
const All = () => import(/* webpackChunkName: "All" */ '../components/All.vue')
// import Ebook from '../components/Ebook.vue'
const Ebook = () => import(/* webpackChunkName: "Ebook" */ '../components/Ebook.vue')
// import Picture from '../components/Picture.vue'
const Picture = () => import(/* webpackChunkName: "Picture" */ '../components/Picture.vue')
// import Video from '../components/Video.vue'
const Video = () => import(/* webpackChunkName: "Video" */ '../components/Video.vue')
// import Document from '../components/Document'
const Document = () => import(/* webpackChunkName: "Document" */ '../components/Document')
// import Other from '../components/Other'
const Other = () => import(/* webpackChunkName: "Other" */ '../components/Other')
// import Search from  '../components/Search'
const Search = () => import(/* webpackChunkName: "Search" */ '../components/Search')
// import Myshare from '../components/Myshare.vue'
const Myshare = () => import(/* webpackChunkName: "Myshare" */ '../components/Myshare.vue')
// import Getfile from '../components/Getfile.vue'
const Getfile = () => import(/* webpackChunkName: "Getfile" */ '../components/Getfile.vue')

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
    {path:'/ebook',component:Ebook},
    {path:'/picture',component:Picture},
    {path:'/video',component:Video},
    {path:'/document',component:Document},
    {path:'/other',component:Other},
    {path:'/search',component:Search},
    {path:'/myshare',component:Myshare},
    {path:'/getfile',component:Getfile},
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
