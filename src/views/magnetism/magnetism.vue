<template>
    <wind-container id="magnetism">
        <wind-header/>
        <wind-body>

        </wind-body>
        <wind-footer>
            <bottom-nav :index="1"/>
        </wind-footer>
    </wind-container>
</template>

<script>
    import BottomNav from "../components/BottomNav";

    export default {
        name: "magnetism",
        components: {
            BottomNav
        }
    }
</script>

<style lang="scss">
    #magnetism{
        .wind-body{
            height: calc(100% - 2rem);
        }
    }
</style>
