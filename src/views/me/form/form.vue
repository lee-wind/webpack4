<script src="../../../../node_modules/decimal.js/decimal.js"></script>
<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <form>
                <div class="mg" style="width: 50%">
                    <wind-select :list="list" v-model="select" text-key="text"/>
                </div>
                <div class="mg" style="width: 50%">
                    <wind-select :list="list" v-model="select" text-key="text"/>
                </div>
                <div class="mg input">
                    <wind-search class="pd-md" v-model="searchText" @submit="search"/>
                </div>
                <div class="mg input">
                    <wind-int-input class="pd-md bd radius" v-model="int" placeholder="整数输入框"/>
                </div>
                <div class="mg input">
                    <wind-decimal-input class="pd-md bd radius" v-model="decimalInput" placeholder="小数输入框"/>
                </div>
                <div class="mg input">
                    <wind-decimal-input class="pd-md bd radius" :value="decimal" placeholder="小数输入框"/>
                </div>
                <div class="mg">
                    <button type="button" class="block polygon-btn pd-md" @click="submit">提交</button>
                </div>
            </form>
        </wind-body>
    </wind-container>
</template>

<script>
    import { Decimal } from 'decimal.js';
    //console.log(Decimal)
    export default {
        name: "Form",
        data(){
            return {
                int: '',
                decimalInput: '',
                searchText: '',
                list: [{
                    id: 1,
                    text: 11
                },{
                    id: 2,
                    text: 22
                }],
                select: {
                    id: 1,
                    text: 11
                },
                decimal: ''//new Decimal(1e-9)//0.3 - new Decimal(0.2),//new Decimal(1e-9),
            }
        },
        methods: {
            submit(){
                console.log(new Decimal(9));
                console.log(this.int);
                console.log(this.decimalInput);
                console.log(this.searchText);
            },
            search() {
                console.log('查找: ' + this.searchText);
            }
        }
    }
</script>

<style scoped>

</style>
