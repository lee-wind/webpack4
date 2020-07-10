<template>
    <wind-container id="avatar">
        <!--<wind-header>

        </wind-header>-->
        <wind-body class="relative hidden">
            <!--<div class="img">
                <img :src="avatar" alt="">
            </div>-->
            <button class="clip" @click="clip">裁剪</button>
            <div style="position: absolute; right: 0">
               <!-- <p>缩放原点：{{originX}} {{originY}}</p>
                <p>缩放：{{scaleX}} {{scaleY}}</p>
                <p>touchStartFirstPoint: {{touchStartFirstPoint}}</p>
                <p>touchStartEndPoint: {{touchStartEndPoint}}</p>
                <p>touchMoveFirstPoint: {{touchMoveFirstPoint}}</p>
                <p>touchMoveEndPoint: {{touchMoveEndPoint}}</p>-->
                <p>diffX: {{diffX}}</p>
                <p>diffY: {{diffY}}</p>
            </div>
            <div id="originImgBox">
                <img :src="avatar" alt="">
            </div>
            <div id="frame">
                <div id="top"></div>
                <div class="middle">
                    <div id="left"></div>
                    <div id="show">

                    </div>
                    <div id="right"></div>
                </div>
                <div id="bottom"></div>
            </div>

            <canvas style="display: none" id="canvas"></canvas>
