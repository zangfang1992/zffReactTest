import {CALL_Obj, RECORD_TAB} from "../type"
const state={
    callObj:{},
    recordTab: false
};

const getters= {
    callObj:state=>state.callObj,
    recordTab:state=>state.recordTab
};

const mutations={
    [CALL_Obj](state,res){
        state.callObj=res
    },
    [RECORD_TAB](state,res){
        state.recordTab=res
    }
}

const actions={
    changeCallObj({commit},res){
        commit(CALL_Obj,res);
    },
    changeRecordTab({commit},res){
        commit(RECORD_TAB,res);
    },
}

export default {
    state,
	getters,
	actions,
	mutations
}