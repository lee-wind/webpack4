<template>
    <input class="wind-decimal-input" type="text" :value="number" @input="changeValue($event)" :placeholder="placeholder">
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
            length: {
                default: 2
            },
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
                this.$emit('change', value);
            }
        }
    }
</script>

<style scoped>

</style>
