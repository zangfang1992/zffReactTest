<template>
  <div class="call-assitance">
    <div class="status-monitoring-info">
      <span class="monitoring-result status-monitoring">状态监控</span>
      <!-- <audio  src="http://192.168.88.71/group1/M00/00/27/wKhYTV3bpFyAC26cAB7TbEWkFxQ197.wav" ref="audio" id="audio11" controls muted></audio> -->
      <div class="customer-emotion">
        <span class="emotion-title">客户</span>
        <div :class="['common-emotion',obj.monitoringState.customerEmotion?'emotion-question':'emotion']">
          <span>情绪：</span>
          <i v-show="obj.monitoringState.customerEmotion">{{obj.monitoringState.customerEmotion}}</i>
          <i v-show="!obj.monitoringState.customerEmotion">正常</i>
        </div>
      </div>
      <div class="seat-emotion">
        <span class="emotion-title">坐席</span>
        <div :class="['common-emotion',obj.monitoringState.agentEmotion?'emotion-question':'emotion']">
          <span>情绪：</span>
          <i v-show="obj.monitoringState.agentEmotion">{{obj.monitoringState.agentEmotion}}</i>
          <i v-show="!obj.monitoringState.agentEmotion">正常</i>
        </div>
        <div :class="['common-emotion',obj.monitoringState.speechRate==2?'emotion-question':'emotion']">
          <span>语速：</span>
          <i v-if="obj.monitoringState.speechRate!=2">正常</i>
          <i v-else>过快</i>
        </div>
        <div :class="['common-emotion',obj.monitoringState.interruptCustomer==2?'emotion-question':'emotion']">
          <span>抢话：</span>
          <i v-if="obj.monitoringState.interruptCustomer!=2">正常</i>
          <i v-else>异常</i>
        </div>
        <div :class="['common-emotion',obj.monitoringState.replySpeed==2?'emotion-question':'emotion']">
          <span>响应速度：</span>
          <i v-if="obj.monitoringState.replySpeed!=2">正常</i>
          <i v-else>过慢</i>
        </div>
      </div>
      <div class="border-bg"></div>
      <div class="process-menu">
        <span class="emotion-title status-monitoring">流程导航</span>
        <el-scrollbar :native="false" style="height:calc( 100% - 60px)" id="processScroll">
          <div class="process-content ">
            <div class="left-line">
              <div class="menu-line" v-for="(item,index) in processLine" :key="index">
                <span class="process-line"></span>
                <i v-if="item.type==1" class="process-cur-dot">
                  <b></b>
                </i>
                <i v-else :class="[item.type==0?'process-empty-dot':'process-dot']"></i>
              </div>
              <div class="last-line" v-show="processLine.length>0">
                <span class="process-line"></span>
              </div>
            </div>
            <div class="right-content">
              <div  v-for="(item,index) in processLine" :key="index">
                <div v-if="item.type==1" class="process-talking common-talk">
                  <el-popover
                      popper-class="process-pop"
                      placement="right"
                      width="187"
                      trigger="hover"
                      :content="item.content">
                      <span slot="reference">{{item.name}}</span>
                    </el-popover>
                </div>
                <div v-else :class="['common-talk',item.type!=2?'process-talk':'process-talked']">
                  <el-popover
                      popper-class="process-pop"
                      placement="right"
                      width="187"
                      trigger="hover"
                      :content="item.content">
                      <span slot="reference" :class="{'talkColor':item.type==1}">{{item.name}}</span>
                    </el-popover>
                  <i v-show="item.type==2" class="el-icon-check"></i>
                  <svg v-show="item.type==3" class="iconjinggao" aria-hidden="true">
                      <use xlink:href="#iconjinggao"></use>
                    </svg>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="center-info">
      <div class="calling">
        <div class="calling-title">
          <span>实时通话</span>
            <el-popover
              v-show="callStatus==1"
              placement="bottom-end"
              width="286"
              v-model="popVisible">
              <div class="connect-phone">
                <p>
                  <svg class="icontishi" aria-hidden="true">
                    <use xlink:href="#icontishi"></use>
                  </svg>
                  是否接听来自{{callPhone}}的电话？</p>
                <div>
                  <span class="refuse" @click="refuse()">拒绝</span>
                  <span class="connect" @click="connect()">接通</span>
                </div>
              </div>
              <span slot="reference">新来电
                <svg class="iconjietong" aria-hidden="true">
                  <use xlink:href="#iconjietong"></use>
                </svg>
              </span>
            </el-popover>
          <div v-show="callStatus==2" class="connct-calling">通话中... 
            <svg class="iconguaduan" aria-hidden="true" @click="refuse()">
              <use xlink:href="#iconguaduan"></use>
            </svg>
          </div>
        </div>
        <div class="calling-content" >
          <el-scrollbar :native="false" style="height:calc( 100% )" id="callingScroll">
            <div class="detail-info"  v-for="(item,index) in callText" :key="index"  >
              <div :class="[item.speak==0?'seat':'customer']">
                <span v-if="item.speak==0">坐席</span>
                <span v-else>客户</span> 
                <div v-html="item.text"></div>
                <div class="sensitiveWords" v-if="item.sensitiveWordList.length>0&&item.speak==0">触发敏感词(负面类)：请注意您的言辞</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="bottom-part">
        <div class="recommend">
          <span>话术推荐</span>
          <div class="recommend-content">
            <span>推荐回复：
              <i v-show="obj.processHint.currentProcess">【{{obj.processHint.currentProcess}}】</i>
            </span>
            <el-scrollbar :native="false" style="height:calc( 100% - 46px)" id="recommendScroll">
              <div v-show="obj.processHint.currentText!=''" class="recommend-info">{{obj.processHint.currentText}}</div>
              <div v-for="(item,index) in obj.processHint.backupTextList" :key="index" class="recommend-info">
                {{item}}
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="knowledge">
          <div class="knowledge-title">
            <span :class="{'curKnowledge':knowledgeType!='tip'}" @click="knowledgeClick('tip')">知识库提示</span>
            <i>|</i>
            <span :class="[knowledgeType!='search'?'curKnowledge':'']"   @click="knowledgeClick('search')">知识库查询</span>
          </div>
          <div class="knowledge-content">
            <span v-show="knowledgeType=='tip'">关键词：<i v-if="knowledgeKey">【{{knowledgeKey}}】</i></span>
            <el-input  v-show="knowledgeType=='search'"
              size="mini"
              placeholder="请输入关键词"
              maxlength="20"
              v-model="knowledgeSearchKey"
               @keyup.enter.native="searchKnowledgeList()">
              <i slot="suffix" class="el-icon-search" @click="searchKnowledgeList()"></i>
            </el-input>
            <el-scrollbar :native="false" style="height:calc( 100% - 46px)" id="knowledgeScroll">
              <div class="knowledge-info" v-for="(item,index) in konwledgeList" :key="index">
                <span>{{item.question}}</span>
                <p v-html="item.answer"></p>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <div class="right-info">
      <span class="monitoring-result status-monitoring">用户画像</span>
      <div class="user-info-wrap">
        <el-scrollbar :native="false" style="height:calc( 100% - 46px)" id="userScroll">
          <!-- <div class="user-info" v-for="(item,key) in analysisResult" :key="key">
            <span>{{item}}</span>
            <el-input v-if="key=='address'"  v-model="obj.analysisResult.analysisResult[key]" @focus="showSaveBtn = true" type="textarea"  maxlength="50"></el-input>
            <el-input v-else  v-model="obj.analysisResult.analysisResult[key]" @focus="showSaveBtn = true"  maxlength="50"></el-input>
          </div> -->
          <div class="user-info">
            <span>姓名</span>
            <i>张三</i>
          </div>
          <div class="user-info">
            <span>客户号码</span>
            <i>17715198888</i>
          </div>
          <div class="user-info">
            <span>客户地址</span>
            <i style="padding-left:24px">苏州工业园区若水路</i>
          </div>
          <div class="user-info">
            <span>信用卡尾号</span>
            <i>1388</i>
          </div>
          <div class="user-info">
            <span>欠款金额</span>
            <i>5000</i>
          </div>
          <div class="user-info">
            <span>逾期时间</span>
            <i>3个月</i>
          </div>
         
          <div class="user-info">
            <span>追回货款</span>
             <el-select v-model="testSelect1"   class="test-select">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
          </div>
          <div class="user-info">
            <span>工单是否完结</span>
            <el-select v-model="testSelect2"   class="test-select">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
            </el-select>
          </div>
           <div class="user-info">
            <span>备注</span>
             <el-input   type="textarea"  maxlength="50"></el-input>
          </div>
        </el-scrollbar>
        <div class="save-btn-wrap"  @click="saveUserAnalysis()">保存</div>
        <!-- <div class="save-btn-wrap" v-if="showSaveBtn" @click="saveUserAnalysis()">保存</div> -->
      </div>
      <div class="border-line"></div>
      <div class="user-focus">
        <span class="status-monitoring">标签</span>
        <el-scrollbar :native="false" style="height:calc(100% - 55px)" id="tagScroll">
          <span class="focus-tag" v-for="(item,index) in obj.monitorTagAndFocus.tag" :key="index"> {{item}}</span>
          <span class="focus-tag" v-for="(item,index) in obj.monitorTagAndFocus.focus" :key="'index'+index"> {{item}}</span>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import jsSip from '@/libs/jsSip.js'
