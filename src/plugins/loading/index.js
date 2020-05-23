import Loading from './Loading'

export default {
    install(Vue, options){
        let loading = Vue.extend(Loading);
        let $loading = new loading();

        document.body.appendChild($loading.$mount().$el);

        Vue.prototype.$loading = (message = '请稍后...') => {
            $loading.show(message);
        };

        Vue.prototype.$loadingHide = () => {
            $loading.hideLoading();
        }
    }
}
