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
               <canvas id="auxiliaryCanvas"></canvas>
               <div class="kline-chart">
<!--                    <canvas id="KLineCanvas"></canvas>-->
                   <canvas id="KLineBgCanvas"></canvas>
                   <canvas id="KLineCanvas"></canvas>
               </div>
               <div class="kline-MA">
                    <canvas id="MACanvas"></canvas>
               </div>
               <div class="KLine-volume">
                   <canvas id="volBgCanvas"></canvas>
                   <canvas id="volCanvas"></canvas>
               </div>
               <div class="kline-MACD">
                    <ul>
                        <li>MACD(12, 26, 9)</li>
                        <li>MACD: {{MACDValue}}</li>
                        <li>DIF: {{DIFValue}}</li>
                        <li>DEA: {{DEAValue}}</li>
                    </ul>
                   <canvas id="MACDBGCanvas"></canvas>
                   <canvas id="MACDCanvas"></canvas>
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
                cellWidth: 0, //单元格宽
                cellChart: [5, 5.5],
                currentData: { data: {} }, //当前数据

                red: '',
                green: '',

                auxiliaryCanvas: '', //辅助canvas
                auxiliaryCanvasWidth: '',
                auxiliaryCanvasHeight: '',

                KLineCanvas: '',
                KLineBgCanvas: '',
                KLineWidth: 0,
                KLineHeight: 0,
                KLineCell: [5, 3.5], //K线宽5格，高3.5格,
                cellKLineCount: 10,
                pricePoint: [],

                themeStyle: 'black',
                fs: 0, //html => font-size

                //vol
                volBgCanvas: '',
                volCanvas: '',
                volCell: [5, 1],
                volMA5Points: [],
                volMA10Points: [],
                volValue: '',
                volMA5: '',
                volMA10: '',

                //MACD
                MACDValue: 0,
                DIFValue: 0,
                DEAValue: 0,

                MA5Points: [],
                MA10Points: [],
                MA30Points: [],

                MACanvas: '',
                MA5: '',
                MA10: '',
                MA30: '',

                clickFlag: '',
                clickIndex: '',
            }
        },
        created(){
            //this.getBaseInfo();
            this.$nextTick(() => {
                this.init();
                //this.createKLineCanvas();
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
            setAuxiliaryCanvas(){
                let { cellWidth, cellChart } = this;
                this.auxiliaryCanvas = document.getElementById('auxiliaryCanvas');
                let width = cellWidth * cellChart[0];
                let height = cellWidth * cellChart[1];
                this.auxiliaryCanvasWidth = width;
                this.auxiliaryCanvasHeight = height;
                this.setCanvasSize(this.auxiliaryCanvas, width, height);
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

                this.KLineBgCanvas = document.getElementById('KLineBgCanvas');

                this.setCanvasSize(this.KLineBgCanvas, width, height);

                if(this.gridLineShow){
                    this.drawGridLine(this.KLineBgCanvas, this.KLineCell, width, height);
                }
            },
            //网格线
            drawGridLine(KLineBgCanvas, size, width, height){
                let ctx = KLineBgCanvas.getContext('2d');
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
            setKLineCanvas(){
                this.KLineCanvas = document.getElementById('KLineCanvas');
                this.setCanvasSize(this.KLineCanvas, this.KLineWidth, this.KLineHeight);

                this.drawMinute();

                this.drawKLine();

                this.drawClose();
            },
            //时分图
            drawMinute(){
                let ctx = this.KLineCanvas.getContext('2d');
                ctx.clearRect(0, 0, this.KLineWidth, this.KLineHeight);

                if(this.currentData.data.length < 1) return;;

                let { data, minPrice, maxPrice, lowPrice, highPrice } = this.currentData;

                let min = 0, max = 0;
                if(this.MAShow) {
                    min = minPrice;
                    max = maxPrice;
                }else{
                    min = lowPrice;
                    max = highPrice;
                }

                let { KLineWidth, KLineHeight, cellWidth } = this;
                data.map((item, i) => {
                    let point = this.priceToCoordinate(min, max, item.close, i, KLineWidth, KLineHeight, .5 * cellWidth);
                    this.pricePoint.push({
                        x: point[0],
                        y: point[1]
                    })
                })
            },
            //画K线
            drawKLine(){
                let { cellWidth } = this;
                let ctx = this.KLineCanvas.getContext('2d');

                let width = this.KLineWidth - this.KLineCell;
                let height = this.KLineHeight;
                let minPrice = 0, maxPrice = 0;
                if(this.MAShow){
                    minPrice = this.currentData.minPrice;
                    maxPrice = this.currentData.maxPrice;
                }else{
                    minPrice = this.currentData.lowPrice;
                    maxPrice = this.currentData.highPrice;
                }

                if(this.currentData.data.length < 1) return;

                let minFlag = true;
                let maxFlag = true;

                this.currentData.data.map((item, i) => {
                    let lowXY = this.priceToCoordinate(minPrice, maxPrice, item.low, i, width, height, .5 * cellWidth);
                    let highXY = this.priceToCoordinate(minPrice, maxPrice, item.high, i, width, height, .5 * cellWidth);

                    this.drawSingleKLine(item, i, minPrice, maxPrice)
                    if(item.low === this.currentData.lowPrice && minFlag){
                        minFlag = false;
                        this.drawFlagPrice(lowXY[0], lowXY[1], item.low, ctx);
                    }
                    if(item.high === this.currentData.highPrice && maxFlag){
                        maxFlag = false;
                        this.drawFlagPrice(highXY[0], highXY[1], item.high, ctx);
                    }
                })
            },
            //画一根K线
            drawSingleKLine(item, index, minPrice, maxPrice){
                let { cellWidth } = this;
                let ctx = this.KLineCanvas.getContext('2d');
                let width = this.KLineWidth - this.KLineCell;
                let height = this.KLineHeight;

                let lowXY = this.priceToCoordinate(minPrice, maxPrice, item.low, index, width, height, .5 * cellWidth);
                let highXY = this.priceToCoordinate(minPrice, maxPrice, item.high, index, width, height, .5 * cellWidth);
                let openXY = this.priceToCoordinate(minPrice, maxPrice, item.open, index, width, height, .5 * cellWidth);
                let closeXY = this.priceToCoordinate(minPrice, maxPrice, item.close, index, width, height, .5 * cellWidth);
                if(item.MA5){
                    let MA5XY = this.priceToCoordinate(minPrice, maxPrice, item.MA5, index, width, height, .5 * cellWidth);
                    this.MA5Points.push(MA5XY);
                }
                if(item.MA10){
                    let MA10XY = this.priceToCoordinate(minPrice, maxPrice, item.MA10, index, width, height, .5 * cellWidth);
                    this.MA10Points.push(MA10XY);
                }
                if(item.MA30){
                    let MA30XY = this.priceToCoordinate(minPrice, maxPrice, item.MA30, index, width, height, .5 * cellWidth);
                    this.MA30Points.push(MA30XY);
                }
                if(item.open > item.close){
                    ctx.strokeStyle = this.red;
                    ctx.fillStyle = this.red;
                }else{
                    ctx.strokeStyle = this.green;
                    ctx.fillStyle = this.green;
                }

                //画阴线跟阳线(最低价-最高价)
                ctx.beginPath();
                ctx.moveTo(lowXY[0], lowXY[1]);
                ctx.lineTo(highXY[0], highXY[1]);
                ctx.closePath();

                //画柱子(收盘价-开盘价)
                let y = openXY[1] < closeXY[1] ? openXY[1] : closeXY[1];
                let per = this.cellWidth / this.cellKLineCount;
                let h = Math.abs(openXY[1] - closeXY[1]) < 1 ? 1 : Math.abs(openXY[1] - closeXY[1]);
                ctx.fillRect(openXY[0] - (per - 2) / 2, y, per - 2, h);
                ctx.stroke();
            },
            /**
             * 价格转为坐标
             * minPrice 范围最小价格
             * maxPrice 范围最大价格
             * price 传入的价格
             * index 索引
             * width canvas宽度
             * height canvas高度
             * yStart y轴起点坐标
             */
            priceToCoordinate(minPrice, maxPrice, price, index, width, height, yStart){
                let length = this.currentData.data.length;
                let yPer = (height - yStart) / (maxPrice - minPrice);
                let Y = yPer * (maxPrice - price) + yStart;
                let minLength = this.cellKLineCount * 4;
                let X = ((index + 1)) * this.cellWidth / this.cellKLineCount;
                if(length < minLength){
                    X = ((minLength - length + index + 1) * this.cellWidth) / this.cellKLineCount;
                }
                return [X, Y];
            },
            //画最低价，最高价标识线
            drawFlagPrice(x, y, price, ctx){
                let width = this.KLineWidth;
                let fs = this.fs * .28;
                let end = x + 10;
                if(x > width / 2){
                    end = x - 10;
                    ctx.textAlign = 'right';
                }
                ctx.font = `${fs}px`;
                ctx.beginPath();
                if (this.themeStyle === "black") {
                    ctx.strokeStyle = "#CFD3E9";
                    ctx.fillStyle = "#CFD3E9";
                }
                if (this.themeStyle === "white") {
                    ctx.strokeStyle = "#262626";
                    ctx.fillStyle = "#262626";
                }
                ctx.moveTo(x, y - 1);
                ctx.lineTo(end, y - 1);
                ctx.closePath();

                ctx.fillText(price, end, y - 1);
                ctx.stroke();
            },
            //画收盘价
            drawClose(){
                if(this.currentData.data.length < 1) return;
                let ctx = this.auxiliaryCanvas.getContext('2d');
                let { data, minPrice, maxPrice, lowPrice, highPrice, history, cellWidth } = this.currentData;

                let min = 0, max = 0;
                if(this.MAShow){
                    min = minPrice;
                    max = maxPrice;
                }else {
                    min = lowPrice;
                    max = highPrice;
                }
                let index = data.length - 1;
                let price = history[history.length - 1].close;
                let _price = price;
                !!(price > max) && (_price = max);
                !!(price < min) && (_price = min);
                let width = this.KLineWidth;
                let height = this.KLineHeight;
                let fs = this.fs * .18;

                let xy = this.priceToCoordinate(min, max, price, index, width, height, cellWidth * .5);
                let x = parseFloat(xy[0].toFixed(2)),
                    y = parseFloat(xy[1].toFixed(2));

                ctx.textBaseline = 'middle';
                ctx.lineWidth = 1;
                ctx.font = `${fs}px`;

                if(x > width - cellWidth + 10){

                }else{
                    ctx.beginPath();
                    ctx.moveTo(x + 2, y);
                    ctx.lineTo(width - 40, y);
                    ctx.setLineDash([5]);
                    if (this.themeStyle === "black") {
                        ctx.strokeStyle = "#3F526C";
                    }
                    if (this.themeStyle === "white") {
                        ctx.strokeStyle = "#9EB5E1";
                    }
                    ctx.stroke();
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = "#1881D3";
                    ctx.fillText(price, width - 6, y);
                }
            },

            /**
             * MACanvas
             */
            setMACanvas(){
                this.MACanvas = document.getElementById('MACanvas');
                this.setCanvasSize(this.MACanvas, this.KLineWidth, this.KLineHeight);

                let { MACanvas, MA5Points, MA10Points, MA30Points } = this;
                this.drawBezier(MACanvas, MA5Points, '#FEC936');
                this.drawBezier(MACanvas, MA10Points, '#5AC2B4');
                this.drawBezier(MACanvas, MA30Points, '#C16EFF');

                this.getCurrentMA();
            },
            drawBezier(canvas, points, color){
                let ctx = canvas.getContext('2d');
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for(let i = 0; i < points.length; i++){
                    if(i < 1){
                        ctx.moveTo(points[i].x, points[i].y);
                    }else{
                        //注意是从1开始
                        let ctrlPoint = this.getCtrlPoint(points, i - 1);
                        ctx.bezierCurveTo(
                            ctrlPoint.pA.x,
                            ctrlPoint.pA.y,
                            ctrlPoint.pB.x,
                            ctrlPoint.pB.y,
                            points[i].x,
                            points[i].y
                        )
                    }
                }
                ctx.stroke();
            },
            getCtrlPoint(points, i, a, b){
                if(!a || !b){
                    a = 0.25;
                    b = 0.25;
                }
                let pAx, pAy, pBx, pBy;
                //处理两种极端情形
                if(i < 1){
                    pAx = points[0].x + (points[1].x - points[0].x) * a;
                    pAy = points[0].y + (points[1].y - points[0].x) * a;
                }else{
                    pAx = points[i].x + (points[i + 1].x - points[i - 1].x) * a;
                    pAy = points[i].y + (points[i + 1].y - points[i - 1].y) * a;
                }
                if(i > points.length - 3){
                    let last = points.length - 1;
                    pBx = points[last].x - (points[last].x - points[last - 1].x) * b;
                    pBy = points[last].y - (points[last].y - points[last - 1].y) * b;
                }else{
                    pBx = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
                    pBy = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
                }
                return {
                    pA: { x: pAx, y: pAy },
                    pB: { x: pBx, y: pBy }
                }
            },
            getCurrentMA(){
                let data = this.currentData.data;
                if(data.length < 1) return;
                let { history, digit } = this;
                let value;

                if(this.clickFlag){
                    let index = this.clickIndex;
                    value = data[index];
                }else{
                    let index = history.length - 1;
                    value = history[index];
                }

                if(value.MA5){
                    this.MA5 = value.MA5.toFixed(digit);
                }
                if(value.MA10){
                    this.MA10 = value.MA10.toFixed(digit);
                }
                if(value.MA30){
                    this.MA30 = value.MA30.toFixed(digit);
                }
            },

            /**
             * volCanvas
             */
            setvolBgCanvas(){
                let width = document.body.clientWidth,
                    height = this.cellWidth * this.volCell[1];

                this.volBgCanvas = document.getElementById('volBgCanvas')
                this.setCanvasSize(this.volBgCanvas, width, height);
                if(this.gridLineShow){
                    this.drawGridLine(this.volBgCanvas, this.volCell, width, height);
                }
            },
            setVolCanvas() {
                let width = document.body.clientWidth,
                    height = this.cellWidth * this.volCell[1];
                this.volCanvas = document.getElementById('volCanvas');
                this.setCanvasSize(this.volCanvas, width, height);
                this.drawVol(this.volCanvas, width, height);
            },
            //画成交量
            drawVol(canvas, width, height){
                if(this.currentData.data.length < 1) return;

                let { cellWidth } = this;
                let ctx = canvas.getContext('2d');
                let min = 0;
                let max = this.currentData.maxvol;
                this.currentData.data.map((item, i) => {
                    let volXY = this.priceToCoordinate(0, max, item.volume, i, width - cellWidth, height, 20);
                    if(item.MA5){
                        let MA5XY = this.priceToCoordinate(0, max, item.volMA5, i, width - cellWidth, height, 20);
                        this.volMA5Points.push({ x: MA5XY[0], y: MA5XY[1]})
                    }
                    if(item.MA10){
                        let MA10XY = this.priceToCoordinate(0, max, item.volMA10, i, width - cellWidth, height, 20);
                        this.volMA10Points.push({ x: MA10XY[0], y: MA10XY[1]})
                    }
                    if(item.open > item.close){
                        ctx.fillStyle = this.red;
                    }else{
                        ctx.fillStyle = this.green;
                    }
                    let per = cellWidth / this.cellKLineCount;
                    ctx.fillRect(volXY[0] - (per - 1) / 2, volXY[1], per - 2, height - volXY[1]);
                    ctx.stroke();
                })

                //成交量移动平均线
                this.drawBezier(this.volCanvas, this.volMA5Points, "#FEC936");
                this.drawBezier(this.volCanvas, this.volMA10Points, "#5AC2B4");
            },
            //当前成交量MA
            getCurrentVolMA(){
                if(this.currentData.data.length < 1) return;
                let { history, digit } = this;
                let value;

                if(this.clickFlag){
                    value = this.currentData.data[this.clickIndex];
                }else{
                    value = history[history.length - 1];
                }

                let vol = value.volume.toFixed(2);
                this.volValue = this.digitCalculation(vol, 1000);
                if(value.volMA5){
                    let MA5 = value.volMA5.toFixed(digit);
                    this.volMA5 = this.digitCalculation(MA5, 1000);
                }
                if(value.volMA10){
                    let MA10 = value.volMA10.toFixed(digit);
                    this.volMA10 = this.digitCalculation(MA10, 1000);
                }
            },
            //坐标转为价格
            coordinateToPrice(minPrice, maxPrice, price, height, start){
                let per = (height - start) / (maxPrice / minPrice);
                return ((height - price) / per + minPrice).toFixed(this.digit);
            },
            digitCalculation(value,count) {
                value = parseFloat(value);
                let result = value;
                if (value >= count) {
                    result = (Math.floor(value / 1000 * 10) / 10).toFixed(1);
                    result = `${result}K`
                } else if (value >= 1000000) {
                    result = parseInt(value / 1000000);
                    result = `${result}M`
                }
                return result;
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
                    item.volMA5 = this.MACalculate(5, history, i, 'volume');
                    item.MA10 = this.MACalculate(10, history, i, 'close');
                    item.volMA10 = this.MACalculate(10, history, i, 'volume');
                    item.MA30 = this.MACalculate(30, history, index, 'close');
                });
                let currentData = history.slice(this.startIndex, this.endIndex + 1);
                let minPrice = currentData[0].low,
                    maxPrice = currentData[0].high,
                    lowPrice = currentData[0].low,
                    highPrice = currentData[0].high,
                    maxvol = currentData[0].volume,
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

                    let volArr = [item.volume, maxvol];
                    item.volMA5 && volArr.push(item.volMA5);
                    item.volMA10 && volArr.push(item.volMA10);
                    maxvol = Math.max(...volArr);
                });
                this.currentData = {
                    data: currentData,
                    minPrice,
                    maxPrice,
                    highPrice,
                    lowPrice,
                    maxvol,
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
            },
            drawTime(canvas, granularity){
                let { cellWidth, fs } = this;
                let ctx = canvas.getContext('2d');

                if(this.themeStyle === 'black'){
                    ctx.fillStyle = '#6D87A8';
                }
                if(this.themeStyle === 'white'){
                    ctx.fillStyle = '#B6B6B6';
                }

                ctx.font = `${fs * 0.2}px`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                granularity = granularity * 1000;

                let data = this.currentData.data;

                for(let i = 0; i < 6; i++){

                }
            },
            crossIndex(clientX){
                let { currentData, } = this;
            }
        },

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
