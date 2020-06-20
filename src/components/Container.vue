<template>
    <div class="wind-container relative">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Container"
    }
</script>

<style scoped lang="scss">
.wind-container{
    width: 100%;
    height: 100%;
    &.has-footer{
        .wind-body{
            height: calc(100% - 2.4rem);
        }
    }
}
</style>
