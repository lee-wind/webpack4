import Alert from './Alert'



export default {
    install(Vue, options){
        let alert = Vue.extend(Alert);
        let $alert = new alert();

        document.body.appendChild($alert.$mount().$el);

        Vue.prototype.$alert = (message = '', title = '',
                                buttonText = '确定') => {
            return new Promise(resolve => {
                $alert.show(message, title, buttonText, resolve);
            })
        };

        Vue.prototype.$alertHide = () => {
            $alert.hide();
        }
    }
}
