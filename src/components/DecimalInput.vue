<template>
    <input class="wind-decimal-input" type="text" :value="number" :maxlength="maxLength"
           :placeholder="placeholder" @input="changeValue($event)">
</template>

<script>
    export default {
        name: "DecimalInput",
        model: {
            prop: 'number',
            event: 'change'
        },
        props: {
            placeholder: {
                default: ''
            },
            number: '',
            maxLength: {
                default: 10 //包含小数点
            },
            length: {
                default: 2
            }
        },
        computed: {
            reg(){
                return new RegExp('\\d+(\\.\\d{0,' + this.length + '})?')
            }
        },
        methods: {
            changeValue(e){
                let value = e.target.value;
                if(value){
                    value = (value.match(this.reg)||[''])[0];
                }
                e.target.value = value;
                this.$emit('change', Number(value));
            }
        }
    }
</script>

<style scoped>

</style>
