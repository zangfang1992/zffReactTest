import Vue from "vue";
import Vuex from "vuex";

import user from './modules/user'
import jsSip from './modules/jsSip'
import common from './modules/common'
import callAssistanceObj from './modules/callAssistance'


Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        user,
        jsSip,
        common,
        callAssistanceObj
    }
});