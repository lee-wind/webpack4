export default {
    adoptAndTransferNum: state => {
        return state.buyNum + state.transferNum + state.messageCount + state.treasureBoxUnFinishedCount;
    },
}

