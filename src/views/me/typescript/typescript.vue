<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            {{text}}

        </wind-body>
    </wind-container>
</template>

<script>
    import { greeter, Student} from "./ts";

    export default {
        name: "typescript",
        data(){
            return {
                text: greeter(new Student('Jane', 'M.', 'User'))
            }
        }
    }
</script>

<style scoped>

</style>
