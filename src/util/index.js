import store from '../store'
import { RESET_CURRENT_TAB_COMPONENT } from "../store/mutation_types";

export let app = {
    version: '1.0.0.0',
    userId: '',
    accessToken: '',
    refreshToken: '',
    userName: localStorage.getItem('userName'),
    phoneType: 2, //Android, IOS,
};

//初始化用户信息
export const initUserInfo = () => {
    console.log('初始化用戶信息');
    let user = localStorage.getItem(localStorage.getItem('userName'));
    if(!user) return;
    user = JSON.parse(user);
    //app.userId = localStorage.getItem("userId");
    app.accessToken = user.accessToken;
    app.refreshToken = user.refreshToken;
    app.refreshTime = user.refreshTime;
};

//设置用户信息
export const setUserInfo = (data) => {
    console.log("設置用戶信息");
    //app.userId = data.user_id;
    app.accessToken = data.access_token;
    app.refreshToken = data.refresh_token;
    app.refreshTime = data.timestamp;
    app.userName = localStorage.getItem("userName");
    //localStorage.setItem('userId', data.user_id);
    setLocalStorage('accessToken', data.access_token);
    setLocalStorage('refreshToken', data.refresh_token);
    setLocalStorage('refreshTime', data.timestamp);
};

//移除用户信息
export const removeUserInfo = () => {
    console.log('移除用戶信息');
    localStorage.removeItem('userName');
    localStorage.removeItem(app.userPhone);
    //localStorage.removeItem('userId');
    //app.userId = '';
    app.accessToken = '';
    app.refreshToken = '';
    app.refreshTime = '';
    app.userPhone = '';
};

//获取本地数据（与账户挂钩）
export const getLocalStorage = (key, defaultVal = '') => {
    let user = localStorage.getItem(app.userName);
    if(!user) {
        return defaultVal;
    }
    user = JSON.parse(user);
    if(user[key]){
        return user[key];
    }
    return defaultVal;
};

//设置本地数据（与账户挂钩）
export const setLocalStorage = (key, object) => {
    let user = localStorage.getItem(app.userName);
    if(!user){
        user = {};
    }else{
        user = JSON.parse(user);
    }
    user[key] = object;
    localStorage.setItem(app.userPhone, JSON.stringify(user));
};

//A->B(有缓存tab), B->A(清除B缓存tab)
export const mixin = {
    beforeRouteLeave(to, from, next){
        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        if(toDepth <= fromDepth){
            if(from.meta.keepAlive){
                store.commit(RESET_CURRENT_TAB_COMPONENT);
            }
        }
        next();
    },
};

//刷新token
export const getAccessToken = (callback = () => {}) => {
    let refreshToken = app.refreshToken;
    if(refreshToken){
        let currentTime = new Date().getTime();
        let refreshTime = app.refreshTime;
        console.log('refreshTime: ' + refreshTime);
        if(currentTime - refreshTime < 2591000000){ //30天
            if(currentTime - refreshTime > 5400000){ //一个半小时 5400000
                console.log('刷新token');
                return getAccess_token({refresh_token: refreshToken, grant_type: 'refresh_token'})
                    .then(data => {
                        setUserInfo(data);
                        callback();
                    })
            }
        }else{
            console.log('登录过期');
            removeUserInfo();
        }
        callback();
    }else{
        callback('/login');
    }
};

//提取base64
export const extractBase64 = (base64) => {
    if(!base64){
        return {
            base64Str: '',
            suffix: ''
        }
    }
    return {
        base64Str: base64.split(',')[1],
        suffix: base64.split(',')[0].split('/')[1].split(';')[0]
    }
};

import JsEncrypt from 'jsencrypt'

export const encrypt = (psw) => {
    let jse = new JsEncrypt()
    jse.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqpshXs5E1yRdbo0MdmUZ9M/UdrUE9cesvp8+mPPHdNMGEsZ37oSKww01nOr4Q58yFAEVNrFlSoQ7SZBLD10GWW0bWEl0h1AJDafGapbhDawJ4rSdw6KME4xw+Ao2YPS5GOfSUNId66Dl8KS53eUGPi3HNu4B+NzardqjKnrf1xGI8+zJ03Q0fuwfsnmo1YsBV9UCL4bdkmLbsOvRzP0Uvx4+PlUgFhUnT+yg3DAzb0zJt4AKpGXe3St1Q6NXv4K6dFNdcJi7ULXUhhHJ3LhGEq52Ot74+TuZOKDtx1jQOuQZDXtvs1RWyDF7tIGYiD4qMfomSRGKT2VBAq9M4jF+iwIDAQAB')
    if(psw === ''){
        return ''
    }
    return jse.encrypt(psw);
};