import {initialNaturalFlow,getGrabInfoBySceneId,knowledgeSearchInfo,getSceneUserSelected, saveAnalysis} from '../api/callAssistance'

export default {
  data(){
    return{
      popVisible:false,
      analysisResult:[],
      b:{},
      callText:[],
      processLine:[],
      orgProcessLine:[],
      knowledgeType:"tip",
      knowledgeKey:'',
      knowledgeSearchKey:'',
      konwledgeList:[],
      showSaveBtn: false,

      obj:{
        //用户画像
        "analysisResult": {
            "analysisResult": {
            }
        },
        "monitoringState": {
            "agentEmotion": "", //客户情绪
            "customerEmotion": "", //坐席情绪
            "interruptCustomer": 1, //坐席抢话 1:正常  2：异常
            "replySpeed": 1, //坐席响应速度 1:正常  2：过慢
            "speechRate": 1 //坐席说话语速 1:正常  2：过快
        },
        "processHint": {
            "currentProcess": "", //当前流程
            "currentText": "", //当前话术
            "backupTextList":[], //备用话术
            "naturalStatusVOList": [{
                "id": null, //流程id
                "type": null// 0 未触发 1 进行中 2 已触发 3 跳过的
            }]
        },
        "realTimeCall": {
            "finished": null, // 是否结束
            "keyword": null, // 高亮关键词
            "speak": null, // 0 坐席 or 1 客户
            "speakTime": 0,
            "text": "", // 通话文本
            "sensitiveWordList": [{
                "type": "", // 敏感词类型
                "word": "" // 敏感词
            }]
        },
         // 知识库提示
        "knowledgeTip": {
            "cnt": 0,
            "keyWord": "", // 关键词
            "knowledgeQuestionVOList": [
              // {"answer": "", // 标准问题
              //   "question": "" //  问题回答}
            ]
        },
        //关注点以及标签
        "monitorTagAndFocus":{
            "tag":[],  //标签
            "focus":[]  //关注点
        }
      },
      testSelect1:1,
      testSelect2:1
    }
  },
  created(){
  },
  mounted(){
    if(this.sceneId!=-1){
      this.initialNaturalFlow();
      this.getGrabInfoBySceneId();
    }
   
  },
  methods:{
    init(){//初始化
      this.callText=[];
      this.processLine=JSON.parse(JSON.stringify(this.orgProcessLine));
      this.konwledgeList=[];
      this.knowledgeType="tip";
      this.knowledgeKey='';
      this.knowledgeSearchKey='';

       this.obj={
          //用户画像
          "analysisResult": {
              "analysisResult": {
              }
          },
          "monitoringState": {
              "agentEmotion": "", //客户情绪
              "customerEmotion": "", //坐席情绪
              "interruptCustomer": 1, //坐席抢话 1:正常  2：异常
              "replySpeed": 1, //坐席响应速度 1:正常  2：过慢
              "speechRate": 1 //坐席说话语速 1:正常  2：过快
          },
          "processHint": {
              "currentProcess": "", //当前流程
              "currentText": "", //当前话术
              "backupTextList":[], //备用话术
              "naturalStatusVOList": [{
                  "id": null, //流程id
                  "type": null// 0 未触发 1 进行中 2 已触发 3 跳过的
              }]
          },
          "realTimeCall": {
              "finished": null, // 是否结束
              "keyword": null, // 高亮关键词
              "speak": null, // 0 坐席 or 1 客户
              "speakTime": 0,
              "text": "", // 通话文本
              "sensitiveWordList": [{
                  "type": "", // 敏感词类型
                  "word": "" // 敏感词
              }]
          },
          // 知识库提示
          "knowledgeTip": {
              "cnt": 0,
              "keyWord": "", // 关键词
              "knowledgeQuestionVOList": [
              ]
          },
          //关注点以及标签
          "monitorTagAndFocus":{
              "tag":[],  //标签
              "focus":[]  //关注点
          }
        }
    },
    toggleSound() {
      var music = document.getElementById("audio11");//获取ID  
      console.log(music);
      music.play();
    },
    initialNaturalFlow(){
      initialNaturalFlow({
        sceneId:this.sceneId
      }).then((data)=>{
        this.processLine=data.data;
        this.orgProcessLine=data.data;//为了初始化
        console.log(data);
      })
    },
    getGrabInfoBySceneId(){
      getGrabInfoBySceneId({
        sceneId:this.sceneId
      }).then((data)=>{
        this.analysisResult=[];
        this.analysisResult=data.data;
      })
    },
    connect(){
      jsSip.connect();
      // this.audio.pause();
      this.popVisible=false;
    },
    refuse(){
      jsSip.refuse();
      // this.audio.pause();
      this.popVisible=false;
    },
    knowledgeClick(type){
      this.knowledgeType=type;
      if(type=="tip"){
        this.konwledgeList=this.obj.knowledgeTip.knowledgeQuestionVOList||[];
      }else{
        this.searchKnowledgeList();
      }
    },
    searchKnowledgeList(){
      knowledgeSearchInfo({
        "sceneId":this.sceneId,
        "search":this.knowledgeSearchKey
      }).then((data)=>{
        this.konwledgeList=[];
        data.data=data.data||[];
        for(let i=0;i<data.data.length;i++){
          this.konwledgeList.push(data.data[i].question);
        }
        console.log(this.konwledgeList);
      })
      console.log("我点击了搜索");
    },
    // 保存用户画像
    saveUserAnalysis () {
      let tempArr1 = []
      let tempArr2 = []
      let temArr3 = []
      let tempObj = this.obj.analysisResult.analysisResult
      tempArr1 = Object.keys(tempObj).map(item => ({enName:item, value:tempObj[item]}))
      tempArr2 = Object.keys(this.analysisResult).map(item => ({enName:item, cnName:this.analysisResult[item]}))
      for (let i in tempArr1) {
        for (let k in tempArr2) {
          if (tempArr1[i].enName == tempArr2[k].enName) {
            temArr3.push({
              enName: tempArr1[i].enName,
              cnName: tempArr2[k].cnName,
              value: tempArr1[i].value
            })
          }
        }
      }
      console.log(temArr3)
      if(this.callObj.channelId){
        saveAnalysis({
          channelId: this.callObj.channelId,
          isHangup: this.callStatus == 2 ? 0 : 1,
          customerAnalysisResult: temArr3
        }).then((data)=>{
          this.$message.success('保存成功！')
        })
      }else{
        this.$message.warning('目前没有通话，无法保存')
      }
    },
    isTextFished(arr,speak){//判断对话和角色到哪里完成
      let speakIndex=-1;
      for(let i=arr.length-1;i>=0;i--){
        if(arr[i].speak==speak&&!arr[i].finished){
          speakIndex=i;
          break;
        }
      }
      return speakIndex;
    },
  },
  computed:{
    ...mapGetters([
      'callStatus',//0,没有电话，1有电话呼入，2通话中
      'callPhone',//当前呼入的号码
      'callObj',
      'sceneId'
    ])
  },
  watch:{
    "callObj":{
      handler:function(newVal,oldVal){
        // console.log(newVal===oldVal,"newVal==oldVal");
        if(this.callStatus==2){//正在通话中才会渲染，防止电话未挂断说话继续推送数据
          if(newVal.hasOwnProperty("analysisResult")&&newVal.analysisResult){//对象里面是否含有用户画像，有的画数值改变吗，没有数值没有变化
            this.obj.analysisResult.analysisResult=newVal.analysisResult.analysisResult||{};
            // console.log("我是用户画像的对象",this.obj.analysisResult.analysisResult);
          }
          if(newVal.hasOwnProperty("monitoringState")&&newVal.monitoringState){
            this.obj.monitoringState=Object.assign(this.obj.monitoringState,newVal.monitoringState); 
          }
          if(newVal.hasOwnProperty("processHint")&&newVal.processHint){
            this.obj.processHint=newVal.processHint;
            //  //推荐得滚动条到最下面
            document.querySelector("#recommendScroll .el-scrollbar__wrap").scrollTop =document.querySelector("#recommendScroll .el-scrollbar__view").offsetHeight;
            this.processLine&&this.processLine.map((item)=>{
              this.obj.processHint.naturalStatusVOList.map((item1)=>{
                if(item.id==item1.id){
                  item.type=item1.type
                }
              })
            })
          }
          if(newVal.hasOwnProperty("realTimeCall")&&newVal.realTimeCall){
            console.log("我是通话的内容",newVal.realTimeCall.text);
            // 给敏感词加下划线
            let realTimeCallObj=JSON.parse(JSON.stringify(newVal.realTimeCall));
            realTimeCallObj.sensitiveWordList=realTimeCallObj.sensitiveWordList||[];//将返回null改为[]
            if(realTimeCallObj.sensitiveWordList.length>0){
              // console.log(realTimeCallObj.sensitiveWordList,"newVal.realTimeCall.sensitiveWordList");
              for(let i=0;i<realTimeCallObj.sensitiveWordList.length;i++){
                realTimeCallObj.text=realTimeCallObj.text.replace(new RegExp(realTimeCallObj.sensitiveWordList[i].word,'g'),`<span style="border-bottom:1px solid #C65154;color:#293547;display:inline-block">${realTimeCallObj.sensitiveWordList[i].word}</span>`)
              }
            } 
            // 知识库文字标黄(多个关键词)
            let keywordList=realTimeCallObj.keyword||[];
            for(let i=0;i<keywordList.length;i++){
              realTimeCallObj.text= realTimeCallObj.text.replace(new RegExp(keywordList[i],'g'),`<span style=color:#FBB13F>${keywordList[i]}</span>`)
            }
            if(this.callText.length==0){//空数组直接push
              this.callText.push(realTimeCallObj);
            }else if(this.callText.length==1){
              if(this.callText[this.callText.length-1].finished){
                this.callText.push(realTimeCallObj);
              }else{
                this.$set(this.callText,this.callText.length-1,realTimeCallObj);
              }
            }else{
              let getSpeakIndex=this.isTextFished(this.callText,realTimeCallObj.speak);
              console.log(getSpeakIndex,"getSpeakIndex");
              if(getSpeakIndex!=-1){
                this.$set(this.callText,getSpeakIndex,realTimeCallObj);
              }else{
                this.callText.push(realTimeCallObj);
              }
            }
            this.$nextTick(()=>{
              document.querySelector("#callingScroll .el-scrollbar__wrap").scrollTop =document.querySelector("#callingScroll .el-scrollbar__view").offsetHeight;
            })
          }
          if(newVal.hasOwnProperty("knowledgeTip")&&newVal.knowledgeTip){
            this.obj.knowledgeTip=newVal.knowledgeTip; 
            this.konwledgeList=JSON.parse(JSON.stringify(this.obj.knowledgeTip.knowledgeQuestionVOList));
            let curKnowledgeKey=newVal.knowledgeTip.keyWord||[];
            this.knowledgeKey=curKnowledgeKey.join(",");
            for(let i=0;i<this.konwledgeList.length;i++){//关键词是个数组
              for(let j=0;j<curKnowledgeKey.length;j++){
                this.konwledgeList[i].answer=this.konwledgeList[i].answer.replace(new RegExp(curKnowledgeKey[j],'g'),`<span style=color:#FBB13F>${curKnowledgeKey[j]}</span>`)
              }
            }
          }
          if(newVal.hasOwnProperty("monitorTagAndFocus")&&newVal.monitorTagAndFocus){
            this.obj.monitorTagAndFocus=newVal.monitorTagAndFocus; 
          }
         if(this.callStatus==0){//挂断电话初始化情绪相关的内容
          this.obj.monitoringState= {
              "agentEmotion": "", //客户情绪
              "customerEmotion": "", //坐席情绪
              "interruptCustomer": 1, //坐席抢话 1:正常  2：异常
              "replySpeed": 1, //坐席响应速度 1:正常  2：过慢
              "speechRate": 1 //坐席说话语速 1:正常  2：过快
            }
          }
        }
      },
      deep:true
    },
    "sceneId":function(newVal,oldVal){
      this.initialNaturalFlow();
      this.getGrabInfoBySceneId();
    },
    "callStatus":function(newVal,oldVal){
      var music = document.getElementById("audio11");//获取ID  
      if(newVal==1){//再次有电话初始化
        this.popVisible=true;
        // this.toggleSound();
        console.log(11);
        this.init();
      }else if(newVal==2){
        // music.pause();
      }else{
        this.popVisible=false;
        // music.pause();
      }
      if (newVal==2) {
        console.log('通话中禁用F5')
        document.onkeydown = function (e) {
          if (e.keyCode === 116) {
            this.$message.error('通话中时禁止刷新页面');
            return false;
          }
        };
      }
    }
  },
}
</script>
<style lang="less">
  .call-assitance{
    height:100% ;
    display: flex;
    justify-content:space-between;
    text-align: left;
    .monitoring-result{
      display: block;
      height: 32px;
    }
    .status-monitoring{
      padding-left: 16px;
      background-color:#3D4256;
      margin-bottom: 16px;
      height: 32px;
     line-height: 32px !important;
    }
    .status-monitoring-info{
      color:#fff;
      width: 180px;
      background-color:#323446 ;
      line-height: 32px;
      .emotion-title{
        line-height: 14px;
        display: block;
      }
      .customer-emotion{
        padding-left: 16px;
        margin-bottom: 40px;
      }
      .common-emotion{
          display: flex;
          justify-content:space-between;
          margin-top:12px;
          background-size: contain;
          width: 148px;
          i{
            padding-right: 22px;
          }
      }
      .emotion-question{
        background-image: url("../images/emotion-question.png");
      }
      .emotion{
        background-image: url("../images/emotion.png");
      }
      .seat-emotion{
        padding-left: 16px;
        margin-bottom: 56px;
      }
      .border-bg{border:1px solid #000;}
      .process-menu{
        height:calc(100% - 395px);
        .process-content{
          display: flex;
          padding-left: 16px;
        }
        .left-line{
          margin-top: 24px;
          .process-line{
            display: block;
            height: 40px;
            border-left:1px solid #54B2FD;
            margin-left: 3px;
          }
          .menu-line{
            &:first-child{
              .process-line{
                height:15px;
              }
            }
          }
          .last-line{
            .process-line{
                height:45px;
              }
          }
          .process-dot{
            display: block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #54B2FD;
          }
          .process-cur-dot{
            display: block;
            border-radius: 50%;
            background-color: #323446;
            border:1px solid #fff;
            width: 11px;
            height:11px;
            margin-left: -2px;
            b{
              display: block;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background-color: #fff;
              margin:2px 0 0 2px;
            }
          }
          .process-empty-dot{
            display: block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #323446;
            border:1px solid #A4ADC5;
          }
        }
        .right-content{
          margin: 12px 0px 0 12px;
          width: 120px;
          &>div:first-child{
            .common-talk{
              margin-top: 26px;
            }
          }
          .common-talk{
            height:46px;
            line-height: 14px;
            display: flex;
            justify-content:space-between;
          }
          .process-talking{
            color:#fff;
            span{
              font-weight: 700;
            }
          }
          .process-talked{
            color:#54B2FD;
          }
          .process-talk{
            color:#868FA8;
          }
          .talkColor{
            color:#54B2FD;
          }
        }
      }
    }
    .center-info{
      background-color:#F9FAFB;
      width:calc(100% - 396px);
      padding: 12px 15px 20px;
      color:#293547;
      .calling{
        color:#293547;
        border-radius: 4px;
        height: 58%;
        min-height:354px;
        padding-bottom: 24px;
        .calling-title{
          height: 32px;
          line-height: 32px;
          display: flex;
          justify-content:space-between;
           &>span{
            display: block;
            line-height: 32px;
          }
          .iconjietong{
              width:20px;
              height:20px;
              vertical-align: -5px;
              overflow: hidden;
            }
          .connct-calling{
            color:#A4ADC5;
            font-size: 12px;
            .iconguaduan{
              width:20px;
              height:20px;
              vertical-align: -5px;
              overflow: hidden;
              cursor: pointer;
            }
          }
        }
        .calling-content{
          box-shadow: rgba(83, 150, 255,0.12) 0px 6px 16px;
          background-color:#fff ;
          min-height: 300px;
          border-radius: 4px;
          height: calc(100% - 32px);
          color:#293547;
          padding:24px 0;
          .el-scrollbar__wrap{
            overflow: auto;
          }
          .detail-info{
            padding:0 24px;
            width: 100%;
            &:after{
              content: " ";
              display: block;
              clear: both;
            }
            span{
              color:#A4ADC5;
              line-height: 14px;
              margin-bottom: 8px;
            }
            &>div{
              div:nth-child(2){
                padding:10px 14px;
                line-height: 19px;
                border-radius:4px;
              }
            }
          }
        }
        .sensitiveWords{
          font-size: 12px;
          color:#C65154;
        }
        .seat{
          float: right;
          max-width: 85%;
          margin-top: 5px;
          span{
            text-align: right;
            display: block;
          }
          div:nth-child(2){
            background:rgba(227,242,253,1);
          }
          .sensitiveWords{text-align: right}
        }
        .customer{
          float: left;
          max-width: 85%;
          margin-top: 5px;
          &>span{
            display: block;
          }
          div:nth-child(2){
            background:rgba(242,244,246,1);
          }
        }
      }
      .bottom-part{
        display: flex;
        justify-content:space-between;
        height:40%;
        .recommend{
          width: 49%;
          margin-right: 16px;
          .recommend-content{
            height:calc(100% - 32px);
            padding:16px 0px 0px 0px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 16px 0px rgba(83,150,255,0.12);
            border-radius:2px;
            margin-top: 10px;
            .el-scrollbar__wrap{
              overflow: auto;
              padding: 0 28px 0 24px;
            }
            &>span{
              color:#A4ADC5;
              line-height: 14px;
              margin-bottom: 16px;
              display: block;
              padding:0 28px 0 16px;
            }
            .recommend-info{
              margin-top: 24px;
              padding:8px 16px;
              color:#fff;
              background:rgba(249,250,251,1) linear-gradient(270deg,rgba(81,175,253,1) 0%,rgba(98,192,253,1) 100%);
              border-radius: 4px;
              &:first-child{
                margin-top: 0px;
              }
            }
          }
        }
        .knowledge{
          width: 49%;
          .knowledge-title{
            line-height: 28px;
            margin-top: -5px;
            span{
              cursor: pointer;
            }
            i{
              font-size: normal;
              display:inline-block;
              color:#DDDEE1;
              margin:0 12px;
            }
            .curKnowledge{
               color:#A4ADC5;
            }
          }
          .knowledge-content{
            height:calc(100% - 32px);
            padding:16px 0 0px 0px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 16px 0px rgba(83,150,255,0.12);
            border-radius:2px;;
            margin-top:8px;
            .el-icon-search{
              line-height: 28px;
              cursor: pointer;
            }
            .el-scrollbar__wrap{
              overflow: auto;
            }
            .el-input--mini{
              width: 207px;
              margin: 0px 28px 16px 16px;
            }
            &>span{
              color:#A4ADC5;
              display: block;
              line-height: 14px;
              padding: 0px 28px 16px 16px;
            }
            .knowledge-info{
              margin:0 24px 24px 16px;
              &>span{
                padding-left: 8px;
                width: 100%;
                display: block;
                height: 24px;
                line-height: 24px;
                background:linear-gradient(270deg,rgba(255,255,255,1) 0%,rgba(242,244,246,1) 100%);
                color:#909499;
                font-size: 12px;
              }
              &>p{
                line-height: 20px;
                padding:8px 8px;
                color:#57626D;
              }
            }
          }
        }
      }
    }
    .right-info{
      color:#fff;
      width: 216px;
      background-color:#323446 ;
      line-height: 32px;
      .user-info-wrap{
        position: relative;
        min-height: 400px;
        overflow-y: hidden;
        height: 65%;
      }
       #userScroll .el-scrollbar__wrap{
         overflow:auto;
          margin-bottom: 0px !important;
          margin-right: 0px !important;
      }
      .user-info{
        display: flex;
        padding:16px 16px 0;
        span{
          display: block;
          width: 90px;
        }
        .el-input{
          width: 160px;
          .el-input__inner{
            height: 32px;
            line-height: 32px;
            border: 1px solid #000;
            background-color: rgba(35, 38, 53, 1);
            color: #fff;
            padding:0 12px;
          }
        }
        .el-textarea{
          width: 160px;
          .el-textarea__inner{
            border: 1px solid #000;
            background-color: #323446;
            background-color: rgba(35, 38, 53, 1);
            color: #fff;
            padding:0 12px;
            height: 88px;
          }
        }
      }
      .border-line{
        // margin-top: 50px;
        border:1px solid #000;
      }
      .user-focus{
         height:calc(35% - 85px);
        &>span{
          display: block;
          line-height: 14px;
        }
        .focus-tag{
          padding:16px 16px 0px 8px;
          display:inline-block;
          margin-top: 8px;
          line-height: 14px;
          padding:7px 12px;
          background-color: #59637F;
          margin-left: 8px;
          border-radius: 2px;
        }
      }
    }
    #callingScroll  .el-scrollbar__wrap {
      margin-bottom: -17px !important;
      margin-right: -17px !important;
      overflow: auto;
    }
  }
  #tagScroll .el-scrollbar__wrap{
    overflow: auto;
  }
  #processScroll .el-scrollbar__wrap{
    overflow:auto;
    // margin-bottom: 0px !important;
    // margin-right: 0px !important;
  }
  .hightlight{
    color:red;
  }
  .save-btn-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #59637F;
    color: #fff;
    cursor: pointer;
  }
  .connect-phone{
    p{
      color:#57626D;
      font-size: 13px;
    }
    div{
      text-align: right;
      font-size: 12px;
      .refuse{
        cursor: pointer;
      }
      .connect{
        cursor: pointer;
        display:inline-block;
        width: 48px;
        height: 24px;
        background-color:#2196F3;
        border-radius: 2px;
        line-height: 24px;
        color:#fff;
        text-align: center;
        margin-left: 16px;
        margin-top: 12px;
      }
    }
    .el-icon-info{
      margin-right: 8px;
      color:#2196F3;
    }
  } 
  .process-pop{
    padding:12px 16px !important;
    color:#57626D!important;
  }
  .iconjinggao{
    width:16px;
    height:16px;
    vertical-align: -5px;
    overflow: hidden;
  }
  .icontishi{
    width:16px;
    height:16px;
    vertical-align: -5px;
    overflow: hidden;
  }

/*暂时写死，后面删掉*/
  .test-select{
    .el-input{
      width: 60px !important;
    }
    .el-input__icon{
      margin-left: 60px;
    }
  }
  // .call-assitance .right-info .user-info .el-textarea{
  //   width: 80px;
  // }
  // .call-assitance .right-info #userScroll .el-scrollbar__wrap{
  //   overflow: hidden;
  // }
</style>

