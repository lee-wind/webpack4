import Toast from './Toast'

export default {
    install(Vue, options){
        let toast = Vue.extend(Toast);
        let $toast = new toast();

        document.body.appendChild($toast.$mount().$el);

        Vue.prototype.$toast = (message = '') => {
            $toast.show(message);
        }
    }
}