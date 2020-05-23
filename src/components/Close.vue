<template>
    <button type="button" class="wind-close" @click.stop="close"></button>
</template>

<script>
    export default {
        name: "Close",
        methods: {
            close(){
                console.log('关闭');
                this.$emit('click');
            }
        }
    }
</script>

<style scoped lang="scss">
    .wind-close{
        position: absolute;
        top: .3rem;
        right: .3rem;
        width: .3rem;
        height: .3rem;
        background: url("../assets/img/components/close/close_icon.png");
        background-size: 100% 100%;
        z-index: 999;
    }
</style>
