<template>
    <div class="wind-list relative sm">
        <p class="flex-middle pd-sm" @click="show = !show">
            <span class="mg-right">{{select[textKey]}}</span>
            <wind-down-arrow class="mg-left-auto"/>
        </p>
        <ul class="white-bg bd text-center radius" v-if="show">
            <li class="pd-sm bd-bottom" v-for="(item, i) in list" :key="i"
                @click="click(item)">
                {{item[textKey]}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Select",
        model: {
            prop: 'select',
            event: 'click',
        },
        props: {
            textKey: {
                default: '',
            },
            list: {
                default(){
                    return []
                }
            },
            select: {
                default(){
                    return {

                    }
                }
            },
        },
        data(){
            return {
                show: false
            }
        },
        methods: {
            click(item){
                this.$emit('click', item);
                this.show = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .wind-list{
        /*display: inline-block;*/
        ul{
            width: 100%;
            position: absolute;
            left: 0;
            box-shadow: .03rem .03rem .05rem 0 rgba(0, 0, 0, 0.2);
            li{
                white-space: nowrap;
            }
            li:last-child{
                border-bottom: initial;
            }
        }
    }
</style>
