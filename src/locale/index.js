import Vue from 'vue'
import VueI18n from 'vue-i18n'

import cn from './zh_cn'
import en from './en_us'

Vue.use(VueI18n);

export const ZH_CN = 'zh_CN';

export const EN_US = 'en_US';

export const LOCALE = 'locale';

export const getLocale = () => {
    let JsSrc = (navigator.language || navigator.browserLanguage).toLowerCase();
    if(JsSrc.indexOf('zh')>=0){ //en
        localStorage.setItem(LOCALE, ZH_CN);
        return ZH_CN
    }
    localStorage.setItem(LOCALE, EN_US)
    return EN_US;
}

export const getLanguage = () => {
    let language = '';
    switch (i18n.locale) {
        case ZH_CN:
            language = '简体中文';
            break;
        case EN_US:
            language = 'English';
            break;
        default:
    }
    return language;
}

const i18n = new VueI18n({
    locale: localStorage.getItem(LOCALE) || getLocale(),
    messages: {
        [ZH_CN]: cn,
        [EN_US]: en
    }
});

console.log(i18n);

export default i18n;
