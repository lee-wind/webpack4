<template>
    <wind-container id="login">
        <wind-body>
            <router-link to="/register">注册</router-link>
            <router-link to="/forgetPassword">找回密码</router-link>
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "login"
    }
</script>

<style lang="scss">
#login{
    .wind-body{
        height: 100%;
    }
}
</style>
