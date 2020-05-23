<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
    export default {
        name: "App",
        provide(){
            return {
                reload: this.reload
            }
        },
        data(){
            return {
                isRouterAlive: true
            }
        },
        methods: {
            reload(){
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                })
            }
        }
    }
</script>

<style lang="scss">
#app{
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
