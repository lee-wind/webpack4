import { UPDATE_BUY_NUM, UPDATE_TRANSFER_NUM, UPDATE_MESSAGE_COUNT, UPDATE_TREASURE_BOX_UNFINISHED_COUNT } from "./mutation_types";

export default {
    updateBuyNum({ commit }, num){
        commit(UPDATE_BUY_NUM, num);
    },
    updateTransferNum({ commit }, num){
        commit(UPDATE_TRANSFER_NUM, num);
    },
    updateMessageCount({ commit }, num){
        commit(UPDATE_MESSAGE_COUNT, num)
    },
    updateTreasureBoxUnFinishedCount({ commit }, num){
        commit(UPDATE_TREASURE_BOX_UNFINISHED_COUNT, num);
    }
}
