<template>
    <button class="wind-back left" @click="back">
        <img class="wind-icon" src="../assets/img/components/back/back_icon.png" alt="">
    </button>
</template>

<script>
    export default {
        name: "Back",
        methods: {
            back(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="scss">
</style>
