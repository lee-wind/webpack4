<template>

    <div id="KLine" :class="{ 'high-light': themeStyle === 'white'}">
        <div class="toolbar">
            <ul class="resolution">
                <li v-for="([key, item]) in resolutions.entries()"
                    :class="resolution.value === item.value ? 'active' : ''"
                    @click="selectResolution(item)" :key="key">
                    {{item.name}}
                </li>
                <li :class="moreResolutionText !== '更多' ? 'active' : ''" @click="showOptionalResolutions">{{moreResolutionText}}</li>
                <li class="showSetting" @click="showSetting">设置</li>
            </ul>
            <ul class="addition-resolution bd-top" v-if="optionalResolutionsShow">
                <li v-for="([key, item]) in optionalResolutions.entries()"
                    :class="resolution.value === item.value ? 'active' : ''"
                    @click="selectResolution(item)" :key="key">
                    {{item.name}}
                </li>
            </ul>
            <div class="setting" v-if="settingShow">
                <ul>
                    <li class="bd-top">
                        <p class="bd-right">主图</p>
                        <p :class="{ active: MAShow }" @click="MAShow = true">MA<p/>
                        <p class="left-auto" :class="{ active: !MAShow }" @click="MAShow = false">关</p>
                    </li>
                    <li class="bd-top">
                        <p class="bd-right">副图</p>
                        <p :class="{ active: MACDShow }" @click="toggleMACD(true)">MACD<p/>
                        <p class="left-auto" :class="{ active: !MACDShow }" @click="toggleMACD(false)">关</p>
                    </li>
                    <li class="bd-top">
                        <p class="bd-right">界面</p>
                        <ul>
                            <li>
                                <p :class="{ active: themeStyle === 'black' }" @click="changeTheme('black')">暗色</p>
                            </li>
                            <li>
                                <p :class="{ active: themeStyle === 'white' }" @click="changeTheme('white')">亮色</p>
                            </li>
                        </ul>
                    </li>
                    <li class="bd-top">
                        <p class="bd-right">网格图</p>
                        <ul>
                            <li>
                                <p :class="{ active: !gridLineShow }" @click="toggleGridLine(false)">关闭</p>
                            </li>
                            <li>
                                <p :class="{ active: gridLineShow }" @click="toggleGridLine(true)">开启</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div id="charts"
             @click="clickKLine"
             @touchstart="touchstart"
             @touchmove="touchmove"
             @touchend="touchend">
            <div class="KLine-auxiliary">
                <ul v-show="clickFlag" class="click-data" :style="clickDataStyle">
                    <li>
                        <span>时间</span>
                        <span>{{clickData.time}}</span>
                    </li>
                    <li>
                        <span>开</span>
                        <span>{{clickData.open}}</span>
                    </li>
                    <li>
                        <span>高</span>
                        <span>{{clickData.high}}</span>
                    </li>
                    <li>
                        <span>收</span>
                        <span>{{clickData.close}}</span>
                    </li>
                    <li>
                        <span>低</span>
                        <span>{{clickData.low}}</span>
                    </li>
                    <li>
                        <span>涨跌额</span>
                        <span v-if="clickData.zde >= 0" :style="{color: green}">{{clickData.zde}}</span>
                        <span v-else :style="{color: red}">{{clickData.zde}}</span>
                    </li>
                    <li>
                        <span>涨跌幅</span>
                        <span v-if="clickData.zdf >= 0" :style="{color: green}">{{clickData.zdf}}</span>
                        <span v-else :style="{color: red}">{{clickData.zdf}}</span>
                    </li>
                    <li>
                        <span>成交量</span>
                        <span>{{clickData.volume}}</span>
                    </li>
                </ul>
                <div id="closeLevel" v-show="closeLevelShow">
                    <p class="close-value" @click.stop="clickClose">{{closeValue}}</p>
                </div>
                <canvas id="auxiliaryCanvas"></canvas>
            </div>

            <div id="KLine-chart">
                <canvas id="KLineBgCanvas"></canvas>
                <canvas id="KLineCanvas"></canvas>
            </div>
            <div class="KLine-MA" v-show="MAShow">
                <ul>
                    <li v-if="MA5">MA5: {{MA5}}</li>
                    <li v-if="MA10">MA10: {{MA10}}</li>
                    <li v-if="MA30">MA30: {{MA30}}</li>
                </ul>
                <canvas id="MACanvas"></canvas>
            </div>
            <div class="KLine-volume" :style="volStyle">
                <ul>
                    <li>VOL: {{volValue}}</li>
                    <li>MA5: {{volMA5}}</li>
                    <li>MA10: {{volMA10}}</li>
                </ul>
                <canvas id="volBgCanvas"></canvas>
                <canvas id="volCanvas"></canvas>
            </div>
            <div class="KLine-MACD" :style="MACDStyle">
                <ul>
                    <li>MACD(12, 26, 9)</li>
                    <li>MACD: {{MACDValue}}</li>
                    <li>DIF: {{DIFValue}}</li>
                    <li>DEA: {{DEAValue}}</li>
                </ul>
                <canvas id="MACDBgCanvas"></canvas>
                <canvas id="MACDCanvas"></canvas>
            </div>
            <div class="KLine-time" :style="timeStyle">
                <p v-show="clickFlag" id="clickTime" :style="clickTimeStyle">{{clickData.time}}</p>
                <canvas id="timeCanvas"></canvas>
            </div>
        </div>
    </div>

</template>

