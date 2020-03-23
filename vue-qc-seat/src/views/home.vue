<template>
  <div class="home">
      <div class="header-menu">
        <div class="menu">
          <span class="logo-title">小意智能坐席辅助</span>
          <el-menu
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#323446"
            :router="true"
            text-color="#A4ADC5"
            active-text-color="#fff">
            <el-menu-item index="/callAssistance" >通话辅助</el-menu-item>
            <el-menu-item index="/callRecord" :disabled="callStatus == 2" >通话记录</el-menu-item>
          </el-menu>
        </div>
        <div class="user-info">
            <div v-show="route=='/callAssistance'">
              <el-dropdown @command="handleChoseScene"  trigger="click" v-show="callStatus==0">
                <span class="el-dropdown-link">
                  {{sceneName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in sceneList" :key="index" :command="item.sceneName" :value="item.id" >{{item.sceneName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-input class="calling" v-show="callStatus!=0"
              placeholder=""
              suffix-icon="el-icon-arrow-down"
              :disabled="true"
              v-model="sceneName">
            </el-input>
          <div class="user-name">
            <i class="el-icon-user"></i>
            <span>{{userName}}</span>
          </div>
          <span class="log-out" @click="handleLogOut()">退出</span>
        </div>
      </div>
      <div class="border-line"></div>
      <div class="page-content">
        <router-view></router-view>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { logout } from '../api/login-api'
import { getSceneName, updateSelectedScene ,getSceneUserSelected} from '../api/callAssistance'
import {websocketObj,websock} from '@/libs/websocket.js'
import jsSip from '@/libs/jsSip.js'
export default {
  data(){
    return{
      userName:this.$store.state.user.userInfo.userName,
      sceneName:'',
      sceneList: [],
      route:this.$route.path,
    }
  },
  created(){
    this.jsSipAccount();
    //  this.getSceneName();
  },
  mounted(){
    websocketObj.initWebSocket();//登录成功建立长链接
  },
  methods:{
    jsSipAccount(){
      getSceneUserSelected().then((data)=>{
          let dataSip=data.data;
          this.$store.dispatch('changeSceneId',dataSip[0].sceneId);
          this.$store.dispatch('changeSipObj',dataSip);
          this.getSceneName();
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleChoseScene(command,comp) {
      this.sceneName=command;
      this.$store.dispatch("changeSceneId",comp.$attrs.value);
    },
    handleLogOut(){
      logout().then(()=>{
        if(this.callStatus!=0){
            jsSip.refuse(); 
            sessionStorage.clear();
        }
         if(websock){
            websock.onclose();//关闭长连接
        }
        this.$router.push('/login');
      }) 
    },
    getSceneName(){
        getSceneName().then((data)=>{
          this.sceneList=data.data;
          if(this.sceneList.length>0){
            this.sceneList.map((item)=>{
              if(item.id==this.sceneId){
                this.sceneName=item.sceneName;
              }
            })
          }
           jsSip.init();
          console.log(data);
        })
    },
    // 切换场景时，修改用户绑定的场景
    updateSelectedScene () {
      updateSelectedScene({
        sceneId: this.sceneId,
        sipId: this.$store.getters.sipObj[0].sipId,
        sipName: this.$store.getters.sipObj[0].sipName
      }).then((data)=>{
        console.log(data.msg)
      })
    },
  },
  computed:{
     ...mapGetters([
      'callStatus',//0,没有电话，1有电话呼入，2通话中
      'sceneId'
    ])
  },
  watch: {
    "sceneId":function(newVal,oldVal){
      this.updateSelectedScene();
    },
    $route(to, from) {
      this.route=this.$route.path;
    }
  },
}
</script>

<style lang="less">
  .home{
    height: 100%;
  }
  .header-menu{
    display: flex;
    justify-content:space-between;
    height: 48px;
    background-color: #323446;
    color:#fff;
    .menu{
      display: flex;
      line-height: 46px;
        .logo-title{
          display: block;
          width: 180px;
          font-size: 20px;
          padding-left: 16px;
          text-align: left;
        }
        .el-menu--horizontal>.el-menu-item{
          height: 48px;
          font-size: 16px;
          line-height: 46px;
        }
        .el-menu--horizontal>.el-menu-item.is-active{
          border-bottom: 1px solid transparent;
        }
        .el-menu-item{
          padding:0px 8px;
          margin-left: 60px;
        }
        .el-menu-item:first-child{
          margin-left: 30px;
        }
        .el-menu--horizontal{
          height:48px;
        }
        .el-menu.el-menu--horizontal{
          border:0;
        }
        .el-menu--horizontal>.el-menu-item{
          border-bottom:1px solid transparent;
        }
    }
    .user-info{
      line-height: 48px;
      display: flex;
      .el-input{
        width: 200px;
        margin-right: 19px;
        input{
          text-align: right;
          background: transparent;
          border: 0;
          color: #fff;
        }
        .el-input__suffix{
             color: #fff;
          }
        .el-input--suffix .el-input__inner{
          padding-right: 26px;
        }
      }
      .el-dropdown{
        margin-right: 30px;
        margin-top: 20px;
        cursor: pointer;
        height: 14px;
        .el-dropdown-selfdefine{
          color:#fff;
          display: block;
          margin-top: -20px;
        }
      }
       .user-name{
        margin-left:40px;
        margin-right: 16px;
        .el-icon-user{
          color:#fff;
          margin-right: 6px;
        }
      }
      .log-out{
        margin-right: 32px;
        display: block;
        color:#A4ADC5;
        cursor: pointer;
        &:hover{
          color:#fff;
        }
      }
    }
  }
  .border-line{
    border:1px solid #000;
  }
  .page-content{
    height:calc(100% - 50px);
    background-color: #F9FAFB;
  }
</style>
