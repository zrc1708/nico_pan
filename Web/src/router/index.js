import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Overview from '../components/Overview.vue'
import Lately from '../components/Lately.vue'
import All from '../components/All.vue'

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

export default router
