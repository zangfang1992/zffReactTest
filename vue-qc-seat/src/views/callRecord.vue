<template>
  <div class="call-record">
    <div class="call-record-table">
      <div class="search">
        <div class="phone">
          <span>手机号码：</span>
          <el-input
            placeholder="请输入手机号"
            v-model="searchObj.phoneNumber"
            @keyup.enter.native="getCallRecordList('searchClick')">
            <i slot="suffix" class="el-icon-search" @click="getCallRecordList('searchClick')"></i>
          </el-input>
        </div>
        <div class="date">
          <span>呼叫日期：</span>
           <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            v-model="searchObj.callTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeCallTime"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div>
          <span>场景：</span>
          <el-select v-model="searchObj.sceneId" @change="getSceneId" style="width:200px" class="sence-select">
            <el-option
              v-for="item in sceneList"
              :key="item.id"
              :label="item.sceneName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-table
      :data="tableData"
      ref="singleTable"
      border
      @sort-change="changeSort"
      @row-click="rowClick"
      :default-sort="{prop: 'date', order: 'ascending'}"
      max-height="650"
      style="width: 100%"
      highlight-current-row>
       <el-table-column
        prop="phoneNumber"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="callTime"
        label="呼叫时间"
        sortable
        :sort-orders="['ascending', 'descending']">
      </el-table-column>
      <el-table-column
        prop="callDuration"
        label="通话时长">
        <template slot-scope="scope">
            {{callDurationIsNull(scope.row.callDuration)}}s
        </template>
      </el-table-column>
      <el-table-column
        prop="sceneName"
        label="话术场景">
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
            <el-button type="text" @click.stop="delRecord(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev,next, jumper"
      :total="total">
    </el-pagination>
    </div>
    <callContent :rowData="rowData" :toggleShow.sync="toggleShow" :recordIdList="recordIdList" @changeId="changeId"></callContent>
  </div>
