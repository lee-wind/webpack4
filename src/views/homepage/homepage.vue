<template>
    <wind-container id="homepage">
        <wind-header/>
        <wind-body>
            <h1>Hello Vue and Webpack!</h1>
            <button @click="confirm">confirm</button>
            <button @click="toast">toast</button>
            <button @click="loading">loading</button>
        </wind-body>
        <wind-footer>
            <bottom-nav :index="0"/>
        </wind-footer>
    </wind-container>
</template>

<script>
    import BottomNav from "../components/BottomNav";
    export default {
        name: "homepage",
        components: {
            BottomNav
        },
        created() {
            let name = this.$getLocalStorage('name', 'sun');
            console.log(name);

            this.$setLocalStoage('name', 'wind');

            let name2 = this.$getLocalStorage('name');
            console.log(name2);

            //this.$alert(111);
        },
        methods: {
            confirm(){
                this.$confirm(222).then(() => {
                    console.log('resolve')
                }).catch(() => {
                    console.log('reject')
                })
            },
            toast(){
                this.$toast(1111);
            },
            loading(){
                this.$loading(222);
            }
        }
    }
</script>

<style lang="scss">
    #homepage{
        .wind-body{
            height: calc(100% - 2rem);
        }
    }
</style>
