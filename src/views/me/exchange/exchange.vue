<template>
    <wind-container id="exchange">
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <k-line v-if="KLineShow"
                    :resolutions="resolutions"
                    :optional-resolutions="optionalResolutions"
                    :resolution="resolution"
                    :history="history"
                    :newBar="newBar"
                    @updateResolution="updateResolution"/>
        </wind-body>
    </wind-container>
</template>

<script>
    import { queryKLine } from "../../../api/me";
    import KLine from "./components/KLine";
    import Socket from "../../../util/socket";
    export default {
        name: "exchange",
        data(){
            return {
                symbol: 'BTC/USDT',
                size: 1000,
                resolution: {
                    name: '15分',
                    value: 60 * 15
                },
                history: {
                    data: []
                },
                resolutions: [{
                    name: '时分',
                    value: 60,
                }, {
                    name: '15分',
                    value: 60 * 15
                }, {
                    name: '1小时',
                    value: 60 * 60
                }, {
                    name: '4小时',
                    value: 60 * 60 * 4,
                }, {
                    name: '1天',
                    value: 60 * 60 * 24,
                }],
                optionalResolutions: [{
                    name: '1分',
                    value: 60,
                }, {
                    name: '5分',
                    value: 60 * 5
                }, {
                    name: '30分',
                    value: 60 * 30
                }, {
                    name: '1周',
                    value: 60 * 60 * 24 * 7,
                }],
                KLineShow: false,
                newBar: {},
                socket: new Socket(),
            }
        },
        created(){
            this.init();
        },
        components: { KLine },
        methods: {
            init(){
                this.socket.doOpen();
                this.socket.on('open', () => {
                    this.queryKLine();
                });
                this.socket.on('reconnect', () => {
                    console.log('重连');
                    this.init();
                })
            },
            updateResolution(resolution){
                console.log('更新周期');

                this.unsubscribe(this.resolution.value);

                this.socket.destroy();

                this.resolution = resolution;

                this.init();
            },
            queryKLine(){
                console.log('已查询到历史记录');
                queryKLine(this.size, this.resolution.value, this.symbol)
                    .then(res => {
                        this.history = res.data;
                        this.KLineShow = false;

                        this.subscribe();

                        this.$nextTick(() => {
                            this.KLineShow = true;
                        })
                }).catch(err => {
                    this.socket.destroy();
                })
            },
            unsubscribe(resolution) {
                console.log('取消订阅');
                let sendMessage = {
                    op: 'unsubscribe',
                    args: `${this.symbol}_${resolution}`
                };
                this.socket.send(JSON.stringify(sendMessage));
            },
            subscribe(){
                console.log('订阅K线')
                let sendMessage = {
                    op: 'subscribe',
                    args: `${this.symbol}_${this.resolution.value}`
                }
                this.socket.send(JSON.stringify(sendMessage));
                this.socket.on('message', this.onmessage);
            },
            onmessage(data){
                if(data.includes(['[']) && data.includes(this.symbol)){
                    data = JSON.parse(data);
                    this.newBar = {
                        close: data[5],
                        granularity: this.resolution.value,
                        high: data[3],
                        low: data[4],
                        open: data[2],
                        symbol: data[0],
                        time: data[1],
                        volume: data[6]
                    }
                }
            }
        },
        beforeDestroy(){
            this.socket.destroy();
        }
    }
</script>

<style scoped>

</style>
