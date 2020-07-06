class Tractor {
    constructor(x, y, scale){
        this.width = [];
        this.height = [];
        this.x = [];
        this.y = [];
        this.img = [];
        this.imgNum = 8;
        this.timer = 0;
        this.count = 0;
        this.init(x, y, scale);
    }

    init(x, y, scale){
        for(let i = 0; i < this.imgNum; i ++){
            this.x[i] = x;
            this.y[i] = y;
            this.img[i] = new Image();
            this.img[i].src = require('../../../../assets/images/betaDog/dogHouse/tractor/tuolaji-daiji_' + i + '.png');
            this.width[i] = this.img[i].naturalWidth * scale;
            this.height[i] = this.img[i].naturalHeight * scale;
        }
    }

    draw(deltaTime, ctx){
        this.timer += deltaTime;
        if(this.timer > 50){
            this.count = (this.count + 1) % this.imgNum;
            this.timer %= 50;
        }
        let count = this.count;
        ctx.drawImage(this.img[count], this.x[count], this.y[count], this.width[count], this.height[count]);
    }

}

export default Tractor;
