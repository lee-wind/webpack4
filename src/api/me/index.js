import axios from '../axios'

// 查询K线历史数据
export const queryKLine = (size, granularity, symbol) => {
    return axios.get('currency/auth/tKline/queryKLine', {
        params: {
            size,
            granularity,
            symbol
        }
    })
}

//聊天历史
export const chatHistory = (current, size, advertOrderId) => {
    return axios.get('c2c/chat/messages/history', {
        params: {
            current,
            size,
            advertOrderId
        }
    })
}

//发送聊天信息
export const sendChatMessage = (receiverId, advertOrderId, content) => {
    return axios.post('c2c/chat/messages/action/send', {
        receiverId,
        advertOrderId,
        content
    })
}

//订单详情
export const orderDetail = (id) => {
    return axios.get('c2c/tAdvertOrder/advert_orders/details/' + id);
}