<script>
    import {hoursToSeconds, monthToMinute, yearToDate} from "../../../../util/date";

    export default {
        name: "KLine",
        props: {
            history: {
                default(){
                    return [];
                }
            },
            resolutions: {
                default(){
                    return [{
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
                    }]
                }
            },
            optionalResolutions: {
                default(){
                    return [{
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
                    }]
                }
            },
            resolution: {
                default(){
                    return {
                        name: '时分',
                        value: 60,
                    }
                }
            },
            newBar: {
                default(){
                    return {

                    }
                }
            }
        },
        data(){
            return {
                optionalResolutionsShow: false,
                settingShow: false,
                MAShow: true,
                MACDShow: true,
                gridLineShow: true,

                flag: true, //页面是否可绘制
                themeStyle: localStorage.getItem('themeStyle') || 'black',

                digit: 4,
                closeValue: '', //当前收盘价
                startIndex: 0, //显示数据在历史数据的开始索引
                endIndex: 0, //显示数据在历史数据的结束索引
                cellWidth: 0, //单元格宽
                cellChart: [5, 5.5],
                currentData: { data: {} }, //当前数据
                isDrawKLine: false,

                red: "#D14C64",
                green: "#03AD8F",

                auxiliaryCanvas: '', //辅助canvas
                auxiliaryCanvasWidth: '',
                auxiliaryCanvasHeight: '',

                KLineCanvas: '',
                KLineBgCanvas: '',
                KLineStyle: {},
                KLineCanvasWidth: 0,
                KLineCanvasHeight: 0,
                KLineWidth: '',
                KLineCell: [5, 3.5], //K线宽5格，高3.5格,
                cellKLineCount: 10,
                closePoints: [],
                closeLevelShow: false,   //显示收盘价水平线

                fs: 0, //html => font-size

                //MA
                MACanvas: '',
                MA5: 1,
                MA10: 1,
                MA30: 1,
                MA5Points: [],
                MA10Points: [],
                MA30Points: [],

                //vol
                volBgCanvas: '',
                volCanvas: '',
                volValue: '',
                volCell: [5, 1],
                volMA5Points: [],
                volMA10Points: [],
                volMA5: '',
                volMA10: '',
                volStyle: {},

                //MACD
                MACDValue: 0,
                DIFValue: 0,
                DEAValue: 0,
                MACDCell: [5, 1],
                DIFPoints: [],
                DEAPoints: [],
                MACDStyle: {},

                timeCanvas: '',
                timeStyle: {},

                clickFlag: false, //是否出现十字和价格图
                clickIndex: '',
                clickPoint: '',
                clickPrice: '',
                clickTimeStyle: {},
                clickData: {},
                clickDataStyle: {},

                startX: '',
                startTouch: '',
                isTouch: false,
                touchEvent: '',
                moveX: '',
                isPress: false,
            }
        },
        computed: {
            moreResolutionText(){
                for(let item of this.optionalResolutions){
                    if(item.name === this.resolution.name){
                        return item.name;
                    }
                }
                return '更多';
            }
        },
        created(){
            this.getBaseInfo();
        },
        mounted(){
            this.$nextTick(() => {
                this.fs = Number.parseFloat(document.querySelector('html').style.fontSize)
                this.init();
            })
        },
        methods: {
            getBaseInfo(){
                let length = this.history.length;
                this.closeValue = this.history[length - 1].close;
                let start = length - this.cellKLineCount * 4;
                this.startIndex = start > 0 ? start : 0;
                this.endIndex = length - 1;
                if(this.MACDShow){
                    this.KLineCell = [5, 3.5];
                }else{
                    this.KLineCell = [5, 4.5];
                }
                this.cellWidth = document.body.clientWidth / this.KLineCell[0];

                this.KLineWidth = this.cellWidth / this.cellKLineCount;
            },
            init(){
                if(this.flag) {
                    this.flag = false;
                    this.MA5Points = [];
                    this.MA10Points = [];
                    this.MA30Points = [];
                    this.volMA5Points = [];
                    this.volMA10Points = [];
                    this.DEAPoints = [];
                    this.DIFPoints = [];
                    this.closePoints = [];
                    this.currentData = {data: []};
                    this.KLineWidth = this.cellWidth / this.cellKLineCount;
                    this.red = this.themeStyle === 'white' ? '#F24750' : '#D14C64';
                    this.green = this.themeStyle === 'white' ? '#0BB260' : '#03AD8F';


                    this.getCurrentData();

                    this.setAuxiliaryCanvas();

                    this.setKLineBgCanvas();
                    this.setKLineCanvas();

                    this.setMACanvas();

                    this.setVolBgCanvas();
                    this.setVolCanvas();

                    this.setMACDBgCanvas();
                    this.setMACDCanvas();

                    this.setTimeCanvas();

                    if(this.clickFlag){
                        this.drawAuxiliaryInfo();
                    }
                    this.flag = true;
                }
            },
            //设置画布大小
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
            //贝塞尔2次曲线
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
            //得到控制点
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
            /**
             * 辅助的canvas
             */
            setAuxiliaryCanvas(){
                let { cellWidth, cellChart } = this;
                this.auxiliaryCanvas = document.getElementById('auxiliaryCanvas');
                let width = cellWidth * cellChart[0];
                let height = cellWidth * cellChart[1];
                this.auxiliaryCanvasWidth = width;
                this.auxiliaryCanvasHeight = height;
                this.setCanvasSize(this.auxiliaryCanvas, width, height);
            },
            /**
             * K线背景canvas
             */
            setKLineBgCanvas(){
                let width = document.body.clientWidth;
                let height = this.cellWidth * this.KLineCell[1];

                this.KLineCanvasWidth = width;
                this.KLineCanvasHeight = height;
                let KLineChart = document.getElementById('KLine-chart');
                KLineChart.style.width = `${width}px`;
                KLineChart.style.height = `${height}px`;
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

                if(this.themeStyle === 'black'){
                    ctx.strokeStyle = '#1E2E42';
                }
                if(this.themeStyle === 'white'){
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
                for(let i = 0; i < size[1]; i++){
                    ctx.beginPath();
                    ctx.moveTo(0, height - i * cellWidth);
                    ctx.lineTo(width, height - i * cellWidth);
                    ctx.stroke();
                }
            },
            /**
             * K线canvas
             */
            setKLineCanvas(){
                this.KLineCanvas = document.getElementById('KLineCanvas');
                this.setCanvasSize(this.KLineCanvas, this.KLineCanvasWidth, this.KLineCanvasHeight);
                if(this.resolution.name === '时分'){
                    this.drawMinute();
                }else{
                    this.drawKLine();
                }
                this.drawScale();

                this.drawClose();
            },
            //时分图
            drawMinute(){
                let ctx = this.KLineCanvas.getContext('2d');
                ctx.clearRect(0, 0, this.KLineCanvasWidth, this.KLineCanvasHeight);

                if(this.currentData.data.length < 1) return;

                let { data, minPrice, maxPrice, lowPrice, highPrice } = this.currentData;

                let min = 0, max = 0;
                if(this.MAShow) {
                    min = minPrice;
                    max = maxPrice;
                }else{
                    min = lowPrice;
                    max = highPrice;
                }

                let { KLineCanvasWidth, KLineCanvasHeight, cellWidth } = this;
                data.map((item, i) => {
                    let point = this.priceToCoordinate(min, max, item.close, i, KLineCanvasWidth, KLineCanvasHeight, .5 * cellWidth);
                    this.closePoints.push({
                        x: point[0],
                        y: point[1]
                    })
                })

                if(this.themeStyle === 'black'){
                    this.drawBezier(this.KLineCanvas, this.closePoints, '#4A90E2');
                }
                if(this.themeStyle === 'white'){
                    this.drawBezier(this.KLineCanvas, this.closePoints, '#A8B4CB');
                }
            },
            //画K线
            drawKLine(){
                let { cellWidth } = this;
                let ctx = this.KLineCanvas.getContext('2d');

                let width = this.KLineCanvasWidth - this.KLineCell;
                let height = this.KLineCanvasHeight;
                let minPrice = 0, maxPrice = 0;
                if(this.MAShow){
                    minPrice = this.currentData.minPrice;
                    maxPrice = this.currentData.maxPrice;
                }else{
                    minPrice = this.currentData.lowPrice;
                    maxPrice = this.currentData.highPrice;
                }

                if(this.currentData.data.length < 1) return;

                this.isDrawKLine = true;
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
                });
                this.isDrawKLine = false;
            },
            //画一根K线
            drawSingleKLine(item, index, minPrice, maxPrice){
                if(!this.isDrawKLine) return;

                let { cellWidth } = this;
                let ctx = this.KLineCanvas.getContext('2d');
                let width = this.KLineCanvasWidth - this.KLineCell;
                let height = this.KLineCanvasHeight;

                let lowXY = this.priceToCoordinate(minPrice, maxPrice, item.low, index, width, height, .5 * cellWidth);
                let highXY = this.priceToCoordinate(minPrice, maxPrice, item.high, index, width, height, .5 * cellWidth);
                let openXY = this.priceToCoordinate(minPrice, maxPrice, item.open, index, width, height, .5 * cellWidth);
                let closeXY = this.priceToCoordinate(minPrice, maxPrice, item.close, index, width, height, .5 * cellWidth);
                if(item.MA5){
                    let MA5XY = this.priceToCoordinate(minPrice, maxPrice, item.MA5, index, width, height, .5 * cellWidth);
                    this.MA5Points.push({ x: MA5XY[0], y: MA5XY[1]});
                }
                if(item.MA10){
                    let MA10XY = this.priceToCoordinate(minPrice, maxPrice, item.MA10, index, width, height, .5 * cellWidth);
                    this.MA10Points.push({ x: MA10XY[0], y: MA10XY[1]});
                }
                if(item.MA30){
                    let MA30XY = this.priceToCoordinate(minPrice, maxPrice, item.MA30, index, width, height, .5 * cellWidth);
                    this.MA30Points.push({ x: MA30XY[0], y: MA30XY[1]});
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
            //画最低价，最高价标识线
            drawFlagPrice(x, y, price, ctx){
                let width = this.KLineCanvasWidth;
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
                let ctx = this.KLineCanvas.getContext('2d');
                let { data, minPrice, maxPrice, lowPrice, highPrice } = this.currentData;
                let { cellWidth, history } = this;
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
                let width = this.KLineCanvasWidth;
                let height = this.KLineCanvasHeight;
                let fs = this.fs * .18;

                let xy = this.priceToCoordinate(min, max, _price, index, width, height, cellWidth * .5);
                let x = parseFloat(xy[0].toFixed(2)),
                    y = parseFloat(xy[1].toFixed(2));

                ctx.textBaseline = 'middle';
                ctx.lineWidth = 1;
                ctx.font = `${fs}px`;

                if(x > width - cellWidth + 10){
                    this.closeLevelShow = true;
                    document.getElementById('closeLevel').style.top = `${y + 1}px`
                }else{
                    this.closeLevelShow = false;
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
            //刻度线
            drawScale(){
                let ctx = this.KLineCanvas.getContext('2d');
                ctx.beginPath();
                ctx.textBaseline = 'bottom';
                let fs = this.fs * .2;
                ctx.font = `${fs}px`;

                if(this.themeStyle === 'black'){
                    ctx.fillStyle = "#6D87A8";
                }
                if(this.themeStyle === "white"){
                    ctx.fillStyle = "#B6B6B6";
                }

                ctx.textAlign = 'right';

                let { minPrice, maxPrice, highPrice, lowPrice } = this.currentData;
                let min = 0,
                    max = 0;
                if(this.MAShow){
                    min = minPrice;
                    max = maxPrice;
                }else{
                    min = lowPrice;
                    max = highPrice;
                }
                let height = this.KLineCanvasHeight;
                let priceDiff = max - min;
                let count = Number.parseInt(this.KLineCell[1]);
                let cellPrice = priceDiff / count;
                let cellHeight = (height - .5 * this.cellWidth) / count;
                for(let i = 0; i <= count; i++){
                    let price = (min + cellPrice * i).toFixed(this.digit);
                    ctx.fillText(price, this.KLineCanvasWidth - 6,
                        cellHeight * (count - i) + .5 * this.cellWidth);
                }
                ctx.closePath();
            },

            /**
             * MACanvas
             */
            setMACanvas(){
                this.MACanvas = document.getElementById('MACanvas');
                this.setCanvasSize(this.MACanvas, this.KLineCanvasWidth, this.KLineCanvasHeight);

                let { MACanvas, MA5Points, MA10Points, MA30Points } = this;
                this.drawBezier(MACanvas, MA5Points, '#FEC936');
                this.drawBezier(MACanvas, MA10Points, '#5AC2B4');
                this.drawBezier(MACanvas, MA30Points, '#C16EFF');

                this.getCurrentMA();
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
            setVolBgCanvas(){
                let width = document.body.clientWidth,
                    height = this.cellWidth * this.volCell[1];

                this.volStyle = {
                    width: `${width}px`,
                    height: `${height}px`
                };

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
                //let min = 0;
                let max = this.currentData.maxVol;
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

                this.getCurrentVolMA();
            },
            //当前成交量MA
            getCurrentVolMA(){
                if( this.currentData.data.length < 1 ) return;
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
            /**
             *  MACD
             */
            setMACDBgCanvas(){
                if(!this.MACDShow) return;
                let width = document.body.clientWidth,
                    height = this.cellWidth * this.MACDCell[1],
                    MACDBgCanvas = document.getElementById('MACDBgCanvas');

                this.MACDStyle = {
                    width: `${width}px`,
                    height: `${height}px`
                }

                this.setCanvasSize(MACDBgCanvas, width, height);
                if(this.gridLineShow){
                    this.drawGridLine(MACDBgCanvas, this.MACDCell, width, height);
                }
            },
            setMACDCanvas(){
                if(!this.MACDShow) return;
                let width = document.body.clientWidth,
                    height = this.cellWidth * this.MACDCell[1];

                this.MACDCanvas = document.getElementById('MACDCanvas');

                this.setCanvasSize(this.MACDCanvas, width, height);

                this.getCurrentMACD();
                this.drawMACD();
                this.drawDIF();
                this.drawDEA();
            },
            getCurrentMACD(){
                if(this.currentData.data.length < 1) return;
                if(!this.MACDShow) return;
                let { history } = this;
                let value;
                if(this.clickFlag){
                    value = this.currentData.data[this.clickIndex];
                }else{
                    value = history[history.length - 1];
                }
                this.MACDValue = value.MACD;
                this.DIF = value.DIF;
                this.DEAValue = value.DEA;
            },
            drawMACD(){
                this.currentData.data.map((item, i) => {
                    this.drawSingleMACD(item, i);
                    this.getMACDPoints(item, i);
                })
            },
            drawSingleMACD(item, index){
                let ctx = this.MACDCanvas.getContext('2d');
                let width = this.KLineCanvasWidth - this.KLineCell;
                let height = this.cellWidth;
                let min = this.currentData.minMACD;
                let max = this.currentData.maxMACD;

                let XY = this.priceToCoordinate(min, max, item.MACD, index, width, height, 20);
                let Y = this.priceToCoordinate(min, max, 0, 1, width, height, 20)[1];

                if(item.MACD < 0){
                    ctx.strokeStyle = this.red;
                }else{
                    ctx.strokeStyle = this.green;
                }

                ctx.beginPath();
                ctx.moveTo(XY[0], Y);
                ctx.lineTo(XY[0], XY[1]);
                ctx.closePath();
                ctx.stroke();
            },
            getMACDPoints(item, index){
                let width = this.KLineCanvasWidth - this.KLineCell;
                let height = this.cellWidth;
                let min = this.currentData.minMACD;
                let max = this.currentData.maxMACD;

                let DIFXY = this.priceToCoordinate(min, max, item.DIF, index, width, height, 20);
                this.DIFPoints.push({x: DIFXY[0], y: DIFXY[1]});

                let DEAXY = this.priceToCoordinate(min, max, item.DEA, index, width, height, 20);
                this.DEAPoints.push({x: DEAXY[0], y: DEAXY[1]});
            },
            drawDIF(){
                this.drawBezier(this.MACDCanvas, this.DIFPoints, "#FEC936");
            },
            drawDEA(){
                this.drawBezier(this.MACDCanvas, this.DEAPoints, "#5AC2B4");
            },

            /**
             * Time
             */
            setTimeCanvas(){
                let width = document.body.clientWidth;
                let height = this.fs * .3;

                this.timeStyle = {
                    width: `${width}px`,
                    height: `${height}px`
                }

                this.timeCanvas = document.getElementById('timeCanvas');
                this.setCanvasSize(this.timeCanvas, width, height);
                let resolution = this.resolution.value === 0 ? 60 : this.resolution.value;
                this.drawTime(this.timeCanvas, resolution);
            },
            drawTime(canvas, granularity){
                let { cellWidth, fs } = this;
                let ctx = canvas.getContext('2d');
                if(this.themeStyle === 'black'){
                    ctx.fillStyle = "#6D87A8";
                }else{
                    ctx.fillStyle = "#B6B6B6";
                }
                ctx.font = `${fs * .2}px`;
                granularity = granularity * 1000;

                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                let data = this.currentData.data;
                let flag;
                for(let i = 0; i < 6; i++){
                    let index = this.getClickIndex(cellWidth * i);
                    if(flag === index) return;
                    if(index >= 0 && index < data.length){
                        let cellTime = new Date(data[index].time).getTime();
                        if(granularity > 60 * 1000 && granularity < 86400 * 1000){
                            cellTime = monthToMinute(cellTime);
                        }
                        if(granularity <= 60 * 1000){
                            cellTime = hoursToSeconds(cellTime);
                        }
                        if(granularity >= 86400 * 1000){
                            cellTime = yearToDate(cellTime);
                        }
                        ctx.fillText(cellTime, cellWidth * i, 2);
                    }
                    flag = index;
                }
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
                    item.MA30 = this.MACalculate(30, history, i, 'close');
                });
                let currentData = history.slice(this.startIndex, this.endIndex + 1);
                let minPrice = currentData[0].low,
                    maxPrice = currentData[0].high,
                    lowPrice = currentData[0].low,
                    highPrice = currentData[0].high,
                    maxVol = currentData[0].volume,
                    maxMACD = 0,
                    minMACD = 0;
                currentData.map(item => {
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

                    let volArr = [item.volume, maxVol];
                    item.volMA5 && volArr.push(item.volMA5);
                    item.volMA10 && volArr.push(item.volMA10);
                    maxVol = Math.max(...volArr);
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
            selectResolution(item){
                this.optionalResolutionsShow = false;
                console.log('选择周期');
                this.$emit('updateResolution', item);
            },
            showOptionalResolutions(){
                this.settingShow = false;
                this.optionalResolutionsShow = !this.optionalResolutionsShow;
            },
            showSetting(){
                this.optionalResolutionsShow = false;
                this.settingShow = !this.settingShow;
            },
            clickClose(){
                let start = this.history.length - this.cellKLineCount * 4;
                this.startIndex = start > 0 ? start : 0;
                this.endIndex = this.history.length - 1;
                this.init();
            },
            changeTheme(color){
                this.themeStyle = color;
                localStorage.setItem('themeStyle', color);
                this.init();
            },
            toggleMACD(boolean){
                if(this.MACDShow !== boolean){
                    this.MACDShow = boolean;
                    this.KLineCell = boolean ? [5, 3.5] : [5, 4.5]
                    if(this.flag){
                        this.flag = false;
                        this.MA5Points = [];
                        this.MA10Points = [];
                        this.MA30Points = [];
                        this.setKLineBgCanvas();
                        this.setKLineCanvas();
                        if(this.MACDShow){
                            this.setMACDBgCanvas();
                            this.setMACDCanvas();
                        }
                        this.flag = true;
                    }
                }

            },
            toggleGridLine(boolean){
                this.gridLineShow = boolean;
                this.setKLineBgCanvas();
                this.setVolBgCanvas();
                this.setMACDBgCanvas();
            },

            clickKLine(e){
                console.log('点击K线')
                this.settingShow = false;
                this.optionalResolutionsShow = false;
                let clientX = e.clientX;
                let clientY = e.clientY;
                this.crossByPoint(clientX, clientY);
            },
            crossByPoint(clientX, clientY, isClose){
                let { cellWidth, KLineCanvasWidth, KLineCanvasHeight } = this;
                clientY = clientY - document.getElementById('charts').getBoundingClientRect().y;
                if(clientY < .5 * cellWidth || clientY > KLineCanvasHeight){
                    this.clickFlag = false;
                    this.clearAuxiliaryCanvas();
                }else{
                    this.clickFlag = true;
                    //计算十字架对应的索引
                    this.clickIndex = this.getClickIndex(clientX);
                    if(isClose){
                        this.clickPrice = this.currentData.data[this.clickIndex].close;
                        let min = this.currentData.lowPrice,
                            max = this.currentData.highPrice;
                        if(this.MAShow){
                            min = this.currentData.minPrice;
                            max = this.currentData.maxPrice;
                        }
                        this.clickPoint = this.priceToCoordinate(min, max, this.clickPrice, this.clickIndex,
                            KLineCanvasWidth, KLineCanvasHeight, cellWidth * .5);
                    }else{
                        this.clickPrice = this.getClickPrice(clientY);
                        this.clickPoint = this.getClickPoint(this.clickIndex, clientY);
                    }
                }

                this.drawAuxiliaryInfo();
            },
            clearAuxiliaryCanvas(){
                let { auxiliaryCanvas, auxiliaryCanvasWidth, auxiliaryCanvasHeight } = this;
                let ctx = auxiliaryCanvas.getContext('2d');
                ctx.clearRect(0, 0, auxiliaryCanvasWidth, auxiliaryCanvasHeight);
            },
            getClickIndex(clientX){
                let { currentData } = this;
                let per = this.cellWidth / this.cellKLineCount;
                let index = Math.ceil(clientX / per) - 1;
                index = index < 0 ? 0 : index;
                index = index > currentData.data.length - 1 ? currentData.data.length - 1 : index;
                return index;
            },
            getClickPrice(clientY){
                let { currentData, MAShow, cellWidth, KLineCanvasHeight } = this;
                let min = currentData.lowPrice;
                let max = currentData.highPrice;
                if(MAShow){
                    min = currentData.minPrice;
                    max = currentData.maxPrice;
                }
                return this.coordinateToPrice(min, max, clientY, KLineCanvasHeight, cellWidth * .5);
            },
            //坐标转为价格
            coordinateToPrice(minPrice, maxPrice, clientY, height, start){
                let per = (height - start) / (maxPrice - minPrice);
                return ((height - clientY) / per + minPrice).toFixed(this.digit);
            },
            getClickPoint(index, clientY){
                let { cellWidth, cellKLineCount, currentData } = this;
                let per = cellWidth / cellKLineCount;
                let X = (index + 1) * per;
                let length = currentData.length;
                let minLength = cellKLineCount * 4;
                if(length < minLength){
                    X = (minLength - length + index +1) * per;
                }
                return [X, clientY];
            },
            drawAuxiliaryInfo(){
                this.clearAuxiliaryCanvas();
                this.getCurrentMA();
                this.getCurrentVolMA();
                this.getCurrentMACD();

                this.drawClose();
                this.drawVerticalLine();
                this.drawOrigin();
                this.drawHorizontalLine();

                this.getClickData();
            },
            drawVerticalLine(){
                let x = this.clickPoint[0];
                let { auxiliaryCanvasHeight } = this;
                let ctx = this.auxiliaryCanvas.getContext('2d');
                let per = this.cellWidth / this.cellKLineCount;
                if(this.themeStyle === 'black'){
                    ctx.fillStyle = 'rgba(255, 255, 255, .1)';
                }
                if(this.themeStyle === 'white'){
                    ctx.fillStyle = 'rgba(0, 71, 204, .1)';
                }
                ctx.fillRect(x - (per - 2) / 2, 0, per - 2, auxiliaryCanvasHeight);
                ctx.stroke();
                let width = document.getElementById('clickTime').offsetWidth;
                console.log(width);
                let left = x - width / 2;
                this.clickTimeStyle = {
                    left: `${left}px`
                }
            },
            drawOrigin(){
                let x = this.clickPoint[0];
                let y = this.clickPoint[1];
                let ctx = this.auxiliaryCanvas.getContext('2d');
                ctx.beginPath();
                if(this.themeStyle === 'black'){
                    ctx.fillStyle = '#FFFFFF';
                }
                if(this.themeStyle === 'white'){
                    ctx.fillStyle = '#262626';
                }
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
            },
            drawHorizontalLine(){
                let x = this.clickPoint[0];
                let y = this.clickPoint[1];
                let width = this.auxiliaryCanvasWidth;
                let fs = this.fs * .18;
                let { clickPrice } = this;
                let ctx = this.auxiliaryCanvas.getContext('2d');
                ctx.setLineDash([]);
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.lineWidth = 1;
                if(this.themeStyle === 'black'){
                    ctx.strokeStyle = 'rgba(255, 255, 255, .3)';
                }
                if(this.themeStyle === 'white'){
                    ctx.strokeStyle = 'rgba(0, 71, 204, .3)';
                }
                ctx.stroke();
                ctx.beginPath();
                let fontWidth = ctx.measureText(clickPrice).width + 10;
                ctx.setLineDash([]);
                if(x >= width / 2){
                    ctx.moveTo(width - fontWidth - 6, y);
                    ctx.lineTo(width - fontWidth, y - 8);
                    ctx.lineTo(width - 1, y - 8);
                    ctx.lineTo(width - 1, y + 8);
                    ctx.lineTo(width - fontWidth, y + 8);
                    ctx.lineTo(width - fontWidth - 6, y);
                }else{
                    ctx.moveTo(fontWidth + 7, y);
                    ctx.lineTo(fontWidth, y - 8);
                    ctx.lineTo(1, y - 8);
                    ctx.lineTo(1, y + 8);
                    ctx.lineTo(fontWidth, y + 8);
                    ctx.lineTo(fontWidth + 7, y);
                }
                if(this.themeStyle === 'black'){
                    ctx.strokeStyle = 'rgba(255, 255, 255, .3)';
                    ctx.fillStyle = '#000000';
                }
                if(this.themeStyle === 'white'){
                    ctx.strokeStyle = '#262626';
                    ctx.fillStyle = '#FFFFFF';
                }
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.font = `${fs}px`;
                ctx.textBaseline = 'middle';

                console.log(clickPrice);

                if(this.themeStyle === 'black'){
                    ctx.fillStyle = '#FFFFFF';
                }
                if(this.themeStyle === 'white'){
                    ctx.fillStyle = '#262626';
                }
                if(x >= width / 2){
                    ctx.textAlign = 'right';
                    ctx.fillText(clickPrice, width - 5, y);
                }else{
                    ctx.textAlign = 'left';
                    ctx.fillText(clickPrice, 5, y);
                }
            },
            getClickData(){
                let data = this.currentData.data[this.clickIndex];
                let { resolution, auxiliaryCanvasWidth } = this;
                let time = new Date(data.time).getTime();
                if(resolution.value > 60 && resolution.value < 86400){
                    time = monthToMinute(time);
                }
                if(resolution.value <= 60){
                    time = hoursToSeconds(time);
                }
                if(resolution.value >= 86400){
                    time = yearToDate(time);
                }
                let x = this.clickPoint[0];
                if(x >= auxiliaryCanvasWidth / 2){
                    this.clickDataStyle = {
                        left: '.12rem'
                    }
                }else{
                    this.clickDataStyle = {
                        right: '.12rem'
                    }
                }
                let zde, zdf;
                if(data.close && data.open){
                    let dig = 2;
                    if(data.open.toString().split('.')[1]
                        && data.close.toString().split('.')[1]){
                        dig = Math.max(data.open.toString().split('.')[1].length,
                            data.close.toString().split('.')[1].length) + 1;
                    }
                    zde = Number((data.close - data.open).toFixed(dig));
                    zdf = ((data.close - data.open) / data.open * 100).toFixed(2);
                    if(zde > 0){
                        zde = `+${zde}`;
                        zdf = `+${zdf}%`
                    }else{
                        zdf = `${zdf}%`
                    }
                }
                console.log(time);
                this.clickData = {
                    time: time,
                    open: data.open,
                    high: data.high,
                    close: data.close,
                    low: data.low,
                    volume: this.digitCalculation(data.volume, 1000),
                    zdf: zdf,
                    zde: zde
                }
            },
            touchstart(e){
                console.log('触摸K线');
                this.startX = e.touches[0].clientX;
                this.startTouch = e.touches;
                this.isTouch = true;
                if(e.touches.length === 1){
                    this.touchEvent = setTimeout(() => {
                        this.isPress = true;
                        this.crossByPoint(e.touches[0].clientX, e.touches[0].clientY, true);
                    }, 1000);
                    let index = this.getClickIndex(e.touches[0].clientX);
                    if(Math.abs(this.clickIndex - index) < 2){
                        this.isPress = true;
                    }
                    console.log(this.isPress);
                }
            },
            touchend(e){
                this.isTouch = false;
                this.isPress = false;
                clearTimeout(this.touchEvent)
            },
            touchmove(e){
                //console.log('移动K线');
                this.clickFlag = false;
                clearTimeout(this.touchEvent);

                let { cellKLineCount, startTouch } = this;
                let count = 0;
                let move = true;
                let direction = this.getDirection(startTouch[0], e.touches[0]);
                console.log(direction);
                if(direction === 3 && direction === 4){
                    move = true;
                }
                if(this.isTouch && e.touches.length === 1
                    && !this.isPress && move){


                    e.preventDefault();
                    this.isTouch = false;
                    let length = this.history.length;
                    if(length <= cellKLineCount * 4){
                        return false;
                    }
                    //滑动时距离浏览器左侧的距离
                    this.moveX = e.touches[0].clientX;
                    //实时的滑动的距离-起始位置=实时移动的位置
                    let diffX = this.moveX - this.startX;
                    let per = this.cellWidth / this.cellKLineCount;
                    count = diffX / per;
                    if(count > 0 && count < 1){
                        count = 1;
                    }else if(count < 0 && count > -1){
                        count = -1;
                    }else{
                        count = Number.parseInt(count);
                    }
                    this.startX = this.moveX;
                    this.handleIndex(count);
                    this.init();
                    this.isTouch = true;
                }
                console.log(this.isPress);
                if(this.isPress && e.touches.length === 1){
                    e.preventDefault();
                    console.log(2222)
                    this.crossByPoint(e.touches[0].clientX, e.touches[0].clientY, true);
                }
                if(e.touches.length > 1){
                    console.log(3333)
                    e.preventDefault();
                    let nowTouch = e.touches;
                    let scale = this.getDistance(nowTouch[0], nowTouch[1])
                        / this.getDistance(startTouch[0], startTouch[1]);

                    this.cellKLineCount = Number.parseFloat(this.cellKLineCount / scale)
                        .toFixed(1);
                    this.cellKLineCount = this.cellKLineCount > 28
                        ? 28 : this.cellKLineCount;
                    this.cellKLineCount = this.cellKLineCount < 4
                        ? 4 : this.cellKLineCount;

                    this.startTouch = e.touches;
                    let disX = this.getDistance(startTouch[0], startTouch[1])
                        / this.getDistance(nowTouch[0], nowTouch[1]);
                    let per = this.cellWidth / this.cellKLineCount;

                    count = Number.parseInt(disX / per);

                    this.handleIndex(count);
                    this.init();
                }
            },
            //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
            getDirection(touchstart, touchend){
                let result = -1;
                let x = touchend.clientX - touchstart.clientX;
                let y = touchend.clientY - touchstart.clientY;
                let angle = (Math.atan2(x, y) * 180) / Math.PI;
                if(Math.abs(x) < 2 && Math.abs(y) < 2){
                    result = 0;
                }
                if(angle >= -135 && angle <= -45){
                    result = 1;
                }else if(angle > 45 && angle < 135){
                    result = 2;
                }else if((angle >= 135 && angle <= 180)
                    || (angle >= -180 && angle < -135)){
                    result = 3;
                }else if(angle >= -45 && angle <= 45){
                    result = 4;
                }
                return result;
            },
            //计算开始索引和结束索引
            handleIndex(count){
                let length = this.history.length;
                let start = this.startIndex - count;
                this.startIndex = start > 0 ? start : 0;
                this.endIndex = this.startIndex > 0
                    ? this.startIndex + this.cellKLineCount * 5 - 1
                    : this.cellKLineCount * 5 - 1;
                if(this.endIndex > length - 1){
                    this.endIndex = length - 1;
                }
                if(this.endIndex - this.startIndex < this.cellKLineCount * 5 -1){
                    this.endIndex = length - 1;
                }
                if(this.endIndex >= length - 1
                    && this.endIndex - this.startIndex <= this.cellKLineCount *4 - 1){
                    this.startIndex = length - this.cellKLineCount * 4;
                }
            },
            //缩放 勾股定理方法
            getDistance(endPoint, startPoint){
                let x = endPoint.pageX - startPoint.pageX,
                    y = endPoint.pageY - startPoint.pageY;
                return Math.sqrt(x * x + y * y);
            }
        },
        watch: {
            newBar(newData){
                if(!this.flag) return;
                let { history } = this;
                let lastTime = history[history.length - 1].time;
                let newTime = newData.time;

                if(lastTime === newTime){
                    this.closeValue = newData.close;
                    this.$set(this.history, history.length - 1, newData);
                    this.init();
                }
                if(lastTime < newTime) {
                    if(this.endIndex === history.length - 1){
                        this.endIndex++;
                        this.startIndex++;
                    }
                    this.closeValue = newData.close;
                    this.history.push(newData);
                    this.init();
                }
            }
        }
    }
</script>

<style lang="scss">
    #KLine{
        .toolbar{
            position: relative;
            color: #6d87a8;
            border-top: 1px solid #252b3b;
            background-color: #131f30;
            z-index: 666;
            font-size: .24rem;
            .resolution{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: .8rem;
                li{
                    padding: 0 .2rem;
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
                background-color: #131f30;
                /*border-top: 1px solid #252b3b;*/
                &.bd-top{
                    border-top: 1px solid #252b3b;
                }
                &.bd-bottom{
                    border-bottom: 1px solid #252b3b;
                }
                li{
                    padding:0 .2rem;
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
                background-color: #131f30;
                border-bottom: 1px solid #252b3b;
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
        #charts {
            position: relative;
            $canvasBg: linear-gradient(180deg, #111c2b 0%, #152439 100%);
            .KLine-auxiliary, #KLine-chart, .KLine-volume, .KLine-MACD, .KLine-time {
                position: relative;
                //height: 1rem;
                canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }

            .KLine-auxiliary {
                z-index: 444;
                ul {
                    position: absolute;
                    width: 2.62rem;
                    background-color: #0c0f16;
                    color: #f3f3f3;
                    border: 1px solid #252b3b;
                    font-size: 0.18rem;
                    padding: .1rem;
                    z-index: 333;
                    top: .9rem;
                    li {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: .1rem;

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                }
                #closeLevel{
                    z-index: 333;
                    position: absolute;
                    width: 100%;
                    &:before{
                        position: absolute;
                        display: block;
                        content: '';
                        width: 100%;
                        height: 1px;
                        border-top: 1px dashed #4170C8;
                    }
                    .close-value{
                        position: absolute;
                        height: .32rem;
                        border-radius: .16rem;
                        line-height: .32rem;
                        padding: 0 0.24rem 0 0.12rem;
                        font-size: .18rem;
                        border: 1px solid #5a6375;
                        background-color: #000;
                        color: #1881D3;
                        right: .96rem;
                        top: -.16rem;
                        &:before {
                            content: "";
                            position: absolute;
                            width: 0;
                            height: 0;
                            border-width: 0.06rem;
                            border-style: solid;
                            border-color: transparent transparent transparent #CFD3E9;
                            right: 0.06rem;
                            top: 50%;
                            margin-top: -0.06rem;
                        }
                    }
                }
            }
            #KLine-chart{
                #KLineBgCanvas{
                    background: $canvasBg;
                }
            }
            .KLine-MA, .KLine-volume, .KLine-MACD {
                ul {
                    display: flex;
                    position: absolute;
                    top: 0.1rem;
                    left: 0.12rem;
                    font-size: 0.18rem;

                    li {
                        margin-right: .4rem;
                    }
                }
            }

            .KLine-MA {
                position: absolute;
                top: 0;
                left: 0;

                ul {
                    li:nth-child(1) {
                        color: #FEC936;
                    }

                    li:nth-child(2) {
                        color: #5AC2B4;
                    }

                    li:nth-child(3) {
                        color: #C16EFF;
                    }
                }
            }

            .KLine-volume {
                ul {
                    position: relative;
                    z-index: 222;
                    li:nth-child(1) {
                        color: #C16EFF;
                    }

                    li:nth-child(2) {
                        color: #FEC936;
                    }

                    li:nth-child(3) {
                        color: #5AC2B4;
                    }
                }
                #volBgCanvas{
                    background: $canvasBg
                }
            }

            .KLine-MACD {
                ul {
                    position: relative;
                    z-index: 222;
                    li:nth-child(1) {
                        color: #6B84A5;
                    }

                    li:nth-child(2) {
                        color: #8135FF;
                    }

                    li:nth-child(3) {
                        color: #FEC936;
                    }

                    li:nth-child(4) {
                        color: #5AC2B4;
                    }
                }
                #MACDBgCanvas{
                    background: $canvasBg;
                }
            }
            .KLine-time{
                #clickTime{
                    position: absolute;
                    top: 0;
                    font-size: 0.2rem;
                    padding: 0 0.08rem;
                    z-index: 20;
                    color: #fff;
                    background-color: #000;
                    border: 1px solid #5a6375;
                }
                #timeCanvas{
                    background: $canvasBg;
                }
            }
        }

        &.high-light{
            .toolbar{
                color: #8195ad;
                border-top: 1px solid #f3f3f3;
                background-color: #fff;
                .resolution{
                    li.active{
                        color: #262626;
                        border-bottom: 1px solid #262626;
                    }
                }
                .addition-resolution{
                    border-top: 1px solid #f3f3f3;
                    background-color: #fff;
                }
                .setting{
                    background-color: #ffffff;
                    border-bottom: 1px solid #f3f3f3;
                    li.bd-top{
                        border-top: 1px solid #f3f3f3;
                    }
                    li.bd-bottom{
                        border-bottom: 1px solid #f3f3f3;
                    }
                    .active{
                        color: #262626;
                    }
                    .bd-right{
                        border-right: 1px solid #f3f3f3;
                    }
                }
            }
            #charts{
                $canvasBg: linear-gradient(180deg, #f4f8ff 0%, white 100%);
                .click-data{
                    background-color: #fff;
                    color: #262626;
                    border: 1px solid #262626;
                }
                #closeLevel{
                    .close-value{
                        border: 1px solid black;
                        background-color: #FFF;
                        color: #0047CC;
                    }
                }
                #KLineBgCanvas{
                    background: $canvasBg!important;
                }
                #volBgCanvas{
                    background: $canvasBg
                }
                #MACDBgCanvas{
                    background: $canvasBg;
                }
                #timeCanvas{
                    background: $canvasBg;
                }
                #clickTime{
                    background-color: #ffffff;
                    color: #262626;
                    border: 1px solid #262626;
                }
            }
        }
    }
</style>
