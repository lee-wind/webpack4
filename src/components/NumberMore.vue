<template>
    <span class="wind-number-more white-color red-bg flex-center"
          v-if="amount && amount !== '0'">{{amount | filterAmount}}</span>
</template>

<script>
    export default {
        name: "NumberMore",
        props: {
            amount: {
                default(){
                    return 0
                }
            },
        },
        filters: {
            filterAmount(amount){
                return amount < 100 ? amount : '99+'
            }
        }
    }
</script>

<style scoped>
    .wind-number-more{
        position: absolute;
        top: 8%;
        right: 8%;
        width: .45rem;
        height: .45rem;
        font-size: .2rem;
        border-radius: 50%;
    }
</style>
