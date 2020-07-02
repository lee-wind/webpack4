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
