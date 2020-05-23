import Confirm from "./Confirm";

export default {
    install(Vue, options){
        let confirm = Vue.extend(Confirm);
        let $confirm = new confirm();

        Vue.prototype.$confirm = (message = '',
                                  title = '',
                                  buttonText = ['取消', '确定']) => {

            document.body.appendChild($confirm.$mount().$el);

            return new Promise((resolve, reject) => {
                $confirm.show(message, title, buttonText, resolve, reject);
            })
        };

        Vue.prototype.$confirmHide = () => {
            $confirm.hide();
        }
    }
}
