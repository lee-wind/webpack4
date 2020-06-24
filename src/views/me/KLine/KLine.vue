<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
           <div id="KLine">
               <div class="toolbar">
                   <ul class="resolution">
                       <li v-for="([key, value]) in resolutions.entries()"
                           :class="selectedResolution === value ? 'active' : ''"
                           @click="selectResolution(value)" :key="key">
                           {{key}}
                       </li>
                       <li @click="showAdditionalResolutions">{{moreResolutionText}}</li>
                       <li class="showSetting" @click="showSetting">设置</li>
                   </ul>
                   <ul class="addition-resolution bd-top bd-bottom" v-if="additionalResolutionsShow">
                       <li v-for="([key, value]) in additionalResolutions.entries()"
                           :class="selectedResolution === value ? 'active' : ''"
                           @click="selectResolution(value)" :key="key">
                           {{key}}
                       </li>
                   </ul>
                   <div class="setting" v-if="settingShow">
                       <ul>
                           <li class="bd-top">
                               <p class="bd-right">主图</p>
                               <p :class="{ active: MAShow }" @click="MAShow = true">MA<p/>
                               <p class="left-auto" :class="{ active: !MAShow }" @click="MAShow = false">开关</p>
                           </li>
                           <li class="bd-top">
                               <p class="bd-right">副图</p>
                               <p :class="{ active: MACDShow }" @click="MACDShow = true">MACD<p/>
                               <p class="left-auto" :class="{ active: !MACDShow }" @click="MACDShow = false">开关</p>
                           </li>
                           <li class="bd-top">
                               <p class="bd-right">界面</p>
                               <ul>
                                   <li>
                                       <p :class="{ active: themeColor === 'black' }" @click="themeColor = 'black'">暗色</p>
                                   </li>
                                   <li>
                                       <p :class="{ active: themeColor === 'white' }" @click="themeColor = 'white'">亮色</p>
                                   </li>
                               </ul>
                           </li>
                           <li class="bd-top bd-bottom">
                               <p class="bd-right">网格图</p>
                               <ul>
                                   <li>
                                       <p :class="{ active: !gridLineShow }" @click="gridLineShow = false">关闭</p>
                                   </li>
                                   <li>
                                       <p :class="{ active: gridLineShow }" @click="gridLineShow = true">开启</p>
                                   </li>
                               </ul>
                           </li>
                       </ul>
                   </div>
               </div>
               <div class="chart">
