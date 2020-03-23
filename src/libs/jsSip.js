import Vue from 'vue'
import store from '../vuex/store'
import {getNullInterface} from '../api/login-api'
var wsUrl="",wsUserUrl="",wsPwd="",sipName="";
var hostname = window.location.host.split('.')[0];
switch (hostname) {
    case 'agent-assistance': //线上的地址
		wsUrl="wss://wss.ynt.ai:7443";
        break;
	default: //默认(以下是dev的)
		wsUrl="wss://51.ynt.com:7443"
    	break;
}
// function a(){
//     getSceneUserSelected().then((data)=>{
//         let dataSip=data.data[0].sip;
//         store.dispatch('changeSceneId',data.data[0].sceneId);
//         store.dispatch('changeSipObj',dataSip);
//         sipName=dataSip.sipName;
//         wsUrl="wss://51.ynt.com:7443"
//         wsUserUrl=`sip:${dataSip.sipName}@127.0.0.1:${dataSip.port}`;
//         wsPwd=dataSip.password;
//         jsSip.init();
//     })
// }
// a();
var jsSip = {};
var outgoingSession = null;
var incomingSession = null;
var currentSession = null;
var newRTCSessionData={};

var constraints = {
  audio: true,
  video: false,
};
URL = window.URL || window.webkitURL;

var localStream = null;
var userAgent = null;
var eventHandlers = {
    'progress': function(e) {
        console.log('call is in progress');
        },
    'failed': function(e) {
        console.log('call failed: ', e);
    },
    'ended': function(e) {
        console.log('call ended : ', e);
    },
    'confirmed': function(e) {
        console.log('call confirmed');
    }
};
var options = {
    'eventHandlers'    : eventHandlers,
    'mediaConstraints' : {audio: true,video: false},                          
    'mediaStream': null
};
function createRandomToken (size, base) {
    var i, r,
      token = '';
  
    base = base || 32;
  
    for( i=0; i < size; i++ ) {
      r = Math.random() * base|0;
      token += r.toString(base);
    }
    return token;
  };
jsSip.init=()=>{
    let sipZeroIndex=(store.getters.sipObj)[0].sip
    wsUserUrl=`sip:${sipZeroIndex.sipName}@${sipZeroIndex.ip}:${sipZeroIndex.port}`;
    wsPwd=sipZeroIndex.password;
    let randomToken=createRandomToken(8);
    var socket = new JsSIP.WebSocketInterface(wsUrl);
    
	var configuration = {
		sockets: [ socket ],
		outbound_proxy_set: wsUrl,
		// uri: "sip:1000@62.ynt.com:5060",
		uri: wsUserUrl,
		password: wsPwd,
        register: true,
        register_expires: 3600,
        session_timers: false,
        contact_uri:`sip:${sipZeroIndex.sipName}@${randomToken}.invalid;transport=ws`
    };
    userAgent = new JsSIP.UA(configuration);
    //成功注册成功
    userAgent.on('registered', function (data) {
        console.info("registered: ", data.response.status_code, ",", data.response.reason_phrase);
    });
    //由于注册失败而被解雇
    userAgent.on('registrationFailed', function (data) {
        console.log("registrationFailed, ", data);
    });
    // 在注册期间发射几秒钟，如果应用程序没有为这个事件设置任何监听器，JsSIP将像往常一样重新注册。
    userAgent.on('registrationExpiring', function () {
        console.warn("registrationExpiring");
        console.warn("注册失效");
    });
    //为传入或传出的会话/呼叫。
    userAgent.on('newRTCSession', function (data) {
        console.log("创建会话",data, userAgent.sessions);
        let cur_phone="";
        let str=data.request.headers.From[0].raw;
        cur_phone=str.match(/<sip:(\S*)@/)[1];
        getNullInterface().then(()=>{})
        store.dispatch('changeCallPhone',cur_phone)
        if(Object.keys(userAgent.sessions).length==1){//有几个电话就有几个session,session的对象属性大于等于1，证明有电话在通了
            navigator.getUserMedia({audio:true}, function onSuccess(stream) {//浏览器是否麦克风开启
                console.log('已点击允许,开启成功');
                store.dispatch('changeCallStatus',1);
                newRTCSessionData=data;
                console.log("进来了");
                data.session.on('ended',function(data1){//通话建立挂断
                    store.dispatch('changeCallStatus',0);
                })
                data.session.on('failed',function(data2){
                    store.dispatch('changeCallStatus',0);//未建立就挂断，主要软电话那边挂断
                })
            }, function onError(error) {
                console.log("麦克风开启错误：", error);
                Vue.prototype.$message.error("您的浏览器禁止了麦克风,请开启麦克风后，再拨打");
                data.session.terminate({ 'mediaConstraints': constraints, 'mediaStream': null });
            });
            
        }else{//有电话正在通话了，再次打进来的给挂断
            console.log("session 不为空 即将挂断电话");
            data.session.terminate({ 'mediaConstraints': constraints, 'mediaStream': null });
        }
        
    });
    /**
         * 连接到信令服务器，如果是之前停止则恢复到停止之前的状态，如果是刷新操作‘’
         * 而且configuration的register参数设置为true则直接注册到信令服务器
         */
    userAgent.start();
}
jsSip.connect=()=>{
    let data=newRTCSessionData;
    if (data.originator == 'remote') {
        incomingSession = data.session;
        console.log("这边");
        data.session.answer({'mediaConstraints':constraints, 'mediaStream': null});
    } else {
        outgoingSession = data.session;
        outgoingSession.on('connecting', function (data) {
            console.info('onConnecting - ', data.request);
            currentSession = outgoingSession;
            outgoingSession = null;
        });
    };
    data.session.on('accepted', function (data) {
        console.info('onAccepted - ', data);
        if (data.originator == 'remote' && currentSession == null) {
            currentSession = incomingSession;
            incomingSession = null;
        }
    });
    data.session.on('confirmed', function (data) {
        console.info('onConfirmed - ', data);
        console.info('接通了', data);
        store.dispatch('changeCallStatus',2);
        if (data.originator == 'remote' && currentSession == null) {
            currentSession = incomingSession;
            incomingSession = null;
            // console.info("setCurrentSession - ", currentSession);
        }
    });
    data.session.on('sdp', function (data) {
        console.info('onSDP, type - ', data.type, ' sdp - ', data.sdp);
        //data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/SAVPF');
        //console.info('onSDP, changed sdp - ', data.sdp);
    });

    data.session.on('progress', function (data) {
        console.info('onProgress - ', data.originator);
        if (data.originator == 'remote') {
            console.info('onProgress, response - ', data.response);
        }
    });

    data.session.on('peerconnection', function (data) {
        // console.info('onPeerconnection - ', data.peerconnection);
        data.peerconnection.onaddstream = function (ev) {
            console.info('onaddstream from remote - ', ev);
            youVideo.srcObject = ev.stream;

        };
    });
}
jsSip.refuse=()=>{
    userAgent.terminateSessions(options);
}
export default jsSip;
