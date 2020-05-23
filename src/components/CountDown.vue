<template>
    <div class="wind-count-down">
        <button type="button" v-if="countDownTime === 120"
                @click="click">
            <slot></slot>
        </button>
        <p v-else>{{countDownTime}}s</p>
    </div>
</template>

<script>

    export default {
        name: "CountDown",
        data(){
            return{
                countDownTime: 120,
                interval: null,
            }
        },
        methods: {
            countDown(){
                this.interval = setInterval(() => {
                    if(this.countDownTime <= 0){
                        this.countDownTime = 120;
                        clearInterval(this.interval);
                    }else{
                        this.countDownTime--;
                    }
                }, 1000)
            },
            click(){
                new Promise(resolve => {
                    this.$emit('callback', resolve);
                }).then(() => {
                    this.$toast('验证码已发送');
                    this.countDown();
                }).catch(() => {
                    
                })
            }
        },
        beforeDestroy() {
            clearInterval(this.interval);
        }
    }
</script>

<style scoped>

</style>
