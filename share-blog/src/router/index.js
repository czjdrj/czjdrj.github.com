import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index.js';
Vue.use(Router);

//webpack 全量加载
import index from '@/page/index/template.vue';
import detail from '@/page/detail/template.vue';
import create from '@/page/create/template.vue';
import edit from '@/page/edit/template.vue';
import user from '@/page/user/template.vue';
import mine from '@/page/mine/template.vue';
import login from '@/page/login/template.vue';
import register from '@/page/register/template.vue';

const router = new Router({
  routes: [
    {
      path: '/',
      alias: '/index',
      component: index
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/detail/:blogId',//需要传参
      component: detail
    },
    {
      path: '/edit/:blogId',
      component: edit,
      meta: { requiresAuth: true }//自定义meta属性，需要登录权限requiresAuth
    },
    {
      path: '/create',
      component: create,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/:userId',
      component: user
    },
    {
      path: '/mine',
      component: mine,
      meta: { requiresAuth: true }
    }
  ]
});


//webpack 按需加载
// const router = new Router({
//   routes: [
//     {
//       path: '/',
//       alias: '/index',
//       component: () => import('@/page/index/template.vue')
//     },
//     {
//       path: '/login',
//       component: () => import('@/page/login/template.vue')
//     },
//     {
//       path: '/register',
//       component: () => import('@/page/register/template.vue')
//     },
//     {
//       path: '/detail/:blogId',//需要传参
//       component: () => import('@/page/detail/template.vue')
//     },
//     {
//       path: '/edit/:blogId',
//       component: () => import('@/page/edit/template.vue'),
//       meta: { requiresAuth: true }//需要登录权限
//     },
//     {
//       path: '/create',
//       component: () => import('@/page/create/template.vue'),
//       meta: { requiresAuth: true }
//     },
//     {
//       path: '/user/:userId',
//       component: () => import('@/page/user/template.vue')
//     },
//     {
//       path: '/mine',
//       component: () => import('@/page/mine/template.vue'),
//       meta: { requiresAuth: true }
//     }
//   ]
// });


//每次路由跳转的逻辑判断
router.beforeEach(function(to, from, next){//to:将要跳转的路由地址
  let requiresAuth = to.matched.some(function (item) {//boolean 匹配每个路由地址的 meta: { requiresAuth: true }
    return item.meta.requiresAuth;
  });
  // console.log(`登录权限：${requiresAuth}`);

  if(requiresAuth){//如果要将要跳转的路由地址 需要登录权限
    store.dispatch('checkLogin').then(function(isLogin){//然后查一下当前登录状态
      // console.log(`当前的登录状态：${isLogin}`);

      if (!isLogin) {//如果没登录 跳到登录页 然后url上带上to的页面 用于登陆后的重定向
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    });
  }else{
    next();
  }
});

export default router;