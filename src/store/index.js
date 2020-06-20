import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

import my from './modules/my'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentTabComponent: {
            name: '',
        },
    },
    mutations,
    actions,
    getters,
    modules: {
        my
    }
});
