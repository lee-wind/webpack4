<template>
    <div id="echarts" style="height: 5.5rem">

    </div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: "Echarts",
        data(){
            return {
                xAxis: {
                    data: [0, 500, 1000, 1500, 2000, 2500]
                },
                series: {
                    data: [0.00, 3.20, 2.00, 1.80, 1.40, 0.90],
                },
            }
        },
        mounted(){
            this.generateEchartsLine();
        },
        methods: {
            generateEchartsLine() {
                let that = this;
                let myChart = echarts.init(document.getElementById('echarts'));
                myChart.setOption({
                    grid: {
                        //show: true,
                        // top: '10',
                    },
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: '#5E22D3',
                        textStyle: {
                            fontSize: 10
                        },
                        position(point, params, dom, rect, size){
                            return [point[0], point[1]];
                        },
                        formatter(param){
                            //console.log(param);
                            return '收益率: ' + param.value + '%';
                        }
                    },
                    xAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: '#9083A0',
                            margin: 15
                        },
                        data: this.xAxis.data,

                    },
                    yAxis: {
                        name: '收益率:',
                        nameTextStyle: {
                            color: '#ffffff',
                            align: 'left',
                            verticalAlign: 'bottom'
                        },
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#311E4B']
                            }
                        },
                        axisLabel: {
                            formatter: '{value}%',
                            color: '#9083A0',
                        },

                        splitNumber: 4
                    },
                    series: [{
                        name: '收益率',
                        type: 'line',
                        data: this.series.data,
                        areaStyle: {
                            color: '#5D398A'
                        },
                        lineStyle: {
                            color: '#7635F5',
                        },
                        itemStyle: {
                            borderColor: '#9083A0',
                        },
                        symbolSize: 9
                        // data: [0, 2000, 1800, 1600, 1400, 800]
                    }]
                })
            },
        }
    }
</script>

<style scoped>

</style>
