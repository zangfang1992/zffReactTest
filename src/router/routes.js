const Login = () => import(/* webpackChunkName: "login" */ '@/views/login/login');
const Home = () =>  import ( /* webpackChunkName: "home" */ '@/views/home.vue');
const CallAssistance = () =>  import ( /* webpackChunkName: "callAssistance" */ '@/views/callAssistance.vue');
const CallRecord = () =>  import ( /* webpackChunkName: "callRecord" */ '@/views/callRecord.vue');


const routes = [
    //用户登录模块
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
          title: '用户登录'
      }
    },
    {
      path:'/',
      component:Home,
      children:[{
        path: 'callAssistance',
        name: 'callAssistance',
        component: CallAssistance,
        meta: {
            title: '通话辅助',
            required: true
        }
      },{
        path: 'callRecord',
        name: 'callRecord',
        component: CallRecord,
        meta: {
            title: '通话记录',
            required: true
        }
      }]
    }
  ]
export default routes;