<!--                    <canvas id="KLineCanvas"></canvas>-->
                   <canvas id="KLineBgCanvas"></canvas>
               </div>
           </div>
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "KLine",
        props: {
            history: {
                default(){
                    return [];
                }
            },
            KLineCountPerCell: { //每个单元格有N条K线
                default() {
                    return 10;
                }
            }
        },
        data(){
            return {
                resolutions: new Map([
                    ['1分', 60],
                    ['15分', 900],
                    ['1小时', 3600],
                    ['4小时', 14400],
                    ['1天', 86400],
                ]),
                moreResolutionText: '更多',
                additionalResolutions: new Map([
                    ['1分', 60],
                    ['5分', 300],
                    ['30分', 1800],
                    ['1周', 604800]
                ]),
                additionalResolutionsShow: false,
                settingShow: false,
                MAShow: false,
                MACDShow: false,
                gridLineShow: false,

                themeColor: 'black',
                selectedResolution: 60,
                digit: 4,
                closeValue: '', //当前收盘价
                startIndex: 0, //显示数据在历史数据的开始索引
                endIndex: 0, //显示数据在历史数据的结束索引
                KLineCell: [5, 3.5], //K线宽5格，高3.5格,
                cellWidth: 0, //单元格宽
                cellChart: [5, 5.5],
                KLineWidth: 0,
                currentData: {},
                KLineCanvas: '',
            }
        },
        created(){
            //this.getBaseInfo();
            this.$nextTick(() => {
                this.init();
                this.createKLineCanvas();
                this.setKLineBgCanvas();
            })
            console.log(this.selectedResolution)
        },
        methods: {
            getBaseInfo(){
                let length = this.history.length;
                this.closeValue = this.history[length - 1].close;
                let start = length - this.KLineCountPerCell * 4;
                this.startIndex = start > 0 ? start : 0;
                this.endIndex = length - 1;
                if(this.MACDShow){
                    this.KLineCell = [5, 3.5];
                }else{
                    this.KLineCell = [5, 4.5];
                }
                this.cellWidth = document.body.clientWidth / this.KLineCell[0]
                this.KLineWidth = this.cellWidth / this.KLineCountPerCell;
            },
            init(){
                this.getCurrentData();
            },
            getCurrentData(){
                let history = this.history;
                let length = history.length;
                if(length < 1) return;
                /**
                 * 12日EMA的算式为

                 *  EMA（12）=前一日EMA（12）×11/13＋今日收盘价×2/13

                 *  26日EMA的算式为

                 *  EMA（26）=前一日EMA（26）×25/27＋今日收盘价×2/27

                 *  2、计算离差值（DIF）

                 *  DIF=今日EMA（12）－今日EMA（26）
                 * 3、计算DIF的9日EMA
                 * 根据离差值计算其9日的EMA，即离差平均值，是所求的MACD值。为了不与指标原名相混淆，此值又名DEA或DEM。
                 * 今日DEA（MACD）=前一日DEA×8/10＋今日DIF×2/10
                 */
                let num = 6;
                history.map((item, i) => {
                    if(i === 0){
                        item.EMA_12 = 0;
                        item.EMA_26 = 0;
                        item.DIF = 0;
                        item.DEA = 0;
                        item.MACD = 0;
                    } else {
                        item.EMA_12 = (
                            (history[i - 1].EMA_12 * 11) / 13 + (item.close * 2) / 13
                        ).toFixed(num);
                        item.EMA_26 = (
                            (history[i - 1].EMA_26 * 25) / 27 + (item.close * 2) / 27
                        ).toFixed(num);
                        item.DIF = (item.EMA_12 - item.EMA_26).toFixed(num);
                        item.DEA = (
                            (history[i - 1].DEA * 8) / 10 + (item.DIF * 2) / 10
                        ).toFixed(num);
                        item.MACD = ((item.DIF - item.DEA) * 2).toFixed(num);
                    }
                    item.MA5 = this.MACalculate(5, history, i, 'close');
                    item.VolMA5 = this.MACalculate(5, history, i, 'volume');
                    item.MA10 = this.MACalculate(10, history, i, 'close');
                    item.VolMA10 = this.MACalculate(10, history, i, 'volume');
                    item.MA30 = this.MACalculate(30, history, index, 'close');
                });
                let currentData = history.slice(this.startIndex, this.endIndex + 1);
                let minPrice = currentData[0].low,
                    maxPrice = currentData[0].high,
                    lowPrice = currentData[0].low,
                    highPrice = currentData[0].high,
                    maxVol = currentData[0].volume,
                    maxMACD = 0,
                    minMACD = 0;
                currentData.map((item, i) => {
                    let MACDArr = [item.DIF, item.DEA, item.MACD, maxMACD, minMACD];
                    maxMACD = Math.max(...MACDArr);
                    minMACD = Math.min(...MACDArr);

                    let minMaxPriceArr = [item.low, item.high, minPrice, maxPrice];
                    let lowHighPriceArr = [item.low, item.high, lowPrice, highPrice];
                    item.MA5 && minMaxPriceArr.push(item.MA5);
                    item.MA10 && minMaxPriceArr.push(item.MA10);
                    item.MA30 && minMaxPriceArr.push(item.MA30);

                    minPrice = Math.min(...minMaxPriceArr);
                    maxPrice = Math.max(...minMaxPriceArr);
                    lowPrice = Math.min(...lowHighPriceArr);
                    highPrice = Math.max(...lowHighPriceArr);

                    let VolArr = [item.volume, maxVol];
                    item.VolMA5 && VolArr.push(item.VolMA5);
                    item.VolMA10 && VolArr.push(item.VolMA10);
                    maxVol = Math.max(...VolArr);
                });
                this.currentData = {
                    data: currentData,
                    minPrice,
                    maxPrice,
                    highPrice,
                    lowPrice,
                    maxVol,
                    maxMACD,
                    minMACD
                }
            },
            /**
             * data需要累加的数据
             * n累加次数
             * index累加结束的索引
             * name累加的变量
             */
            MACalculate(n, data, index, name){
                let arr = data.slice(index - (n - 1), index + 1);
                let result = 0;
                arr.map(item => {
                    result += item[name];
                })
                return result / n;
            },
            createKLineCanvas(){
                let { cellWidth, cellChart } = this;
                // this.can
            },
            setCanvasSize(canvas, width, height){
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, width, height);
                if(window.devicePixelRatio){
                    let devicePixelRatio = window.devicePixelRatio;
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                    canvas.width = width * devicePixelRatio;
                    canvas.height = height * devicePixelRatio;
                    ctx.scale(devicePixelRatio, devicePixelRatio);
                }
            },
            setKLineBgCanvas(){
                let width = document.body.clientWidth;
                let height = this.cellWidth * this.KLineCell[1];

                let KLineBgCanvas = document.getElementById('KLineBgCanvas');

                this.setCanvasSize(KLineBgCanvas, width, height);

                if(this.gridLineShow){
                    this.drawGridLine();
                }
            },
            drawGridLine(canvas, size, width, height){
                let ctx = canvas.getContext('2d');
                let { cellWidth } = this;

                ctx.clearRect(0, 0, width, height);
                ctx.translate(.5, .5);

                if(this.themeColor === 'black'){
                    ctx.strokeStyle = '#1E2E42';
                }
                if(this.themeColor === 'white'){
                    ctx.strokeStyle = '#E5EDF6';
                }
                ctx.lineWidth = 1;
                //画Y轴
                for(let i = 1; i < size[0]; i++){
                    ctx.beginPath();
                    ctx.moveTo(cellWidth * i, 0);
                    ctx.lineTo(cellWidth * i, height);
                    ctx.stroke();
                }
                //画X轴
                for(let i = 0; i < size[i]; i++){
                    ctx.beginPath();
                    ctx.moveTo(0, height - i * cellWidth);
                    ctx.lineTo(width, height - i * cellWidth);
                    ctx.stroke();
                }
            },
            selectResolution(value){
                this.additionalResolutionsShow = false;
                this.selectedResolution = value;
            },
            showAdditionalResolutions(){
                this.settingShow = false;
                this.additionalResolutionsShow = !this.additionalResolutionsShow;
            },
            selectSetting(){

            },
            showSetting(){
                this.additionalResolutionsShow = false;
                this.settingShow = !this.settingShow;
            }
        }
    }
