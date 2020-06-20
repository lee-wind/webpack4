<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
    import bus from './util/bus'

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
        created(){
            window.addEventListener('load', async () => {
                // Modern dapp browsers...
                if (window.ethereum) {
                    window.web3 = new Web3(ethereum);
                    try {
                        // Request account access if needed
                        await ethereum.enable();
                        // Acccounts now exposed
                        //web3.eth.sendTransaction({/* ... */});
                    } catch (error) {
                        // User denied account access...
                    }
                }
                // Legacy dapp browsers...
                else if (window.web3) {
                    window.web3 = new Web3(web3.currentProvider);
                    // Acccounts always exposed
                    web3.eth.sendTransaction({/* ... */});
                }
            });
        },
        mounted(){

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
    background-color: #1D1B3B;
}
</style>
