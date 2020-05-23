<template>
    <button type="button" class="wind-all theme-color margin-left" @click="click">全部</button>
</template>

<script>
    export default {
        name: 'All',
        model: {
            prop: 'inputValue',
            event: 'click'
        },
        props: {
            inputValue: {
                default: 0
            },
            amount: {
                default: 0
            }
        },
        methods: {
            click() {
                this.$emit('click', this.amount)
            }
        },
    }
</script>

<style scoped>
</style>
