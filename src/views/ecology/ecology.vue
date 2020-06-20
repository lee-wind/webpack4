<template>
    <wind-container id="ecology">
        <wind-header/>
        <wind-body>

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
        components: {
            BottomNav
        }
    }
</script>

<style lang="scss">
    #ecology{
        .wind-body{
            height: calc(100% - 2.4rem);
        }
    }
</style>
