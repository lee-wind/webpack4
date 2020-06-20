<template>
    <div class="wind-footer flex-middle">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped lang="scss">
.wind-footer{
    position: relative;
    height: 1.4rem;
    padding-top: .08rem;
    background-image: url('../assets/img/components/footer/footer_bg.png');
    background-size: 100% 100%;
    .polygon-btn{
        background-color: initial;
        background-image: url("../assets/img/polygon_btn.png");
        background-size: 100% 100%;
        height: 1rem;
    }
    .polygon-btn-sm{
        background-color: initial;
        background-image: url("../assets/img/polygon_sm_btn.png");
        background-size: 100% 100%;
        height: 1rem;
    }
}
</style>
