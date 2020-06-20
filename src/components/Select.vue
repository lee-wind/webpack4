<template>
    <div class="wind-list relative sm">
        <p class="flex-middle pd-md bd radius" @click.stop="show = !show">
            <span class="mg-right">{{select[textKey]}}</span>
            <wind-down-arrow class="mg-left-auto"/>
        </p>
        <ul class="bd text-center radius hidden" v-if="show">
            <li class="pd-md bd-bottom" v-for="(item, i) in list" :key="i"
                @click.stop="click(item)">
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
        mounted() {
            //document.getElementById('app').addEventListener('click', this.hide)
        },
        methods: {
            click(item){
                this.$emit('click', item);
                this.show = false;
            },
            hide(){
                console.log('隐藏下拉')
                this.show = false;
            }
        },
        beforeDestroy(){
            //document.getElementById('app').removeEventListener('click', this.hide);
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
