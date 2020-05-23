<template>
    <div class="wind-modal" v-show="modalShow">
        <transition name="fade">
            <div class="mask absolute" v-show="modalContentShow" @click.stop="clickMask"></div>
        </transition>
        <transition name="slide" v-on:after-leave="leave">
            <div class="container white-bg radius" v-show="modalContentShow">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Modal",
        props: {
            maskClickHide: {
                default: true
            }
        },
        data(){
            return {
                modalShow: false,
                modalContentShow: false,
                selector: ''
            }
        },
        methods: {
            show(){
                this.modalShow = true;
                this.modalContentShow = true;
            },
            hide(selector = ''){
                this.modalContentShow = false;
                this.selector = selector;
            },
            clickMask(){
                if(this.maskClickHide){
                    this.hide();
                }
            },
            leave(el){
                this.modalShow = false;
                if(this.selector){
                    document.body.removeChild(document.body.querySelector(this.selector));
                }
            }
        }
    }
</script>

<style lang="scss">
.wind-modal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .mask{
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
    }
    .fade-enter-active, .slide-enter-active {
        transition: all .2s linear;
    }
    .fade-leave-active, .slide-leave-active {
        transition: all .2s linear;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    .container{
        position: absolute;
        width: 90%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .body{
            min-height: 1rem;
            max-height: 4rem;
        }
        .footer{
            display: flex;
            /*height: 1rem;*/
            button{
                flex: 1;
                text-align: center;
            }
        }
    }
    &.raw{
        .container{
            width: 100%;
            top: initial;
            left: initial;
            transform: initial;
            background-color: transparent;
        }
    }
    &.top{
        top: 1rem;
        left: 0;
        height: calc(100% - 1rem);
        .container{
            width: 100%;
            top: 0;
            left: 0;
            transform: initial;
            border-radius: 0;
        }
        .slide-enter, .slide-leave-to{
           opacity: 0;
        }
    }
    &.bottom{
        .container{
            width: 100%;
            top: initial;
            left: initial;
            bottom: 0;
            transform: initial;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        .slide-enter, .slide-leave-to{
            transform: translateY(100%);
        }
    }
}
</style>
