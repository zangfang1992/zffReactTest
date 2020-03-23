import axios from 'axios'
import {stringify} from 'qs'
import router from "../router";
import Vue from 'vue'
import store from '../vuex/store'
import {websock} from './websocket'
import jsSip from './jsSip'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';
// http request 拦截器
axios.interceptors.request.use(
  config => {
      if (store.state.user.userToken) {
          config.headers.token = store.state.user.userToken;
      }
      return config;
  },
  err => {
      return Promise.reject(err);
  });
// http response 拦截器
axios.interceptors.response.use(
    response => {
		if(response instanceof Blob){
			return response;
        }
        if (response.data.status === 1000) {
            return response.data;
        } else {
			switch (response.data.status) {
				case 0:
                case 1001:
                    if(websock){
                        websock.onclose();
                    }//信息过期，关闭长连接和挂断电话
                   if(store.getters.callStatus!=0){
                        jsSip.refuse();
                    }
                    router.replace({
                        path: '/login',
                        query: { redirect: router.currentRoute.fullPath }
                    });
					return Promise.reject(response.data || response.message);
					break;
                default:
                    Vue.prototype.$message.error(response.data.msg || '接口有误，请稍后再操作');
				    return Promise.reject(response.data || response.message);
			}
		}
    },
    error => {
        if (error) {
            if(error.response.data.status=="1001"){
                if(websock){
                    websock.onclose();
                }//信息过期，关闭长连接和挂断电话
                if(store.getters.callStatus!=0){
                    jsSip.refuse();
                }
                router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath }
                });
            }else{
                Vue.prototype.$message.error(error.data && error.data.msg || '接口有误，请稍后再操作');
            }
        }
        return Promise.reject(error)
    }
);
// 封装请求
export function fetch(url, options) {
  let opt = options || {}
  return new Promise((resolve, reject) => {
    axios({
        method: opt.type || 'post',
        url: url,
        params: opt.params || {},
        // 判断是否有自定义头部，以对参数进行序列化。不定义头部，默认对参数序列化为查询字符串。

        data: (opt.headers && opt.headers['Content-Type'].indexOf('x-www-form-urlencoded') > 0 ? stringify(opt.data) : opt.data) || {},
        responseType: opt.responseType || 'json',
        // 设置默认请求头
        headers: opt.headers || { 'Content-Type': 'application/json; charset=UTF-8' },
        //设置超时时间
        timeout: opt.timeout || 60000,
        onUploadProgress: opt.onUploadProgress || null
    }).then(response => {
        resolve(response);
    }).catch(error => {
        reject(error)
    })
})
}
export default axios;
