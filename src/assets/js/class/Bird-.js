class Bird {
    constructor(canvasWidth, canvasHeight, scale){
        this.x;
        this.y;
        this.width = [];
        this.height = [];
        this.img = [];
        this.imgNum = 13;
        this.timer = 0;
        this.count = 0;
        this.distance = 0;
        this.speed = 0;
        this.monitor = 0;
        this.angle = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.randomX = 0;
        this.randomY = 0;
        this.init(scale);
    }

    init(scale){
        for(let i = 0; i < this.imgNum; i++){
            this.img[i] = new Image();
            this.img[i].src = require('../../../../assets/images/betaDog/dogHouse/bird/xiaofenniao-daiji_' + i + '.png');
            this.width[i] = this.img[i].naturalWidth * scale;
            this.height[i] = this.img[i].naturalHeight * scale;
        }
        this.born();
    }

    draw(deltaTime, ctx){
        this.timer += deltaTime;
        //this.distance += deltaTime * this.speed;
        this.monitor += deltaTime;

        //this.x += touch.x - this.x;

        /*this.x = touch.x + (this.x - touch.x) * .98;
        this.y = touch.y + (this.y - touch.y) * .98;*/

        //console.log(touch);

        if(this.timer > 40){
            this.count = (this.count + 1) % this.imgNum;
            this.timer %= 40;
        }

        if(this.monitor > 3000){
            this.randomX = Math.floor(Math.random() * this.canvasWidth);
            this.randomY = Math.floor(Math.random() * this.canvasHeight);
            //console.log(this.angle);
            this.monitor %= 3000;
        }
        this.x = this.randomX + (this.x - this.randomX) * .98;
        this.y = this.randomY + (this.y - this.randomY) * .98;
        let beta =  Math.atan2(this.randomY - this.y, this.randomX - this.x);
        this.angle = lerpAngle(beta, this.angle, 0.6);

        let count = this.count;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.img[count], -this.width[count] / 2, -this.height[count] / 2,  this.width[count], this.height[count]);
        ctx.restore();
        /*if(this.distance > this.canvasWidth + this.width[count]){
            this.born();
            this.distance = 0;
        }*/
    }

    born(){
        this.speed = Math.random() * 0.02 + 0.12;
        this.x = this.canvasWidth * .2;
        this.y = (Math.random() * .3 + .3) * this.canvasHeight;

    }
}

function lerpDistance(aim, cur, ratio){
    return aim + (cur - aim) * ratio;
}

function lerpAngle(target, current, ratio){
    let diff = current - target;
    /*if(d > Math.PI) d = d - 2 * Math.PI;
    if(d < -Math.PI) d = d + 2 * Math.PI;*/
    return target + diff * ratio;
}
export default Bird;
