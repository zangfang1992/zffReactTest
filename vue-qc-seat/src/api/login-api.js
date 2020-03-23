import { fetch } from '@/libs/api'
import site from '@@/js/config'

//获取公钥
export const getPublicKey = (params) => fetch(site.base + 'login/getPublicKey', {
    type: 'get',
    params
});
export const doLogin = (data) => fetch(site.base + 'login/doLogin', {
    type: 'post',
    data
});
export const logout = (params) => fetch(site.base + 'login/logout', {
    type: 'get',
    params
});
//在通话过程中，前端跟ESL访问，不再走后端接口，为了避免通话时长超过30分钟过期，在通话过程中前端会请求此接口
export const getNullInterface = (data) => fetch(site.base + 'login/getNullInterface', {
    type: 'get',
    data
});
