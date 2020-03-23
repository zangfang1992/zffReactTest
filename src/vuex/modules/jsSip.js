import { CALL_STARTUS,CALL_PHONE,SIP_OBJ } from '../type'
const state={
    callStatus:0,
    callPhone:"",
    sipObj:{},
};

const getters= {
    callStatus:state=>state.callStatus,
    callPhone:state=>state.callPhone,
    sipObj:state=>state.sipObj
};

const mutations={
    [CALL_STARTUS](state,res){
        state.callStatus=res
    },
    [CALL_PHONE](state,res){
        state.callPhone=res
    },
    [SIP_OBJ](state,res){
        state.sipObj=res
    }
}

const actions={
    changeCallStatus({commit},res){
        commit(CALL_STARTUS,res);
    },
    changeCallPhone({commit},res){
        commit(CALL_PHONE,res);
    },
    changeSipObj({commit},res){
        commit(SIP_OBJ,res);
    },
}

export default {
    state,
	getters,
	actions,
	mutations
}