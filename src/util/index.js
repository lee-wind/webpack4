import store from '../store'
import { RESET_CURRENT_TAB_COMPONENT } from "../store/mutation_types";

export let app = {
    version: '1.0.0.0',
    userId: '',
    accessToken: '',
    refreshToken: '',
    userPhone: localStorage.getItem('userPhone'),
    phoneType: 2, //Android, IOS,
};

export const initUserInfo = () => {
    console.log('初始化用戶信息');
    let user = localStorage.getItem(localStorage.getItem('userPhone'));
    if(!user) return;
    user = JSON.parse(user);
    app.userId = localStorage.getItem("userId");
    app.accessToken = user.accessToken;
    app.refreshToken = user.refreshToken;
    app.refreshTime = user.refreshTime;
};

export const setUserInfo = (data) => {
    console.log("設置用戶信息");
    app.userId = data.user_id;
    app.accessToken = data.access_token;
    app.refreshToken = data.refresh_token;
    app.refreshTime = data.timestamp;
    app.userPhone = localStorage.getItem("userPhone");
    localStorage.setItem('userId', data.user_id);
    setLocalStorage('accessToken', data.access_token);
    setLocalStorage('refreshToken', data.refresh_token);
    setLocalStorage('refreshTime', data.timestamp);
};

export const removeUserInfo = () => {
    console.log('移除用戶信息');
    localStorage.removeItem(app.userPhone);
    localStorage.removeItem('userId');
    app.userId = '';
    app.accessToken = '';
    app.refreshToken = '';
    app.refreshTime = '';
    app.userPhone = '';
};

export const getLocalStorage = (key, defaultVal = '') => {
    let user = localStorage.getItem(app.userPhone);
    if(!user) {
        return defaultVal;
    }
    user = JSON.parse(user);
    if(user[key]){
        return user[key];
    }
    return defaultVal;
};

export const setLocalStorage = (key, object) => {
    let user = localStorage.getItem(app.userPhone);
    if(!user){
        user = {};
    }else{
        user = JSON.parse(user);
    }
    user[key] = object;
    localStorage.setItem(app.userPhone, JSON.stringify(user));
};

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


