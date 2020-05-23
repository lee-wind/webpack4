<template>
    <nav class="block flex text-center">
        <router-link class="block flex1" to="/homepage">
            <p :class="{ 'theme-color': index === 0 }">首页</p>
        </router-link>
        <router-link class="block flex1" to="/magnetism">
            <p :class="{ 'theme-color': index === 1 }">励磁矩阵</p>
        </router-link>
        <router-link class="block flex1" to="/ecology">
            <p :class="{ 'theme-color': index === 2 }">生态</p>
        </router-link>
        <router-link class="block flex1" to="/me">
            <p :class="{ 'theme-color': index === 3 }">我的</p>
        </router-link>
    </nav>
</template>

<script>
    export default {
        name: "bottomNav",
        props: {
            index: {
                default: 0,
            }
        }
    }
</script>

<style scoped>

</style>
