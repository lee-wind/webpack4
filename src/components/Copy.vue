<template>
    <button type="button" v-if="text" class="wind-copy"
            :class="{ 'background': iconShow }"
            v-clipboard:copy="text"
            v-clipboard:success="copySuccess">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name: "Copy",
        props: {
            text: '',
            iconShow: {
                default: true,
            }
        },
        methods: {
            copySuccess(){
                this.$toast('复制成功');
            }
        }
    }
</script>

<style scoped lang="scss">
    .wind-copy{
        &.background{
            width: .3rem;
            height: .3rem;
            margin-left: .1rem;
            background: url("../assets/img/components/copy/copy_icon.png");
            background-size: 100% 100%;
        }
    }
</style>
