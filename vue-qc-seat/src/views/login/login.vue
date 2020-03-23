<template>
	<div class="seat-login">
		<div class="login-content">
			<div class="left-img">
				<img src="../../images/login.png">
      	<img class="icon-logo" src="../../images/logo.png"/>
      </div>
      <div class="right-login-info">
        <span class="seat-title">小意智能坐席辅助</span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="userName">
              <el-input
                prefix-icon="el-icon-user-solid"
                v-model="ruleForm.userName"
                placeholder="请输入邮箱账户">
              </el-input>
            </el-form-item>
            <el-form-item prop="userPwd">
               <el-input
                  prefix-icon="el-icon-s-goods"
                  v-model="ruleForm.userPwd"
                  show-password
                  @keyup.enter.native="login('ruleForm')"
                  placeholder="请输入6到16位字符密码">
                </el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="login('ruleForm')">立即登录</el-button>
            </el-form-item>
        </el-form>
      </div>
		</div>
	</div>
</template>
<script>
import { getPublicKey,doLogin } from '../../api/login-api'
import { JSEncrypt } from "jsencrypt";
import {websocketObj,websock} from '@/libs/websocket.js'
import jsSip from '@/libs/jsSip.js'
const md5 = require('js-md5')
export default {
	data () {
    return {
      ruleForm:{
        userName:'',
        userPwd:'',
      },
      publicKey:'',
      rules:{
        userName:[
          { required: true, message: '请输入邮箱账户', trigger: 'blur' },
        ],
        userPwd:[
          { required: true, message: '请输入账户密码', trigger: 'blur' },
        ]
      }
		}
  },
  created(){
    if(this.callStatus){
        jsSip.refuse(); 
        sessionStorage.clear();
    }
    if(websock){
        websock.onclose();//关闭长连接
    }
  },
  methods:{
    login(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getPublicKey().then((datakey)=>{
            this.publicKey=datakey.data;
            let params = {
              username: this.ruleForm.userName,
              password: this.encryptStr(md5(this.ruleForm.userPwd)),
              publicKey:this.publicKey
            };
            doLogin(params).then((data)=>{
                if(!this.$route.query.redirect || this.$route.query.redirect.indexOf('login')){
                  this.$store.dispatch('userToken', data.data&&data.data.token || {});
                  this.$store.dispatch('userInfo',data.data&&data.data||{})
                  this.$router.push('/callAssistance');
                }else{
                  this.$router.push({ path: this.$route.query.redirect});
                }
            })
          })
        } else {
          console.log('error submit!!');
          return false;
         }
      });
    },
    encryptStr(password){
			let encrypt = new JSEncrypt();
			encrypt.setPublicKey(this.publicKey);
			let encrypted = encrypt.encrypt(password);
			if(encrypted === false){
				return password;
			}
			return encrypted;
    	},
  }
}
</script>

<style lang="less">
    .seat-login{
        background-color: #FBFBFD;
        padding-top: 139px;
        width: 100%;
        height: 100%;
        .login-content{
            font-size:0;
            margin: 0 auto;
            width: 870px;
            display: flex;
            box-shadow:0px 0px 6px rgba(0,0,0,0.08);
            .left-img{
                position: relative;
                width: 450px;
                .icon-logo{
                    position: absolute;
                    top:-24px;
                    left:40px;
                }
            }
            .right-login-info{
              background-color: #fff;
              width: 420px;
              .seat-title{
                color:#293547;
                font-size: 24px;
                line-height: 24px;
                display: block;
                text-align: center;
                padding-top: 70px;
                margin-bottom: 50px;
              }
              .el-input{
                width: 360px;
                height: 46px;
                input{
                  height: 46px;
                }
              }
              button{
                padding:0;
                margin-top: 10px;
                width: 360px;
                height: 46px;
                font-size: 16px;
                background-color:#4A8DF1;
                border-color:#4A8DF1;
              }
            }
        }
        .el-form-item{
          margin-bottom: 30px;
        }
        .el-form-item__error{
          padding-left: 30px;
        }
    }
</style>