</script>

<style scoped lang="scss">
#KLine{
    .toolbar{
        position: relative;
        color: #6d87a8;
        .resolution{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: .8rem;
            li{
                line-height: .8rem;
            }
            li.active{
                color: #ffffff;
                border-bottom: 1px solid #6d87a8;;
            }
        }
        .addition-resolution{
            position: absolute;
            display: flex;
            width: 100%;
            top: .8rem;
            justify-content: space-between;
            align-items: center;
            height: .8rem;
            &.bd-top{
                border-top: 1px solid #252b3b;
            }
            &.bd-bottom{
                border-bottom: 1px solid #252b3b;
            }
            li{
                line-height: .8rem;
            }
            li.active{
                color: #ffffff;
            }
        }
        .setting{
            position: absolute;
            width: 100%;
            top: .8rem;
            z-index: 111;
            .active{
                color: #ffffff;
            }
            ul{
                li{
                    display: flex;
                    &.bd-top{
                        border-top: 1px solid #252b3b;
                    }
                    &.bd-bottom{
                        border-bottom: 1px solid #252b3b;
                    }
                    p{
                        margin: .2rem;
                        width: 1.5rem;
                    }
                    .bd-right{
                        border-right: 1px solid #252b3b;
                    }
                    .left-auto{
                        text-align: right;
                    }
                    ul{
                        display: flex;
                    }
                }
            }
        }
    }
}
</style>
