<template>
    <input class="wind-int-input" type="text" :maxlength="maxLength" :value="number"
           @input="changeValue($event)" :placeholder="placeholder">
</template>

<script>
    export default {
        name: "IntInput",
        model: {
            prop: 'number',
            event: 'keydown'
        },
        props: {
            placeholder: {
                default: ''
            },
            number: 0,
            maxLength: {
                default: 8,
            },
        },
        methods: {
            changeValue(e){
                let value = e.target.value;
                if(value){
                    value = value.replace(/^0|\D/g,'').substring(0, this.length);
                }
                e.target.value = value;
                this.$emit('keydown', Number(value));
            }
        }
    }
</script>

<style scoped>

</style>
