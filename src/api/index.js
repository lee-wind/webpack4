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

export const login = (loginName, password) => {
    return axios.post('uac/auth/login', {
        loginName,
        password
    })
}

/*//登录
export const login = (areaCode, username, password) => {
    return axios.post('uac/auth/form',
        qs.stringify({
            areaCode,
            username,
            password,
            //loadingText: '正在登录'
        })
    );
};*/

//注册
export const register = (areaCode, phone, phoneCode, password, recommendCode) => {
    return axios.post('uac/auth/register/phone', {
        areaCode,
        phone,
        phoneCode,
        password,
        recommendCode
    });
};
//找回密码
export const findPassByPhone = (phone, phoneCode, newPass) => {
    return axios.post('uac/auth/findpass/phone', {
        phone,
        phoneCode,
        newPass
    })
};
