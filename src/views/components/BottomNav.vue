<template>
    <nav class="block flex text-center sm theme-color" id="bottomNav">
        <router-link replace class="block flex1" to="/homepage">
            <img v-if="index === 0" src="../../assets/img/components/bottomNav/homepage_icon_active.png" alt="">
            <img v-else src="../../assets/img/components/bottomNav/homepage_icon.png" alt="">
            <p :class="{ 'white-color': index === 0 }">{{$t('bottomNav[0]')}}</p>
        </router-link>
        <router-link replace class="block flex1" to="/magnetism">
            <img v-if="index === 1" src="../../assets/img/components/bottomNav/magnetism_icon_active.png" alt="">
            <img v-else src="../../assets/img/components/bottomNav/magnetism_icon.png" alt="">
            <p :class="{ 'white-color': index === 1 }">{{$t('bottomNav[1]')}}</p>
        </router-link>
        <router-link replace class="block flex1" to="/ecology">
            <img v-if="index === 2" src="../../assets/img/components/bottomNav/ecology_icon_active.png" alt="">
            <img v-else src="../../assets/img/components/bottomNav/ecology_icon.png" alt="">
            <p :class="{ 'white-color': index === 2 }">{{$t('bottomNav[2]')}}</p>
        </router-link>
        <router-link replace class="block flex1" to="/me">
            <wind-number-more :amount="adoptAndTransferNum"/>
            <img v-if="index === 3" src="../../assets/img/components/bottomNav/me_icon_active.png" alt="">
            <img v-else src="../../assets/img/components/bottomNav/me_icon.png" alt="">
            <p :class="{ 'white-color': index === 3 }">{{$t('bottomNav[3]')}}</p>
        </router-link>
    </nav>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "BottomNav",
        props: {
            index: {
                default: 0,
            }
        },
        computed: {
            ...mapGetters('my', [
                'adoptAndTransferNum'
            ]),
        },
    }
</script>

<style scoped lang="scss">
    #bottomNav{
        height: 100%;
        background-color: initial;
        a{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            align-content: center;
            img{
                display: block;
                margin: 0 auto;
                width: auto;
                height: .6rem;
            }
            p{
                width: 100%;
            }
        }
    }
</style>
