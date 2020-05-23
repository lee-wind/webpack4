<template>
    <div class="wind-header relative flex-center">
        <slot></slot>
        <p class="lg bold title">{{$route.meta.title}}</p>
    </div>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped lang="scss">
.wind-header{
    height: 1rem;
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
