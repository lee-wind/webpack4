<template>
    <wind-container id="register">
        <wind-body>
            <router-link to="/login">登录</router-link>
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "register"
    }
</script>

<style lang="scss">
    #register{
        .wind-body{
            height: 100%;
        }
    }
</style>
