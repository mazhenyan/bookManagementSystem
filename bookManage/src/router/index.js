import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import forgetPassword from '@/components/forgetPassword'
import register from '@/components/register'
import notFound from '@/components/notFound'
import userInfo from '@/components/user/userInfo'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: forgetPassword
    },{
      path: '/register',
      name: 'register',
      component: register
    },{
      path: '/userInfo',
      name: 'userInfo',
      component: userInfo
    },{
      path: '*',
      name: 'notFound',
      component: notFound
    }
  ]
})
