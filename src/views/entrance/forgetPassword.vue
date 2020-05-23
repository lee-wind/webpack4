<template>
    <wind-container id="forgetPassword">
        <wind-body>
            <router-link to="/login">登录</router-link>
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "forgetPassword"
    }
</script>

<style lang="scss">
    #forgetPassword{
        .wind-body{
            height: 100%;
        }
    }
</style>
