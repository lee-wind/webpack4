<template>
    <button type="button" class="wind-submit"
            :class="{ disabled: disabled || isPosting }"
            :disabled="disabled || isPosting"
            @click.stop="submit">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name: "Submit",
        props: {
            disabled: {
                default: false,
            },
            event: {
                default: ''
            }
        },
        data(){
            return{
                isPosting: false
            }
        },
        methods: {
            submit(){
                if(this.event){
                    this.isPosting = true;
                    Promise.all([this.event()])
                        .then(() => {
                            this.isPosting = false;
                        })
                        .catch(err => {
                            this.isPosting = false;
                        })
                }
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
