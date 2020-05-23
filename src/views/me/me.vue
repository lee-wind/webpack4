<template>
    <wind-container id="me">
        <wind-header/>
        <wind-body>

        </wind-body>
        <wind-footer>
            <bottom-nav :index="3"/>
        </wind-footer>
    </wind-container>
</template>

<script>
    import BottomNav from "../components/BottomNav";
    export default {
        name: "me",
        components: {
            BottomNav
        }
    }
</script>

<style lang="scss">
    #me{
        .wind-body{
            height: calc(100% - 2rem);
        }
    }
</style>
