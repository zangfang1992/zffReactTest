<template  lang="html">
    <div :class="talkContent?'callContent-wrapper call-open' : 'callContent-wrapper'" @click.self="closeContent">
        <div class="talkContent-component">
            <span class="close-talkContent" @click="closeContent"><i class="el-icon-close"></i></span>
            <div class="contentTitle">
                <div class="talkContent-phone">
                    <span>号码：{{rowData.phoneNumber}}</span>
                    <span>ID：{{rowData.id}}</span>
                </div>
                <div class="change-id">
                    <span class="prev" @click="showPrev"><i class="el-icon-arrow-left"></i>上一条</span>
                    <span class="next" @click="showNext">下一条<i class="el-icon-arrow-right"></i></span>
                </div>
            </div>
            <div class="detailText">
                <div class="detail-left">
                    <span class="detail-title  user-detail">客户详情</span>
                        <div class="user-left-content">
                            <el-scrollbar :native="false" style="height:calc( 100% )">
                                <div class="left-content" v-for="(item,index) in rowData.userAnalysisRecords" :key="'user'+index">
                                    <span>{{item.cnName}}：{{item.value}}</span>
                                </div>
                                <div class="left-content">
                                    <span>敏感词：{{rowData.customerSensitive}}</span>
                                </div>
                                <div class="left-content">
                                    <span>情绪：</span>
                                    <span v-if="rowData.monitoringStateRecords.customerEmotionSize>0">辱骂({{rowData.monitoringStateRecords.customerEmotionSize}}次)</span>
                                    <span v-else>正常</span>
                                </div>
                                <div class="left-content tags">
                                    <template v-if="rowData.customerGlobalTagList.length>0||rowData.customerSingleTagList.length>0|| rowData.customerUserFocus.length>0">
                                        <span>标签：</span>
                                        <span v-for="(item,index) in rowData.customerGlobalTagList" :key="'g'+index">{{item.customerTagName}}</span>
                                        <span v-for="(item,index) in rowData.customerSingleTagList" :key="'c'+index">{{item.customerTagName}}</span>
                                        <span v-for="(item,index) in rowData.customerUserFocus" :key="'f'+index">{{item.customerUserFocusName}}</span>
                                    </template>
                                    <template v-else>
                                        <span class="no-tag-title">标签：</span>
                                        <span class="no-tag">无</span>
                                    </template>
                                </div>
                            </el-scrollbar>
                        </div>
                    <span class="detail-title">坐席表现</span>
                    <div class="left-content marTop0">
                        <span>流程完成度：{{rowData.integrity ? rowData.integrity : 0}}%</span>
                    </div>
                    <div class="left-content">
                        <span>敏感词：{{rowData.agentSensitive}}</span>
                    </div>
                    <div class="left-content">
                        <span>情绪：</span>
                        <span v-if="rowData.monitoringStateRecords.agentEmotionSize>0">辱骂({{rowData.monitoringStateRecords.agentEmotionSize}}次)</span>
                        <span v-else>正常</span>
                    </div>
                    <div class="left-content">
                        <span>语速：</span>
                        <span v-if="rowData.monitoringStateRecords.speechRateSize>0">过快({{rowData.monitoringStateRecords.speechRateSize}}次)</span>
                        <span v-else>正常</span>
                    </div>
                    <div class="left-content">
                        <span>抢话：</span>
                        <span v-if="rowData.monitoringStateRecords.interruptCustomerSize>0">异常({{rowData.monitoringStateRecords.interruptCustomerSize}}次)</span>
                        <span v-else>无</span>
                    </div>
                    <div class="left-content">
                        <span>响应速度：</span>
                        <span v-if="rowData.monitoringStateRecords.replySpeedSize>0">异常({{rowData.monitoringStateRecords.replySpeedSize}}次)</span>
                        <span v-else>正常</span>
                    </div>
                    <div class="left-content remark">
                        <div>备注：</div>
                        <el-input
                            type="textarea"
                             maxlength="50"
                            placeholder="请输入文本内容（不超过50个字）"
                            v-model="rowData.remarks"
                            @blur="updateRemark">
                        </el-input>
                    </div>
                </div>
                <div class="detail-right">
                    <div class="audio-process">
                        <img v-show="!playFlag" class="img-play" src="@@/img/play.png" @click="playPauseClick()"/>
                        <img v-show="playFlag" class="img-play" src="@@/img/stopV.png" @click="playPauseClick()"/>
                        <div class="audio">
                            <audio id="audioTag" :src="audioPathUrl + rowData.audioPath" ref="audio" @timeupdate="timeUpdate()"></audio>
                            <el-slider v-model="audioProgress" :show-tooltip="false" @change="updateAudioProgress"></el-slider>
						</div>
                        <span class="play-span">
							<b>{{currentTime}}</b>/<b>{{transTime(rowData.callDuration)}}</b>
						</span>
						<i class="el-icon-download" @click="toDownloadAudio"></i>
                    </div>
                    <el-scrollbar :native="false" style="height:calc( 100% - 70px)" id="callScroll" ref="scroll">
                        <div class="detail-right-info"  v-for="(item,index) in rowData.textRecords" :key="index"  ref="chats">
                            <div :class="[item.speaker?'customer':'seat']"  @click="itemClick(index)">
                                <span v-if="item.speaker == 0"><i v-if="item.action">{{item.action}}</i>坐席{{transTime(item.startTime/1000)}}</span>
                                <span v-else>客户{{transTime(item.startTime/1000)}}<i v-if="item.action">{{item.action}}</i></span>
                                <div v-html="item.text" :class="{'playingcurr': playingindex == index}"></div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import siteConfig from '@@/js/config'
