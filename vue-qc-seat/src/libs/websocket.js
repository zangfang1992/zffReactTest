import store from '../vuex/store'
import Vue from 'vue'
import jsSip from './jsSip'
import router from "../router";
var websock=null;
var websocketObj={};
var globalCallback=null;
websocketObj.initWebSocket=()=>{
	let protocol = "";
    protocol = location.protocol == "https:" ? "wss://" : "ws://";
	//判断当前浏览器是否支持WebSocket
	if ('WebSocket' in window) {
		if (location.hostname == 'localhost') {
			websock = new WebSocket('ws://192.168.88.51:8008/assistance/websocket/'+store.getters.userId)
		} else {
			websock = new WebSocket(protocol + location.hostname + ':' + location.port + '/assistance/websocket/'+store.getters.userId);
		}
	}else {
		alert('当前浏览器不支持websocket')
	}
	websock.onmessage = (e) =>{
		heartCheck.reset();
		websocketObj.websocketonmessage(e);
	}
	websock.onclose =  (e) =>{
		console.log("关闭了");
		websock.close();
	}
	websock.onopen =  ()=> {
		sessionStorage.setItem("websocket",true);
		console.log("长连接连接上了");
		heartCheck.start();//心跳包
	}
	// 连接发生错误的回调方法
	websock.onerror = ()=> {
		console.log('WebSocket连接发生错误')
	}
}
  // 数据接收
  websocketObj.websocketonmessage =(e) =>{
	// console.log(e);
	if(e.data!="HeartReceived"){
		let dataObj=JSON.parse(e.data);
		if(dataObj.loginOutMsg){
			websock.onclose();
			if(store.getters.callStatus!=0){
				jsSip.refuse();
			}
			Vue.prototype.$confirm(dataObj.loginOutMsg, '提示', {
				confirmButtonText: '确定',
				showClose:false,
				showCancelButton:false,
				closeOnPressEscape:false,
				closeOnClickModal:false,
				type: 'warning'
			  }).then(()=> {
				router.replace({
					path: '/login',
					query: { redirect: router.currentRoute.fullPath }
				});
			  });
		}else{
			store.dispatch('changeCallObj',dataObj);
		}
	}
  }
  //心跳检测
  var heartCheck = {
	timeout:540000,//9min
	timeoutObj: null,
	reset(){
		clearInterval(this.timeoutObj);
		this.start();
	},
	start(){
		this.timeoutObj = setInterval(()=>{
			if(websock.readyState==1){
				console.log("我要发心跳包了");
				websock.send("HeartBeat");
			}
		}, this.timeout)
	}
};
export {
	websocketObj,
	websock
  }