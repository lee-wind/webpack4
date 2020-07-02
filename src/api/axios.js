import axios from 'axios'
import bus from '../util/bus'

import router from '../router'

import { app } from "../util";

import { getAccess_token } from "./index";

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 30 * 1000;

axios.interceptors.request.use(config => {
    /*if(config.url.includes('auth') || config.url.includes('oauth')){
        config.headers.Authorization = 'Basic amRjbG91ZC1jbGllbnQtYXV0aDpqZGNsb3VkQ2xpZW50U2VjcmV0'
    } else{
        config.headers.Authorization = `bearer ${app.accessToken}`
    }*/
    config.headers.Authorization = `${app.accessToken}`;
    config.headers.Language = 'zh-hk';
    return config;
});

axios.interceptors.response.use(response => {

    bus.$loadingHide();

    if(response.data.code === 4001){
        let refreshToken = bus.$getLocalStorage("refreshToken");
        getAccess_token({refresh_token: refreshToken, grant_type: 'refresh_token'})
            .then(data => {
                bus.$setUserInfo(data);
            })
    }else if(response.data.code === 4002){
        return router.replace('/login');
    }else{
        return response.data;
    }
}, error => {

    bus.$loadingHide();

    if(error.message){
        if (error.message.indexOf("timeout") > -1) {
            bus.$toast('连接超时，请稍后再试');
        }
    }
    if(error.response){
        if(error.response.status === 500){
            bus.$toast('网络繁忙，请稍后再试');
        }
    }
    return Promise.reject(error);
});

export default axios;
