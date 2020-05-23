<template>
    <li class="wind-tab-item relative main-color text-center"
        :class="active"
        @click="changeCurrentTabComponent">
        <slot></slot>
    </li>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "TabItem",
        props: {
            activeStyle: {
                default() {
                    return [];
                }
            },
            component: {
                default(){
                    return {
                        name: ''
                    }
                }
            }
        },
        computed: {
            ...mapState({
                currentTabComponent: state => state.currentTabComponent
            }),
            active(){
                if(this.currentTabComponent.name === this.component.name){
                    return this.activeStyle.toString().replace(',', ' ');
                }else{
                    return '';
                }
            }
        },
        created(){

        },
        methods: {
            changeCurrentTabComponent(){
                this.$parent.changeCurrentTabComponent(this.component);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
