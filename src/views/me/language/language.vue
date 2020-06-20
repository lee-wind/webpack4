<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <wind-polygon class="mg">
                <ul>
                    <li class="pd bd-bottom" :class="{ 'theme-color': locale === ZH_CN }" @click="select(ZH_CN)">
                        简体中文
                    </li>
                    <li class="pd" :class="{ 'theme-color': locale === EN_US }" @click="select(EN_US)">
                        English
                    </li>
                </ul>
            </wind-polygon>
        </wind-body>
    </wind-container>
</template>

<script>
    import i18n from "../../../locale";
    import { ZH_CN, EN_US } from "../../../locale";

    export default {
        name: "Language",
        data(){
            return {
                ZH_CN,
                EN_US,
            }
        },
        computed: {
            locale(){
                return this.$i18n.locale;
            }
        },
        methods: {
            select(locale){
                i18n.locale = locale;
                localStorage.setItem('locale', locale);
            }
        }

    }
</script>

<style scoped>

</style>
