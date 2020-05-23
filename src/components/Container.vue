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
}
</style>
