<template>
    <form class="wind-search flex-middle bd radius" action="" onsubmit="return false">
        <input ref="search" type="search" v-model="text" placeholder="搜索" @search="search">
        <img src="../assets/img/components/search/search_icon.png" alt="" @click="search">
    </form>
</template>

<script>
    export default {
        name: "Search",
        data(){
            return {
                text: ''
            }
        },
        methods: {
            search(){
                this.$refs.search.blur();
                this.$emit('search', this.text);
            },
        }
    }
</script>

<style scoped lang="scss">
    .wind-search{
        /*padding: .1rem .2rem;*/
        input{
            flex: 1;
        }
        input[type="search"]::-webkit-search-cancel-button{
            -webkit-appearance: none;
        }
        img{
            width: .3rem;
        }
    }
</style>
