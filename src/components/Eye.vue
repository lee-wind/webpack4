<template>
    <p class="wind-eye">
        <img src="../assets/img/components/eye/eye_icon.png" alt="" v-if="isOpen" @click="close">
        <img src="../assets/img/components/eye/eye_close_icon.png" alt="" v-if="!isOpen" @click="show">
    </p>
</template>

<script>
    export default {
        name: "Eye",
        model: {
            prop: 'value',
            event: 'update'
        },
        props: {
            value: {
                default: ''
            },
        },
        data(){
            return {
                replica: '',
                isOpen: true
            }
        },
        created(){
            /*this.replica = this.value + '';
            console.log(this.replica);*/
        },
        methods: {
            show(){
                console.log(222);
                this.isOpen = true;
                this.$emit('update', this.replica);
            },
            close(){
                console.log(111);
                this.isOpen = false;
                if(!this.value.includes('*')){
                    this.replica = this.value;
                }
               /* this.$emit('update', this.replica.replace(/[0-9]/g, '******'));*/
                this.$emit('update', '******');
            }
        }
    }
</script>

<style scoped lang="scss">
.wind-eye{
    display: inline-block;
    vertical-align: middle;
    img{
        width: .48rem;
    }
}
</style>