import {updateRemark} from '../../api/callRecord'
export default {
    props:["rowData","toggleShow","recordIdList"],
    data(){
        return {
            audioPathUrl:siteConfig.audioPathUrl,
            talkContent: false,
            currentTime:"00:00",
            totalTime:"00:00",
            playFlag:0,//0未播放1播放中
            audioProgress: 0,
            playingindex: -1
        }
    },
    methods:{
        init(){
            this.currentTime="00:00";
            this.totalTime="00:00";
            this.playFlag=0;//0未播放1播放中
            this.audioProgress=0;
            this.playingindex=-1;
        },
        closeContent() {
            this.talkContent=false;
            this.$refs.audio.pause();
            this.playFlag=0;
            this.$emit("update:toggleShow",false)
        },
        showNext(){
            let param={
                id: this.recordIdList[this.rightIdIndex + 1],
                index:this.rightIdIndex + 1,
                next:true
            }
            this.$emit('changeId', param);
            this.init();
            this.audioEnded();
            document.querySelector("#callScroll .el-scrollbar__wrap").scrollTop =0;
        },
        showPrev(){
            let param={
                id: this.recordIdList[this.rightIdIndex -1],
                index:this.rightIdIndex - 1,
                next:true
            }
            this.$emit('changeId', param);
            this.init();
            this.audioEnded();
            document.querySelector("#callScroll .el-scrollbar__wrap").scrollTop =0;
        },
        toDownloadAudio(){
            if(this.rowData.audioPath){
                window.open(this.audioPathUrl + this.rowData.audioPath);
            }else{
                this.$message.error('当前没有通话记录!');
            }
        },
         // 转换音频时长显示
        transTime(time) {
            var duration = Math.ceil(time);
            var minute = parseInt(duration/60);
            var sec = duration%60+'';
            var isM0 = ':';
            if(minute == 0){
                minute = '00';
            }else if(minute < 10 ){
                minute = '0'+minute;
            }
            if(sec.length == 1){
                sec = '0'+sec;
            }
            return minute+isM0+sec
        },
        itemClick(index) {
			this.$refs.audio.currentTime = this.rowData.textRecords[index].startTime/1000;
			this.updateProgress();
			this.timeUpdate();
        },
        playPauseClick(){
            if(this.rowData.audioPath == null || this.rowData.audioPath == ""){
                this.$message.error('暂时不能播放录音');
                return false;
            }
            var audio = this.$refs.audio;
            // 监听音频播放时间并更新进度条
            audio.addEventListener('timeupdate',this.updateProgress,false);
            // // 监听播放完成事件
            audio.addEventListener('ended',this.audioEnded,false);
            // 监听滚轮事件
            // 改变暂停/播放icon
            if(audio.paused){
                // this.audioPlayStatus = true;
                audio.play();
                this.playFlag=1;
            } else{
                // this.audioPlayStatus = false;
                audio.pause();
                 this.playFlag=0;
			}
        },
        audioEnded() {
            let audio =this.$refs.audio;
			if(audio){
                audio.currentTime = 0;
                audio.pause();
            }
            // this.audioPlayStatus = false;
            this.playFlag=0;
        },
        updateAudioProgress(val){
			let audio = this.$refs.audio;
            this.currentTime = !(Number.isNaN(audio.duration)||audio.duration == Infinity)?this.transTime(val/100*audio.duration):'00:00';
			let currTime = this.currentTime.split(':');
			audio.currentTime = this.currentTime?60*parseInt(currTime[0])+parseInt(currTime[1]):'00:00';
			this.timeUpdate();
        },
         //更新进度条
        updateProgress() {
            let audio = this.$refs.audio;
			if(audio){
				var value = (audio.currentTime / audio.duration) * 100; //换个写法，防止audio.duration === NaN 的情况
				this.audioProgress = value;
				this.currentTime = this.transTime(audio.currentTime);
			}else{
				this.audioProgress = 0;
				this.currentTime = '00:00';
			}
		},
        timeUpdate() {
			if(this.rowData.textRecords){//有记录才渲染录音文本
				this.audioToText();
			}
        },
        audioToText() {
			let audio = this.$refs.audio;
			let audioTime = audio.currentTime;
            let time = Math.round(audioTime*1000);
            let height = document.querySelector('#callScroll').offsetHeight;
            let seektop = null//seektop是控制滚动条位置的，对应的气泡框的序号
			let checkEndTime = null;
            for(let i=0;i< this.rowData.textRecords.length;i++) {
                let startTime = this.rowData.textRecords[i].startTime;
                let endTime = this.rowData.textRecords[i].endTime;
                if((startTime <= time && endTime > time) || (startTime==time && endTime == time)) {
                    checkEndTime = endTime;
                    seektop = i;
                    break;
                }
            }
            this.$nextTick(()=>{
                if(seektop == null) {
                    this.playingindex = -1;
                } else {
                   this.playingindex = seektop;
                    if(checkEndTime == this.checkEndTime) {
                        // return false;
                    } else {
                        this.checkEndTime = checkEndTime;

                        if(this.$refs.chats[seektop].offsetTop) {
                            document.querySelector("#callScroll .el-scrollbar__wrap").scrollTop =this.$refs.chats[seektop].offsetTop-300;
                            // this.$refs.scroll.scrollTop = this.$refs.chats[seektop].offsetTop
                        }
                    }
                }
            });
        },
        updateRemark(){
            updateRemark({
                id:this.rowData.id,
                remarks:this.rowData.remarks
            }).then(data=>{
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
            })
        }
    },
    computed: {
        rightIdIndex() { // 点击下(上)一条的时候，点击之前的index
            let index;
            this.recordIdList.forEach((item,i) => {
				if(this.id){
					if (item === this.id) {
						index = i;
					}
				}
				if(this.rowData){
					if (item === this.rowData.id) {
						index = i;
					}
				}
            });
            return index;
        },
    },
    watch:{
        "toggleShow":function(newVal,oldVal){
            this.talkContent=newVal;
            this.init();
        },
        "rowData.audio":function(newVal,oldVal){
             this.$nextTick(()=>{
                    let audio = this.$refs.audio;
                    audio.pause();
                    audio.load(); // 重新加载音频，不然第二点击的时候不会触发loadeddata事件
                    audio.addEventListener('loadeddata',()=> {//当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时会触发的事件
                        if(Number.isNaN(audio.duration)||audio.duration == Infinity){
                            //Infinity 音频返回路径但是音频没有内容这时候获取长度可能是Infinity（？）待研究 见下
                            //接上 这是chrome浏览器自己的存在的一个bug，因为我们拿到的录音数据流没有定义长度，所以浏览器无法解析出当前音频的时长。
                            //原文地址 https://blog.csdn.net/weixin_34280237/article/details/91371974
                            //返回NaN是因为音频资源还没加载完（异步加载）
                            this.totalTime = '00:00';
                        }else{
                            this.totalTime = this.transTime(audio.duration);
                            this.playingindex = -1;
                        }
                    },false);
                })
        },
    }
}
</script>

