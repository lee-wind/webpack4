import { UPDATE_CURRENT_TAB_COMPONENT, RESET_CURRENT_TAB_COMPONENT } from "../store/mutation_types";

import 'katex/dist/katex.min.css'
import VueKatex from 'vue-katex'

import store from '../store'

import Alert from "./alert";
import Confirm from "./confirm";
import Toast from './toast'
import Loading from "./loading";
import ConfirmPay from "./confirmPay";

import VueClipboard2 from 'vue-clipboard2'

import { app, setUserInfo, removeUserInfo, mixin, getLocalStorage, setLocalStorage } from "../util";
import { onlyInt, toFixed, percentage, add, sub, mul, div, digit } from "../util/number";
import { timeAgo, restTime, getYear, getMonth, getDay, getDate, getHours,
    getMinutes, getSeconds, fullTime, yearToSeconds, yearToDate, hoursToSeconds,
    yearToSecondsNextTo } from "../util/date";

// import { plusReady } from "../util/plus";

export default {
    install(Vue, options){

        Vue.use(Alert);
        Vue.use(Confirm);
        Vue.use(Toast);
        Vue.use(Loading);
        Vue.use(ConfirmPay);

        Vue.use(VueClipboard2);

        Vue.use(VueKatex);

        Vue.mixin(mixin);

        Vue.prototype.app = app;

        Vue.prototype.$setUserInfo = setUserInfo;

        Vue.prototype.$removeUserInfo = removeUserInfo;

        Vue.prototype.$getLocalStorage = getLocalStorage;

        Vue.prototype.$setLocalStoage = setLocalStorage;

        Vue.prototype.$updateCurrentTabComponent = component => {
            store.commit(UPDATE_CURRENT_TAB_COMPONENT, component);
        }

        Vue.prototype.$resetCurrentTabComponent = () => {
            store.commit(RESET_CURRENT_TAB_COMPONENT)
        }

        Vue.prototype.$add = add;
        Vue.prototype.$sub = sub;
        Vue.prototype.$mul = mul;
        Vue.prototype.$div = div;
        Vue.prototype.$digit = digit;
        /*Vue.prototype.$plusReady = plusReady*/

        Vue.filter('onlyInt', onlyInt);
        Vue.filter('toFixed', toFixed);
        Vue.filter('percentage', percentage);
        Vue.filter('add', add);
        Vue.filter('sub', sub);
        Vue.filter('mul', mul);
        Vue.filter('div', div);
        Vue.filter('digit', digit);

        Vue.filter('timeAgo', timeAgo);
        Vue.filter('restTime', restTime);
        Vue.filter('getYear', getYear);
        Vue.filter('getMonth', getMonth);
        Vue.filter('getDay', getDay);
        Vue.filter('getDate', getDate);
        Vue.filter('getHours', getHours);
        Vue.filter('getMinutes', getMinutes);
        Vue.filter('getSeconds', getSeconds);
        Vue.filter('fullTime', fullTime);
        Vue.filter('yearToSeconds', yearToSeconds);
        Vue.filter('yearToDate', yearToDate);
        Vue.filter('hoursToSeconds', hoursToSeconds);
        Vue.filter('yearToSecondsNextTo', yearToSecondsNextTo);
    }
}
