<template>
<wind-pagination :length="list.length" :total="total"
                 @loadMore="getList">
    <ul>
        <li class="mg" v-for="i in list" :key="i">
            {{i}}
        </li>
    </ul>
</wind-pagination>
</template>

<script>
    export default {
        name: "Former",
        data(){
            return {
                list: [],
                total: 40,
            }
        },
        methods: {
            getList(i, resolve){
                if(i === 1){
                    this.list = [];
                }
                for(let i = 50; i < 70; i++){
                    this.list.push(i)
                }
                resolve();
            }
        }
    }
</script>

<style scoped>

</style>
