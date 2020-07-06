<template>
    <wind-container id="ecology">
        <wind-body>
            <canvas id="bgCanvas"></canvas>
            <canvas id="aniCanvas"></canvas>
        </wind-body>
        <wind-footer>
            <bottom-nav :index="2"/>
        </wind-footer>
    </wind-container>
</template>

<script>
    import BottomNav from "../components/BottomNav";
    export default {
        name: "ecology",
        data(){

        },
        components: {
            BottomNav
        },
    }
</script>

<style lang="scss">
    #ecology{
        .wind-body{
            height: calc(100% - 2.4rem);
        }
    }
</style>
