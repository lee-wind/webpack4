<template>
    <input class="wind-number-input" type="text" :value="number"
           :placeholder="placeholder" :maxlength="maxLength"
           @input="changeValue($event)" @keyup="keyup"
           @focus="focus" @blur="blur">
</template>

<script>
    export default {
        name: "NumberInput",
        model: {
            prop: 'number',
            event: 'keydown'
        },
        props: {
            placeholder: {
                default: ''
            },
            number: '',
            length: {
                default: 2,
            },
            maxLength: {
                default: 10,
            }
        },
        methods: {
            changeValue(e){
                let val = e.target.value;
                let reg = this.length > 0 ? `\\d+(.\\d{0,${this.length}})?` : /^\d+/;
                val = val.toString();
                val = (val.replace(/[^0-9.]/g,'').match(reg)||[''])[0].replace(/^0\d/,val.substr(1));
                e.target.value = val;
                this.$emit('keydown', Number(val));
            },
            keyup(){
                this.$emit('keyup');
            },
            focus(){
                this.$emit('focus');
            },
            blur(){
                this.$emit('blur');
            }
        }
    }
</script>

<style scoped>

</style>
