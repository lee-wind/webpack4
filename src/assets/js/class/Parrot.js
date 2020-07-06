class Parrot {
    constructor(canvasWidth, canvasHeight, scale){
        this.x = [];
        this.y = [];
        this.width = [];
        this.height = [];
        this.img = [];
        this.imgNum = 11;
        this.timer = 0;
        this.count = 0;
        this.distance = 0;
        this.speed = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.init(scale);
    }

    init(scale){
        for(let i = 0; i < this.imgNum; i++){
            this.img[i] = new Image();
            this.img[i].src = require('../../../../assets/images/betaDog/dogHouse/parrot/yingwu-daiji_' + i + '.png');
            this.width[i] = this.img[i].naturalWidth * scale;
            this.height[i] = this.img[i].naturalHeight * scale;
        }
        this.born();
    }

    draw(deltaTime, ctx){
        this.timer += deltaTime;
        this.distance += deltaTime * this.speed;
        if(this.timer > 40){
            this.count = (this.count + 1) % this.imgNum;
            this.timer %= 40;
        }
        let count = this.count;
        ctx.drawImage(this.img[count], this.x[count] + this.distance, this.y[count] + this.distance * -.1, this.width[count], this.height[count]);

        if(this.distance > this.canvasWidth + this.width[count]){
            this.born();
            this.distance = 0;
        }
    }

    born(){
        this.speed = Math.random() * 0.02 + 0.12;
        let y = (Math.random() * .3 + .3) * this.canvasHeight;
        for(let i = 0; i < this.imgNum; i++){
            this.x[i] = -this.width[i];
            this.y[i] = y;
        }
    }
}

export default Parrot;
