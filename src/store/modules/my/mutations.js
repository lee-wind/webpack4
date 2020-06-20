import { UPDATE_BUY_NUM, UPDATE_TRANSFER_NUM, UPDATE_MESSAGE_COUNT, UPDATE_TREASURE_BOX_UNFINISHED_COUNT } from './mutation_types'

export default {
    [UPDATE_BUY_NUM](state, num){
        state.buyNum = num;
    },
    [UPDATE_TRANSFER_NUM](state, num){
        state.transferNum = num;
    },
    [UPDATE_MESSAGE_COUNT](state, num){
        state.messageCount = num;
    },
    [UPDATE_TREASURE_BOX_UNFINISHED_COUNT](state, num){
        state.treasureBoxUnFinishedCount = num;
    }
}
