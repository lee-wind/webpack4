<template>
    <wind-pagination :length="list.length" :total="total"
                     @loadMore="getList">
        <ul>
            <li class="mg" v-for="i in list">
                {{i}}
            </li>
        </ul>
    </wind-pagination>
</template>

<script>
    export default {
        name: "Latest",
        data(){
            return {
                list: [],
                total: 40,
            }
        },
        methods: {
            getList(i, resolve){
                console.log(i);
                if(i === 1){
                    this.list = [];
                }
                for(let i = 0; i < 20; i++){
                    this.list.push(i)
                }
                resolve();
            }
        }
    }
</script>

<style scoped>

</style>
