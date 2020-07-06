class FemaleDog {
    constructor(x, y, scale){
        this.width = [];
        this.height = [];
        this.x = [];
        this.y = [];
        this.img = [];
        this.imgNum = 145;
        this.timer = 0;
        this.count = 0;
        this.init(x, y, scale);
    }

    init(x, y, scale){
        for(let i = 0; i < this.imgNum; i ++){
            this.x[i] = x;
            this.y[i] = y;
            this.img[i] = new Image();
            this.img[i].src = require('../../../../assets/images/betaDog/dogHouse/female/wait/mugou-idle2_' + i + '.png');
            this.width[i] = this.img[i].naturalWidth * scale;
            this.height[i] = this.img[i].naturalHeight * scale;
        }
    }

    draw(deltaTime, ctx){
        this.timer += deltaTime;
        if(this.timer > 40){
            this.count = (this.count + 1) % this.imgNum;
            this.timer %= 40;
        }
        let count = this.count;
        //console.log(count);
        ctx.drawImage(this.img[count], this.x[count], this.y[count], this.width[count], this.height[count]);
    }

}

export default FemaleDog;
