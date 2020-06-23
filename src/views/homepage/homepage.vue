<template>
    <wind-container id="homepage">
        <wind-header/>
        <wind-body>
            <h1>Hello Vue、 Webpack!</h1>
            <div id="banner" class="mg-bottom swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(banner, i) in banners" :key="i">
                        <img class="height-auto" :src="banner" alt="">
                    </div>
                </div>
            </div>
            <div class="mg flex-middle">
                <p>公告：</p>
                <div id="notice" style="height: .5rem" class="flex1 swiper-container">
                    <div class="swiper-wrapper">
                        <div style="height: auto!important;" class="swiper-slide flex-middle" v-for="(notice, i) in notices">{{notice}}</div>
                    </div>
                </div>
            </div>
            <button @click="confirm">confirm</button>
            <button @click="toast">toast</button>
            <button @click="loading">loading</button>
            <button @click="confirmPay">confirmPay</button>
            <button @click="alert">alert</button>

            <echarts/>
        </wind-body>
        <wind-footer>
            <bottom-nav :index="0"/>
        </wind-footer>
    </wind-container>
</template>

<script>
    import Swiper from 'swiper'
    import BottomNav from "../components/BottomNav";
    import Echarts from "./components/Echarts";

    export default {
        name: "homepage",
        data(){
            return {

                banners: [
                    //require('../../assets/img/mnemonic_backup_modal.png'),
                    require('../../assets/img/mnemonic_backup_modal.png'),
                ],
                notices: ['我爱你你却爱着他', '你个贱人，食屎啦你']
            }
        },
        components: {
            Echarts,
            BottomNav
        },
        created() {
            if(!!window.imToken){
                //this.$alert('当前为imToken浏览器');
            }else{
                //this.$alert('当前不为imToken浏览器');
            }
        },
        mounted(){
            new Swiper('#banner', {
                loop: false,
                autoplay: {
                    delay: 3000
                },
                resistance: false //是否回弹
            });
            new Swiper('#notice', {
                loop: true,
                autoplay: {
                    delay: 5000,
                },
                direction: 'vertical'
            })
        },
        methods: {
            confirm(){
                this.$confirm('您确定要叮叮叮吗').then(() => {
                    console.log('resolve')
                }).catch(() => {
                    console.log('reject')
                })
            },
            toast(){
                this.$toast(1111);
            },
            loading(){
                this.$loading(222);
            },
            confirmPay(){
                this.$confirmPay('顶顶顶').then(payPassword => {

                });
            },
            alert(){
                this.$alert('我爱你你却爱着她', '狗男女');
            },
        }
    }
</script>

<style lang="scss">
    #homepage{
        .wind-body{
            height: calc(100% - 2.4rem);
        }
    }
</style>
