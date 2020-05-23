import axios from "./axios"
import qs from 'qs'

//刷新token
export const getAccess_token = ({refresh_token, grant_type}) => {
    return axios.post('uac/oauth/token',
        qs.stringify({
            refresh_token,
            grant_type
        })
    )
};
