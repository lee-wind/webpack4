<template>
    <div class="polygon">
        <div class="top-left"></div>
        <div class="top-right" v-if="number > 2"></div>
        <div class="content">
            <slot></slot>
        </div>
        <div class="bottom-left" v-if="number === 4"></div>
        <div class="bottom-right" v-if="number > 1"></div>
    </div>
</template>

<script>
    export default {
        name: "windPolycon",
        props: {
            number: {
                default: 2,
            },
        }
    }

</script>

<style lang="scss">
    .polygon{
        position: relative;
        overflow: hidden;
        $borderColor: #573B7F;
        $border: 1px solid $borderColor;
        .content{
            overflow: hidden;
            border: $border;
            background-color: #392357;
        }
        .top-left, .top-right, .bottom-left, .bottom-right{
            position: absolute;
            z-index: 11;
            width: .3rem;
            height: .3rem;
            background-color: inherit;
        }
        .top-left{
            top: 0;
            left: 0;
            border-right: $border;
            transform: translate(-50%, -50%) rotate(45deg);
        }
        .top-right{
            top: 0;
            right: 0;
            border-left: $border;
            transform: translate(50%, -50%) rotate(-45deg);
        }
        .bottom-left{
            bottom: 0;
            left: 0;
            border-right: $border;
            transform: translate(-50%, 50%) rotate(-45deg);
        }
        .bottom-right{
            bottom: 0;
            right: 0;
            border-left: $border;
            transform: translate(50%, 50%) rotate(45deg);
        }
        &.high-light{
            $borderColor: #6822F2;
            $border: 1px solid $borderColor;
            .content{
                border: $border;
                background-color: #2C1A46;
            }
            .top-left, .top-right, .bottom-left, .bottom-right{
                border-color: $borderColor;
            }
        }
        &.deep{
            $borderColor: #201234;
            $border: 1px solid $borderColor;
            .content{
                border: $border;
                background-color: #201234;
            }
            .top-left, .top-right, .bottom-left, .bottom-right{
                border-color: $borderColor;
            }
        }
    }
</style>