</template>
<script>
import callContent from './common/callContent'
import {getCallRecordList,getCallRecordInfo, delCallRecord} from '../api/callRecord'
import { getSceneName } from '../api/callAssistance'
import util from '@/libs/util'
export default {
  name: "callRecord",
  components:{
    callContent
  },
  data(){
    return{
      tableData:[],
      searchObj:{
        phoneNumber:'',
        callTime:'',
        sceneId:'',
      },
      isClickSearch:false,
      sceneList:[],
      pageSize:50,
      currentPage:1,
      total:0,
      rowData:{
        pageNum:"",
        id:"",
        customerGlobalTagList:[],
        customerSingleTagList:[],
        customerUserFocus:[],
        userAnalysisRecords:[],//客户信息
        monitoringStateRecords:{
          customerEmotionSize:0,//客户情绪记录
          agentEmotionSize:0,//坐席情绪记录数
          speechRateSize:0,//语速监控记录数
          interruptCustomerSize:0,//抢话记录数
        },
        replySpeedSize:0,//响应记录数
        textRecords:[],
        audio:'',
        audioPath:''
      },
      toggleShow:false,
      recordIdList: [],  //通话记录的id接口，用于上一句下一句
      pickerOptions: {  //限制可选日期为当前日期之前三个月之内
        disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;;
          }
      }
    }
  },
  created(){
    this.getCallRecordList("condition");
    this.getSceneName();
  },
  methods:{
    resetSearchObj(){
      this.searchObj={
        phoneNumber:'',
        callTime:'',
        sceneId:'',
      }
    },
    getSearchObj(){
      return {
        "phoneNumber":this.searchObj.phoneNumber,
        "sceneId":this.searchObj.sceneId,
        "createTimeFromString":this.searchObj.callTime&&util.formatDate(this.searchObj.callTime[0]),    
        "createTimeToString":this.searchObj.callTime&&util.formatDate(this.searchObj.callTime[1]),   
        "pageNum":this.currentPage,
        "pageSize":this.pageSize,
      }
    },
    getSceneName(){
        getSceneName().then((data)=>{
          this.sceneList=data.data;
          this.sceneList.splice(0,0,{id:"",sceneName:"全部场景"})
        })
    },
    getSceneId(val){
      this.getCallRecordList("searchClick");
    },
    changeCallTime(value){
      this.searchObj.callTime=value;
      this.getCallRecordList("searchClick");
    },
    getCallRecordList(condition){
      this.currentPage=condition?1:this.currentPage;
      if(condition=="searchClick"){
        this.isClickSearch=true;
      }
      getCallRecordList(this.getSearchObj()).then((data)=>{
        this.fetchSuccess(data);
      })
    },
    fetchSuccess(data){
      this.recordIdList=[];
      this.tableData=data.data.callLogVOList;
      this.total=data.data.count
      for (let i in this.tableData) {
        this.recordIdList.push(this.tableData[i].id)
      }
    },
    asyncGetList() {
      if(!this.isClickSearch){
        this.resetSearchObj();
      }
			return getCallRecordList(this.getSearchObj());
		},
    callDurationIsNull(callDuration){
      return callDuration||0;
    },
    changeSort(val){
      console.log(val.order);
    },
    handleSizeChange(val) {
      if(!this.isClickSearch){
        this.resetSearchObj();
      }
      this.pageSize = val;
      this.currentPage = 1
      this.getCallRecordList("condition");
    },
    handleCurrentChange(val) {
      if(!this.isClickSearch){
        this.resetSearchObj();
      }
      this.currentPage=val;
      this.getCallRecordList();
    },
    rowClick(row){
      this.toggleShow=true;
      this.getCallRecordInfo(row.id);
    },
    getCallRecordInfo(id){
      let loading = this.$loading({
          target:document.querySelector(".talkContent-component"),
          lock: true,
          background: 'rgba(255, 255, 255, 0.7)'
        });
      getCallRecordInfo({
        "id":id
      }).then((data)=>{
        let dataObj=data.data;
        dataObj.customerSensitive=dataObj.customerSensitive&&dataObj.customerSensitive.length>0?dataObj.customerSensitive.join(";"):"无";
        dataObj.agentSensitive=dataObj.agentSensitive&&dataObj.agentSensitive.length>0?dataObj.agentSensitive.join(";"):"无";
        dataObj.textRecords.map((item)=>{
          item.sensitiveWord&&item.sensitiveWord.map((item1)=>{//敏感词红色下划线
            item.text=item.text.replace(new RegExp(item1.word,'g'),`<span style="border-bottom:1px solid #C65154;color:#293547;display:inline-block">${item1.word}</span>`)
          })
          item.keyword&&item.keyword.map((item2)=>{//知识库关键词标黄
            item.text= item.text.replace(new RegExp(item2,'g'),`<span style=color:#FBB13F;display:inline-block;>${item2}</span>`)
          })
        })
        this.rowData=dataObj;
        document.querySelector(".detail-right .el-scrollbar__wrap").scrollTop=0;
        loading.close();
      })
    },
    setHighRow(id){//行高亮
       for (let i in this.tableData) {
        if (this.tableData[i].id == id) {
          this.$refs.singleTable.setCurrentRow(this.tableData[i]);
          // document.querySelector(".el-table__body-wrapper").scrollTop=i*69;
        }
      }
    },
    // 组件中点击上一页下一页
    changeId (param) {
      let {id, index, next} = param;
      let singlePageSize = this.pageSize == this.recordIdList.length ? this.pageSize : this.recordIdList.length;
      // 不是当前页的第一条也不是最后一条
      if (index >= 0 && index < singlePageSize) {
        this.getCallRecordInfo(id);
        this.setHighRow(id);
      } else if (index < 0 && this.currentPage > 1) {//不是第一页的第一条
        this.currentPage--;
        this.asyncGetList().then(data => {
          this.fetchSuccess(data);
          let openedIndex= this.pageSize - 1; // 当前打开的index和id设置为当前页最后一个
          this.getCallRecordInfo(this.recordIdList[openedIndex]);
          this.setHighRow(this.recordIdList[openedIndex]);
        })
      }else if(index >= singlePageSize && this.currentPage < Math.ceil(this.total/this.pageSize)){//不是最后一页的最后一条
        this.currentPage++;
				this.asyncGetList().then(data => {
          this.fetchSuccess(data);
          this.getCallRecordInfo(this.recordIdList[0]);
          this.setHighRow(this.recordIdList[0]);
        })
      }else if (index < 0 && this.currentPage == 1) { // 第一页的第一条
        this.$message.warning('已经是第一条了！');
      }else { // 最后一页的最后一条
        this.$message.warning('已经是最后一条了！');
      }
    },

    // 删除通话记录
    delRecord (id) {
      this.$confirm(`确定删除该条通话记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCallRecord({
          id: id
        }).then(data=> {
          if (data && data.status == 1000) {
            this.$message.success('删除成功！')
            this.getCallRecordList()
          } else {
            this.$message.error(data.error.error)
          }
        })
      })
    }
  },
  computed:{
  },
  watch:{
  }
}
</script>
<style lang="less">
  .call-record{
    padding:24px 96px 16px;
    height: 100%;
    .phone{
      .el-icon-search{
        line-height: 34px;
        cursor: pointer;
      }
    }
    .call-record-table{
      background-color:#fff;
      height: 100%;
      padding:24px;
      margin: 0 auto;
      .search{
        display: flex;
        margin-bottom: 24px;
        // justify-content:space-between;
        .date{
          margin:0 24px;
        }
        .el-input__icon{
          line-height: 32px;
        }
        .el-range-editor.el-input__inner{
          padding: 0px 10px;
          height: 32px;
          line-height: 32px;
        }
        span{
          color:#707885;
          font-size: 13px;
        }
        .el-input{
          width: 180px;
           line-height: 32px;
          .el-input__inner{
            height: 32px;
            line-height: 32px;
            font-size: 13px;
          }
          margin-right: 24px
        }
        .el-select{
          .el-input{
            width: 200px;
          }
        }
      }
    }
  }
</style>

