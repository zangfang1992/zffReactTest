// Created by xining at 2019/03/20.
import Router from 'vue-router'
import store from '@/vuex/store'
import routes from './routes'
import util from "../libs/util";
import {websock} from '../libs/websocket'
import jsSip from '../libs/jsSip'


var NetWorkStatus = window.navigator.onLine;

const router = new Router({
    // mode: 'history',
    base: '/qc-seat/',
    routes
})
routes.push({
    path: '*',
    component: () => {
        router.push({
            path: '/login'
        })
    }
})

util.addHandler(window, "online", function () {
    NetWorkStatus = true;
    setTimeout(() => { //加上定时器的目的是为了刚刚连接上网络时，vue-router.min.js还没有加载出来的，导致页面无法显示的问题
        window.location.reload();
    }, 2000)
});

util.addHandler(window, "offline", function () {
    NetWorkStatus = false;
    window.location.reload();
})

router.beforeEach((to, from, next) => {
  if (NetWorkStatus) {
      // console.log(!store.getters.token && to.matched.some(r => r.meta.required));
      if (!store.state.user.userToken && to.matched.some(r => r.meta.required) || to.path == '/') {
        if(websock){
            websock.onclose();
        }
        if(store.getters.callStatus!=0){
            jsSip.refuse();
        }
          if (to.path == '/') {
              next({
                  path: '/login',
              });
          } else {
            console.log(222);
              next({
                  path: '/login',
                  query: { redirect: to.fullPath }
              });
          }
      } else {
          next();
      }

  } else {
      Vue.prototype.$Message.error('网络异常，请检查网络连接是否成功！');
  }
})

export default router
