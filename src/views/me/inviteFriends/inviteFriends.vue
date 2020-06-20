<template>
    <wind-container class="has-footer">
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <wind-polygon class="mg">
                <ul>
                    <li class="mg flex">
                        <p>我的邀请码</p>
                        <p class="mg-left-auto">1111 <wind-copy text="111"/></p>
                    </li>
                    <li class="mg">
                        <p class="mg-bottom">我的邀请链接：bilibili.com</p>
                        <wind-copy class="polygon-btn pd-md" :text="11" :icon-show="false">复制链接</wind-copy>
                    </li>
                </ul>
                <img :src="base64" alt="">
                <wind-img-upload :uploadBase64.sync="base64">
                    上传图片
                </wind-img-upload>
            </wind-polygon>
        </wind-body>
        <wind-footer class="pd-horizontal">
            <button class="polygon-btn flex">生成海报</button>
        </wind-footer>
    </wind-container>
</template>

<script>
    export default {
        name: "inviteFriends",
        data(){
            return {
                base64: '',
            }
        }
    }
</script>

<style scoped>

</style>