<style lang="less">
.marTop0{
    margin-top:0 !important;
}
.callContent-wrapper {
    position: fixed;
    right: -100%;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    .close-talkContent{
        left: 0px;
    }
    .close-talkContent{
        position: absolute;
        top: 0px;
        width: 45px;
        height: 38px;
        line-height: 38px;
        box-shadow:-2px 2px 6px 0px rgba(0,0,0,0.08);
        border-radius:4px 0px 0px 4px;
        background-color: #fff;
        cursor: pointer;
        i{ 
            color:#57626D;
            font-size: 20px; 
            font-weight:700;
        }
    }
    .contentTitle{
        padding: 19px 24px 19px 19px;
        line-height: 14px;
        background: #5DBBFD;
        position: relative;
        color: #fff;
        display: flex;
        justify-content:space-between;
        .talkContent-phone{
            &>span:first-child{
                font-size: 16px;
                font-weight:700;
                margin-right: 40px;
            }
        }
        .change-id{
            cursor: pointer;
            .prev{
                margin-right: 24px;
            }
            .el-icon-arrow-left{
                margin-right: 5px;
            }
            .el-icon-arrow-right{
                margin-left: 5px;
            }
        }
    }
    .detailText{
        display: flex;
        height: 100%;
        color:#57626D;
        .detail-left{
            width: 240px;
            height: 100%;
            background-color: #F9FAFB;
            padding: 0 6px 0 16px;
            .detail-title{
                color:#293547;
                font-weight: 700;
                font-size: 16px;
                line-height: 16px;
                padding: 16px 0;
                display: block;
                text-align: left;
            }
            .user-detail{
                margin-bottom: -12px;
            }
            .user-left-content{
                height:45%;
                border-bottom:1px solid #DDDEE1;
                overflow: auto;
                padding-bottom: 25px;
                .el-scrollbar__wrap{
                    overflow: auto;
                }
            }
            .left-content{
                display: flex;
                justify-content:flex-start;
                line-height: 19px;
                margin-top: 14px;
                text-align: left;
                padding-right: 14px;
                &>span{
                    min-width: 43px;
                    display: block;
                }
            }
            .remark{
               display: block; 
               &>div{
                   margin-bottom: 10px;
               }
            }
            .tags{
                display: block;
                text-align: left;
                &>span:first-child{
                    display: block;
                    &.no-tag-title{
                        display:inline-block;
                    }
                }
                &>span:not(:first-child){
                    display: inline-block;
                    background-color:#E3F2FD;
                    color:#42A5F5;
                    padding:6px 12px;
                    margin-right: 8px;
                    margin-top: 8px;
                    border-radius:2px;
                    &.no-tag{
                        margin-top: 0;
                        padding:0;
                        color:#57626D;
                        display:inline-block;
                        background-color:#F9FAFB;
                    }
                }
            }
        }
        .detail-right{
            width: calc(100% - 240px);
            text-align: left;
            padding-bottom: 24px;
            .audio-process{
                width: 100%;
                border-bottom: 1px solid #DDDEE1;
                padding:18px 25px 18px 22px;
                .img-play{
                    vertical-align: middle;
                     cursor: pointer;
                }
                .audio{
                    width:calc(100% - 160px);
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 14px;
                    margin-right: 12px;
                    cursor: pointer;
                }
                .play-span{
                    b{
                        color:#909499;
                        font-weight: 500
                    }
                }
                .el-icon-download{
                    color:#2196F3;
                    font-size: 20px;
                    margin-left: 17px;
                     cursor: pointer;
                }
            }
            .detail-right-info{
                padding:0 24px;
                width: 100%;
                margin-top: 20px;
                .playingcurr{
                    background: #4a8df1 !important;
                    color:#fff;
                }
                &:first-child{padding-top: 24px;margin-top: 0px;}
                &:last-child{padding-bottom: 24px;}
                &:after{
                    content: " ";
                    display: block;
                    clear: both;
                }
                span{
                    color:#A4ADC5;
                    line-height: 14px;
                    margin-bottom: 8px;
                    display: block;
                }
                &>div{
                    div:nth-child(2){
                        padding:10px 14px;
                        line-height: 19px;
                        border-radius:4px;
                    }
                }
                .seat{
                    float: right;
                    max-width: 85%;
                    text-align: right;
                    span{
                        text-align: left;
                    }
                    div:nth-child(2){
                        background:rgba(227,242,253,1);
                        display:inline-block;
                        
                    }
                    .sensitiveWords{text-align: right}
                }
                .customer{
                    float: left;
                    max-width: 85%;
                    div:nth-child(2){
                        background:rgba(242,244,246,1);
                        display: inline-block;
                        text-align: left;
                    }
                }
            }
        }
    }
}
.call-open{
	transition: right 0.2s;
    right: 0!important;
    .close-talkContent{
        left: -45px;
    }
    .talkContent-component{
        width: 86%;
        max-width: 1100px;
        height: calc(~"100% - 58px");
        position: fixed !important;
        right: 0;
        top: 58px;
        z-index: 1000;
         box-shadow:-2px 2px 6px 0px rgba(0,0,0,0.08);
        background: #fff;
    }
}

</style>

