import {SCENE_ID} from "../type"
const state={
    sceneId:-1,
};

const getters= {
    sceneId:state=>state.sceneId,
};

const mutations={
    [SCENE_ID](state,res){
        state.sceneId=res
    }
}

const actions={
    changeSceneId({commit},res){
        commit(SCENE_ID,res);
    },
}

export default {
    state,
	getters,
	actions,
	mutations
}