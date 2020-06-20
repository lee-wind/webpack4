import i18n from "./locale";

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'

import store from './store';
import router from './router';

import './assets/css/reset.css'
import './assets/css/common.scss'

import './assets/js/rem'

import './components'

import plugin from './plugins'
Vue.use(plugin);

if(NODE_ENV !== 'production'){
    import('vconsole').then(({ default: Vconsole }) => {
        new Vconsole();
    })
}

import App from './App'

new Vue({
    el: '#app',
    i18n,
    store,
    router,
    components: { App },
    template: '<App/>'
});
