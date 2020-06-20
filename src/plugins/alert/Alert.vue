<template>
    <wind-modal class="wind-alert" ref="alertModal">
        <div class="header mg">
            <p>{{title}}</p>
        </div>
        <div class="body mg scroll">
            {{message}}
        </div>
        <div class="footer bd-top">
            <button class="pd" @click="hide">{{buttonText}}</button>
        </div>
    </wind-modal>
</template>

<script>
    export default {
        name: "Alert",
        data(){
            return {
                title: '',
                message: '',
                buttonText: '',
            }
        },
        methods: {
            show(message, title, buttonText, resolve){
                this.message = message;
                this.title = title;
                this.buttonText = buttonText;
                this.resolve = resolve;
                this.$refs.alertModal.show();
            },
            hide(){
                if(this.resolve) this.resolve();
                this.$refs.alertModal.hide();
            }
        }
    }
</script>

<style scoped>

</style>
