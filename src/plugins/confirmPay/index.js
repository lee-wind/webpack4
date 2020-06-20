import ConfirmPay from "./ConfirmPay";
import bus from '../../util/bus'

export default {
    install(Vue, options){
        let confirmPay = Vue.extend(ConfirmPay);
        let $confirmPay = new confirmPay();

        Vue.prototype.$confirmPay = (message = '',
                                  title = '支付密码',
                                  buttonText = ['取消', '确认']) => {

            document.body.appendChild($confirmPay.$mount().$el);

            return new Promise((resolve, reject) => {
                $confirmPay.show(message, title, buttonText, resolve, reject);
            })
        };

        Vue.prototype.$confirmPayHide = () => {
            $confirmPay.hide();
        }
    }
}