<!--            <img :src="avatar" alt="">-->
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "avatar",
        data(){
            return {
                //avatar: require('../../../assets/img/my/startUp.png'),
                //avatar: require('../../../assets/img/my/square.png'),
                avatar: require('../../../assets/img/my/banner.png'),
                start: {
                    x: 0,
                    y: 0
                },
                touchStartFirstPoint: {
                    x: 0,
                    y: 0
                },
                touchStartEndPoint: {
                    x: 0,
                    y: 0
                },
                touchMoveFirstPoint: {
                    x: 0,
                    y: 0
                },
                touchMoveEndPoint: {
                    x: 0,
                    y: 0
                },
                lastX: 0, //上一次移动X
                lastY: 0, //上一次移动Y
                translateX: 0, //移动X
                translateY: 0, //移动Y
                originImgBox: '',
                originImgBoxWidth: '',
                originImgBoxHeight: '',
                originImg: '',
                show: '',
                clipStart: {
                    x: 0,
                    y: 0
                },
                canvas: '',
                ctx: '',

                originX: '',
                originY: '',
                scaleX: '',
                scaleY: '',

                diffX: '',
                diffY: ''
            }
        },
        mounted(){
            this.initFrame();
        },
        methods: {
            initFrame(){
                let frame = document.getElementById('frame');
                let top = document.getElementById('top');
                let right = document.getElementById('right');
                this.show = document.getElementById('show');
                let bottom = document.getElementById('bottom');
                let left = document.getElementById('left');
                this.originImgBox = document.getElementById('originImgBox');
                this.originImg = this.originImgBox.querySelector('img');

                let width = frame.clientWidth * .8;
                let height = width;
                console.log(width);
                this.show.style.width = width + 'px';
                this.show.style.height = height + 'px';
                left.style.height = height + 'px';
                right.style.height = height + 'px';

                this.originImg.onload = () => {
                    if(this.originImg.naturalWidth >= this.originImg.naturalHeight){ //宽大于高
                        this.originImgBox.style.height = height + 'px';
                        this.originImg.classList.add('height-block');
                    }else{ //宽小于高
                        this.originImgBox.style.width = width + 'px';
                        this.originImg.classList.add('width-block');
                    }

                    this.originImgBoxWidth = this.originImgBox.clientWidth;
                    this.originImgBoxHeight = this.originImgBox.clientHeight;

                    this.lastX = this.translateX =  -this.originImgBoxWidth / 2;
                    this.lastY = this.translateY = -this.originImgBoxHeight / 2;

                    this.originImgBox.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`

                    this.getClipPoint();
                }

                let top_bottom_height = (frame.clientHeight - height) / 2 + 'px';
                console.log(top_bottom_height);
                top.style.height = top_bottom_height;
                bottom.style.height = top_bottom_height;

                let left_right_width = (frame.clientWidth - width) / 2 + 'px';
                left.style.width = left_right_width;
                right.style.width = left_right_width;

                this.canvas = document.getElementById('canvas');
                this.ctx = this.canvas.getContext('2d');
                let pixel = this.getPixel(this.ctx);
                //let pixel = 1;
                console.log('设备像素比：' + pixel);

                this.canvas.style.width = this.show.clientWidth + 'px';
                this.canvas.style.height = this.show.clientHeight + 'px';

                this.canvas.width = this.show.clientWidth * pixel;
                this.canvas.height = this.show.clientHeight * pixel;

                frame.addEventListener('touchstart', this.touchstart);
                frame.addEventListener('touchmove', this.touchmove);
                frame.addEventListener('touchend', this.touchend);
            },

            touchstart(e) {
                e.preventDefault();
                console.log('start');
                let touches = e.touches;
                if(touches.length > 1){
                    let touchStartFirstPoint = {
                        x: touches[0].pageX.toFixed(2),
                        y: touches[0].pageY.toFixed(2)
                    };
                    let touchStartEndPoint = {
                        x: touches[touches.length - 1].pageX.toFixed(2),
                        y: touches[touches.length - 1].pageY.toFixed(2)
                    }
                    this.startDiff = Math.sqrt(Math.pow(touchStartFirstPoint.x - touchStartEndPoint.x, 2) +
                        Math.pow(touchStartFirstPoint.y - touchStartEndPoint.y, 2))
                    this.touchStartFirstPoint = touchStartFirstPoint;
                    this.touchStartEndPoint = touchStartEndPoint;
                }else {
                    let touch = touches[0];
                    this.start = {
                        x: touch.pageX,
                        y: touch.pageY
                    }
                }
            },
            touchmove(e) {
                e.preventDefault();
                console.log('move');
                let touches = e.touches;
                if(touches.length > 1){

                    let touchMoveFirstPoint = {
                        x: touches[0].pageX.toFixed(2),
                        y: touches[0].pageY.toFixed(2)
                    };
                    let touchMoveEndPoint = {
                        x: touches[touches.length - 1].pageX.toFixed(2),
                        y: touches[touches.length - 1].pageY.toFixed(2)
                    }

                    // let endDiff =

                    this.diffX = Math.abs((touchMoveFirstPoint.x - this.touchStartFirstPoint.x))
                        + Math.abs((touchMoveEndPoint.x - this.touchStartEndPoint.x));
                    this.diffY = Math.abs((touchMoveFirstPoint.y - this.touchStartFirstPoint.y)
                        + Math.abs((touchMoveEndPoint.y - this.touchStartEndPoint.y)));

                    /*let scaleX = '';
                    let scaleY = '';
                    let originX = '';
                    let originY = '';

                    console.log(`缩放：${scaleX} ${scaleY}`);



                    this.scaleX = scaleX.toFixed(2);
                    this.scaleY = scaleY.toFixed(2);
                    this.originX = originX.toFixed(2);
                    this.originY = originY.toFixed(2);

                    this.originImgBox.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scaleX}, ${this.scaleY})`;
                    this.originImgBox.style.transformOrigin = `${this.originX} ${this.originY}`;*/

                }else{
                    let end = {
                        x: touches[0].pageX,
                        y: touches[0].pageY
                    }
                    this.translateX = this.lastX + end.x - this.start.x;
                    this.translateY = this.lastY + end.y - this.start.y;
                    console.log(this.translateX);
                    console.log(this.translateY);
                    this.originImgBox.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`
                }
            },
            touchend(e) {
                e.preventDefault();
                console.log('end');
                /*this.start = this.end;*/

                let originImgBoxTop = this.originImgBox.getBoundingClientRect().top;
                let originImgBoxLeft = this.originImgBox.getBoundingClientRect().left;
                let originImgBoxRight = this.originImgBox.getBoundingClientRect().right;
                let originImgBoxBottom = this.originImgBox.getBoundingClientRect().bottom;
                console.log('originImgBox');
                console.log('top：' + originImgBoxTop);
                console.log('left：' + originImgBoxLeft);
                console.log('right：' + originImgBoxRight);
                console.log('bottom：' + originImgBoxBottom);

                let showImgBoxTop = this.show.getBoundingClientRect().top;
                let showImgBoxLeft = this.show.getBoundingClientRect().left;
                let showImgBoxRight = this.show.getBoundingClientRect().right;
                let showImgBoxBottom = this.show.getBoundingClientRect().bottom;
                console.log('show')
                console.log('top：' + showImgBoxTop);
                console.log('left：' + showImgBoxLeft);
                console.log('right：' + showImgBoxRight);
                console.log('bottom：' + showImgBoxBottom);
                if(this.isScale){

                    this.originImgBox.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scaleX}, ${this.scaleY})`;
                    this.originImgBox.style.transformOrigin = `${this.originX} ${this.originY}`;

                }else{
                    if(originImgBoxLeft > showImgBoxLeft){
                        this.translateX = this.translateX + (showImgBoxLeft - originImgBoxLeft);
                    }
                    if(originImgBoxRight < showImgBoxRight){
                        this.translateX = this.translateX + (showImgBoxRight - originImgBoxRight);
                        console.log('22');
                    }
                    if(originImgBoxTop > showImgBoxTop){
                        this.translateY = this.translateY + (showImgBoxTop - originImgBoxTop);
                        console.log('33');
                    }
                    if(originImgBoxBottom < showImgBoxBottom){
                        this.translateY = this.translateY + (showImgBoxBottom - originImgBoxBottom);
                        console.log('44');
                    }
                    this.originImgBox.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`
                    this.lastX = this.translateX;
                    this.lastY = this.translateY;

                    this.getClipPoint();
                }
            },
            getClipPoint(){
                let originImgBoxTop = this.originImgBox.getBoundingClientRect().top;
                let originImgBoxLeft = this.originImgBox.getBoundingClientRect().left;

                let showImgBoxTop = this.show.getBoundingClientRect().top;
                let showImgBoxLeft = this.show.getBoundingClientRect().left;

                    this.clipStart = {
                        x: +(showImgBoxLeft - originImgBoxLeft).toFixed(0),
                        y: +(showImgBoxTop - originImgBoxTop).toFixed(0),
                    }

                console.log(`裁剪起点：${this.clipStart.x}, ${this.clipStart.y}`);
            },
            clip(){
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                if(this.originImg.naturalWidth >= this.originImg.naturalHeight) { //宽大于高
                    let ratio = this.originImg.naturalHeight / this.show.clientHeight;
                    console.log('比率：' + ratio);
                    this.ctx.drawImage(this.originImg, this.clipStart.x * ratio, this.clipStart.y * ratio, this.originImgBoxHeight * ratio, this.originImgBoxHeight * ratio, 0, 0, this.canvas.width, this.canvas.height);
                }else {
                    let ratio = this.originImg.naturalWidth / this.show.clientWidth;
                    console.log('比率：' + ratio);
                    this.ctx.drawImage(this.originImg, this.clipStart.x * ratio, this.clipStart.y * ratio, this.originImgBoxWidth * ratio, this.originImgBoxWidth * ratio, 0, 0, this.canvas.width, this.canvas.height);
                }
            },
            getPixel(context){
                let backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;

                return (window.devicePixelRatio || 1) / backingStore;
            }
        }
    }
</script>

<style scoped lang="scss">
    .wind-body{
        height: 100%;
    }
#avatar{
    /*.img{
        width: 90%;
        !*height: 90%;*!
        margin-top: 5%;
        margin-left: 5%;
        img{
            width: 100%;
        }
    }*/
    #frame{
        position: absolute;
        font-size: 0;
        width: 100%;
        height: 100%;
        /*z-index: 111;*/
        background-color: transparent;
        /*display: none;*/
        #top, #right, #bottom, #left {
            /*background-color: rgba(0, 0, 0, .3);*/
            background-color: rgba(0, 0, 0, .3);
        }
        #top, #bottom{
            width: 100%;
        }
        #show, #left, #right{
            display: inline-block;
        }
        #middle{
            display: flex;
        }
        #show{

        }
    }
    canvas{
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 444;
        border: 1px solid #ffffff;
    }
    #originImgBox{
        position: absolute;
        top: 50%;
        left: 50%;
        /*transform: translate(-50%, -50%);*/
        .width-block{
            width: 100%;
            height: auto;
        }
        .height-block{
            width: auto;
            height: 100%;
        }
    }
    .clip{
        position: absolute;
        z-index: 333;
    }
}
</style>
