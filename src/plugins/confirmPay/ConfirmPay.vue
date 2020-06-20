<template>
    <wind-modal id="wind-confirm-pay" class="bottom" ref="confirmPayModal">
        <div class="header mg">
            <p>支付密码</p>
            <!--<wind-close @click="hide"/>-->
        </div>
        <div class="body mg scroll">
           <!-- {{message}}-->
            <div class="high-light mg-bottom">
                <form class="pd-lg">
                    <input style="width:100%" type="password" v-model="payPassword" autocomplete="false" placeholder="请输入支付密码">
                </form>
            </div>
            <div class="text-right">
                <button @click="toPayPassword">忘记密码</button>
            </div>
        </div>
        <div class="footer bd-top">
            <button class="pd" @click="confirm">确认</button>
            <wind-divider/>
            <button class="pd" @click="confirm">确认</button>
        </div>
    </wind-modal>
</template>

<script>
    import router from "../../router";
    import md5 from 'js-md5'

    export default {
        name: "Confirm",
        data(){
            return {
                message: '',
                title: '',
                buttonText: '',
                resolve: '',
                reject: '',
                payPassword: '',
            }
        },
        methods: {
            show(message, title, buttonText, resolve, reject,){
                this.message = message;
                this.title = title;
                this.buttonText = buttonText;
                this.resolve = resolve;
                this.reject = reject;
                this.$refs.confirmPayModal.show();

                this.payPassword = '';
            },
            confirm(){
                if(this.resolve) this.resolve(md5(this.payPassword));
                this.hide();
            },
            hide(){
                if(this.reject) this.reject();
                if(this.$refs.confirmPayModal){
                    this.$refs.confirmPayModal.hide('#wind-confirm-pay');
                }
            },
            toPayPassword(){
                router.push({
                    name: 'assetsPassword'
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    #wind-confirm-pay{
        .high-light{
            background-image: url("../../assets/img/components/confirmPay/confirmPay_input_bg.png");
            background-size: 100% 100%;
        }
    }
</style>
