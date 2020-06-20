<template>
    <div class="wind-body auto">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Body"
    }
</script>

<style scoped lang="scss">
    .wind-body{
        height: calc(100% - 1rem);
        background-color: #1D1B3B;
    }
</style>
