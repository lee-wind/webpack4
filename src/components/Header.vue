<template>
    <div class="wind-header relative flex-center">
        <slot></slot>
        <p class="lg title">{{headTitle}}</p>
    </div>
</template>

<script>
    export default {
        name: "Header",
        props: ['title'],
        computed: {
            headTitle(){
                return this.title || this.$route.meta.title;
            }
        },
    }
</script>

<style scoped lang="scss">
.wind-header{
    height: 1rem;

    background-color: initial;
    background-image: url("../assets/img/components/header/header_bg.png");
    background-size: 100% 100%;

    .left{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: .3rem;
    }
    .right{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: .3rem;
    }
}
</style>
