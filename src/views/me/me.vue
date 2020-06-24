<template>
    <wind-container id="me">
        <wind-header>
            <router-link class="right" to="/me/avatar">
                头像
            </router-link>
        </wind-header>
        <wind-body>
            <wind-polygon class="mg">
                <ul>
                    <li>
                       <router-link class="flex-middle bd-bottom pd" to="/me/inviteFriends">
                           <p>邀请好友</p>
                           <wind-link-arrow/>
                       </router-link>
                    </li>
                    <li>
                        <router-link class="flex-middle bd-bottom pd" to="/me/messageCenter">
                            <p>消息中心</p>
                            <wind-link-arrow/>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="flex-middle bd-bottom pd" to="/me/language">
                            <p>切换语言</p>
                            <div class="mg-left-auto flex-middle">
                                <span class="mg-right-md">{{language}}</span>
                                <wind-link-arrow/>
                            </div>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="flex-middle bd-bottom pd" to="/me/form">
                            <p>表单操作</p>
                            <wind-link-arrow/>
                        </router-link>
                    </li>
                    <li>
                        <router-link class="flex-middle bd-bottom pd" to="/me/DApp">
                            <p>DApp</p>
                            <wind-link-arrow/>
                        </router-link>
                    </li>
                    <li class="flex-middle bd-bottom pd" @click="toMessageCenter">
                        <p>去消息中心</p>
                        <wind-link-arrow/>
                    </li>
                    <li>
                        <router-link class="flex-middle pd" to="/me/KLine">
                            <p>KLine</p>
                            <wind-link-arrow/>
                        </router-link>
                    </li>
                </ul>
            </wind-polygon>
        </wind-body>
        <wind-footer>
            <bottom-nav :index="3"/>
        </wind-footer>
    </wind-container>
</template>

<script>
    import Former from "./messageCenter/tabItem/Former";
    import { getLanguage } from "../../locale";
    import BottomNav from "../components/BottomNav";
    export default {
        name: "me",
        data(){
            return {
                language: getLanguage()
            }
        },
        components: {
            BottomNav
        },
        methods: {
            toMessageCenter(){
                this.$updateCurrentTabComponent(Former);
                this.$router.push({
                    name: 'messageCenter'
                })
            }
        }
    }
</script>

<style lang="scss">
    #me{
        .wind-body{
            height: calc(100% - 2.4rem);
        }
    }
</style>
