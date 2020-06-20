import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export default {
    namespaced: true,
    state: {
        buyNum: 0,
        transferNum: 0,
        messageCount: 0,
        treasureBoxUnFinishedCount: 0,
    },
    mutations,
    actions,
    getters,
};
