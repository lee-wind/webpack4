<template>
    <ul class="wind-tab-list text-center space-evenly">
        <li v-for="(tab, i) in tabs" :key="i"
            :class="filterClass(tab)"
            @click="changeCurrentTabComponent(tab)">
            {{tab.text}}
            <wind-number-more :amount="tab.number"/>
        </li>
    </ul>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "TabList",
        model: {
            prop: 'component',
            event: 'change',
        },
        props: {
            component: {
                default(){
                    return {}
                }
            },
            tabs: {
                default(){
                    return []
                }
            }
        },
        computed: {
            ...mapState({
                currentTabComponent: state => state.currentTabComponent
            }),
        },
        created(){
            if(this.component.name){
                console.log('页面组件');
                this.updateCurrentTabComponent(this.component);
            }else if(this.currentTabComponent.name){
                console.log('公共组件');
                this.$emit('change', this.currentTabComponent);
            }else{
                console.log('没有组件');
                this.changeCurrentTabComponent(this.tabs[0]);
            }
        },
        methods: {
            ...mapActions([
                'updateCurrentTabComponent',
            ]),
            changeCurrentTabComponent(tab){
                this.$emit('change', tab.component);
                this.updateCurrentTabComponent(tab.component);
            },
            filterClass(tab){
                if(this.currentTabComponent.name === tab.component.name){
                    return tab.class + ' ' + tab.active;
                }else{
                    return tab.class;
                }
            }
        },
    }
</script>

<style scoped lang="scss">
.wind-tab-list{
    li{
       /* flex: 1;*/
    }
}
</style>
