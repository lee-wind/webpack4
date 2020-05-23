<template>
    <wind-modal class="wind-confirm" ref="confirmModal">
        <div class="header mg">
            <p>{{title}}</p>
        </div>
        <div class="body mg scroll">
            {{message}}
        </div>
        <div class="footer bd-top lg">
            <button class="pd letter-spacing" @click="hide">{{buttonText[0]}}</button>
            <wind-divider/>
            <button class="pd letter-spacing" @click="hide">{{buttonText[1]}}</button>
        </div>
    </wind-modal>
</template>

<script>
    export default {
        name: "Confirm",
        data(){
            return {
                message: '',
                title: '',
                buttonText: ['', ''],
                resolve: '',
                reject: '',
            }
        },
        methods: {
            show(message, title, buttonText, resolve, reject,){
                this.message = message;
                this.title = title;
                this.buttonText = buttonText;
                this.resolve = resolve;
                this.reject = reject;
                this.$refs.confirmModal.show();
            },
            confirm(){
                if(this.resolve) this.resolve();
                this.hide();
            },
            hide(){
                if(this.reject) this.reject();
                if(this.$refs.confirmModal){
                    this.$refs.confirmModal.hide('.wind-confirm');
                }
            }
        }
    }
</script>

<style scoped>

</style>
