<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body id="gestureLock">
            <p id="text">设置手势锁</p>
            <button @click="reset">重置</button>
            <canvas id="canvas"
                    @touchmove="touchmove"
                    @touchend="touchend"></canvas>
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "gestureLock",
        data(){
            return {
                textEl: '',
                can: '',
                ctx: '',
                canWidth: '',
                canHeight: '',
                circles: [],
                points: [],
                count: 0,
                formalPoints: [],
                dpr: 1
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                let textEl = document.getElementById('text');
                let can = document.getElementById('canvas');
                let ctx = can.getContext('2d');
                let width = document.body.clientWidth * .9;
                let dpr = window.devicePixelRatio || 1;
                can.style.width = width + 'px';
                can.style.height = width + 'px';
                can.width = width * dpr;
                can.height = can.width;
                let circles = [];
                for(let i = 1; i < 4; i++){
                    for(let j = 1; j < 4; j++){
                        circles.push({
                            x: can.width * j / 4,
                            y: can.width * i / 4,
                            r: 30 * dpr
                        })
                    }
                }
                console.log(circles);

                this.can = can;
                this.ctx = ctx;
                this.circles = circles;
                this.textEl = textEl;
                this.dpr = dpr;
                this.canWidth = can.width;
                this.canHeight = can.height;

                this.drawCircles();
            },
            drawCircles(){
                let ctx = this.ctx;
                let circles = this.circles;
                let dpr = this.dpr;

                //ctx.save();
                /*ctx.lineCap = 'round';
                ctx.lineJoin = 'round';*/
                for(let circle of circles){
                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.r, 0,
                        2 * Math.PI);
                    ctx.lineWidth = 2 * dpr;
                    ctx.strokeStyle = 'pink';
                    ctx.stroke();
                    ctx.closePath();
                }
                //ctx.restore();
            },
            touchmove(e){
                e.preventDefault();

                let ctx = this.ctx;
                let circles = this.circles;
                let points = this.points;
                let dpr = this.dpr;

                ctx.clearRect(0, 0, this.canWidth, this.canHeight);

                this.drawCircles();

                this.connectPoints();

                // ctx.lineWidth = 10;
                ctx.strokeStyle = 'pink';

                let endPoint = this.getPoint(e);

                //console.log(endPoint);

                for(let i = 0; i < circles.length; i++){
                    let circle = circles[i];
                    let diff = Math.sqrt(Math.pow(circle.x - endPoint.x, 2)
                        + Math.pow(circle.y - endPoint.y, 2));
                    if(diff <= 30 * dpr){
                        if(points.indexOf(i) < 0){
                            points.push(i);
                            break;
                        }
                    }
                }

                let length = points.length;
                if(!length) return;
                let startPoint = circles[points[length - 1]];
                ctx.beginPath();
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.lineTo(endPoint.x, endPoint.y);
                ctx.stroke();
                ctx.closePath();
            },
            touchend(e){
                e.preventDefault();

                let ctx = this.ctx;
                let points = this.points;
                let textEl = this.textEl;
                let formalPoints = this.formalPoints;
                let count = this.count;

                ctx.clearRect(0, 0, this.canWidth, this.canHeight);

                this.drawCircles();

                if(points.length < 4){
                    textEl.innerText = '手势密码最少4个点';
                    points = [];
                    count = 0;
                }else{
                    if(this.count === 0){
                        textEl.innerText = '验证手势密码';
                        ctx.clearRect(0, 0, this.canWidth, this.canHeight);
                        this.drawCircles();
                        count++;
                        formalPoints = [...points];
                        points = [];
                    }else{
                        console.log(points);
                        console.log(formalPoints);
                        if(formalPoints.join() === points.join()){
                            this.connectPoints();
                            textEl.innerText = '手势设置成功';
                        }else{
                            textEl.innerText = '手势密码错误';
                            points = [];
                            count = 0;
                        }
                    }
                }
                this.count = count;
                this.points = points;
                this.formalPoints = formalPoints;
            },
            connectPoints(){
                let ctx = this.ctx;
                let points = this.points;
                let circles = this.circles;

                ctx.save();
                ctx.fillStyle = 'pink';
                ctx.strokeStyle = 'pink';

                for (let i of points){
                    let circle = circles[i];
                    ctx.beginPath();
                    ctx.arc(circle.x, circle.y, circle.r / 2,
                        0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();
                }
                let length = points.length;
                if(!length) return;
                ctx.beginPath();
                ctx.moveTo(circles[points[0]].x, circles[points[0]].y);
                for(let i = 1; i < length; i++){
                    let circle = circles[points[i]];
                    ctx.lineTo(circle.x, circle.y);
                    ctx.stroke();
                }
                ctx.closePath();
                ctx.restore();
            },
            getPoint(e){
                let can = this.can;
                let touch = e.touches[0];
                return {
                    x: (touch.pageX - can.getBoundingClientRect().left) * this.dpr,
                    y: (touch.pageY - can.getBoundingClientRect().top) * this.dpr
                }
            },
            reset(){
                this.ctx.clearRect(0, 0, this.canWidth, this.canHeight);
                this.drawCircles();
                this.points = [];
                this.count = 0;
                this.textEl.innerText = '设置手势密码'
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
    #gestureLock{
        #canvas{
            display: block;
            /*width: 400px;
            height: 400px;*/
            margin: 50px auto;
            border: 1px solid pink;
            /*background-color: pink;*/
        }
        #text{
            text-align: center;
            margin-top: 50px;
            font-size: 28px;
            color: #999999;
        }
        button{
            border: none;
            outer: none;
            background-color: pink;
            padding: 10px;
            font-size: 16px;
            color: #ffffff;
        }
    }
</style>
