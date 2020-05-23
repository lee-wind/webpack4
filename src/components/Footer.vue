<template>
    <div class="wind-footer flex-center">
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
    display: flex;
    height: 1rem;
    box-shadow: 0 -.06rem .4rem 0 rgba(0, 0, 0, 0.15);
    z-index: 111;
}
</style>
