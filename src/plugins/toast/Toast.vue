<template>
    <wind-modal class="wind-toast raw" ref="toastModal">
        <p class="pd white-color lg">{{message}}</p>
    </wind-modal>
</template>

<script>
    export default {
        name: "Toast",
        data(){
            return {
                isShow: false,
                message: ''
            }
        },
        methods: {
            show(message){
                this.message = message;
                this.$refs.toastModal.show();
                setTimeout(() => {
                    this.hide();
                }, 1000)
            },
            hide(){
              this.$refs.toastModal.hide();
            }
        }
    }
</script>

<style lang="scss">
.wind-toast{
    bottom: 1rem;
    top: initial;
    height: initial;
    .mask{
        background: none!important;
    }
    .container{
        position: relative;
        text-align: center;
        p{
            display: inline-block;
            max-width: 80%;
            border-radius: 1rem;
            background-color: rgba(0, 0, 0, .7);
        }
    }
}
</style>
