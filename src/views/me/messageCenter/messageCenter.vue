<template>
    <wind-container id="messageCenter">
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <wind-tab :tabs="tabList" v-model="component"/>
            <keep-alive>
                <component :is="component"></component>
            </keep-alive>
        </wind-body>
    </wind-container>
</template>

<script>
    import Former from "./tabItem/Former";
    import Latest from "./tabItem/Latest";

    export default {
        name: "messageCenter",
        data(){
            return {
                Latest,
                Former,
                component: '',
                tabList: [{
                    text: '最新',
                    component: Latest,
                    class: 'mg',
                    active: 'theme-color',
                }, {
                    text: '以前',
                    component: Former,
                    class: 'mg',
                    active: 'theme-color',
                }]
            }
        }
    }
</script>

<style lang="scss">
#messageCenter{
    .wind-pagination{
        height: calc(100% - 2rem);
    }
}
</style>
