class Jungle {
    constructor(x, y, scale){
        this.jungle1Width = [];
        this.jungle1Height = [];
        this.jungle2Width = [];
        this.jungle2Height = [];
        this.jungle1X = [];
        this.jungle1Y = [];
        this.jungle2X = [];
        this.jungle2Y = [];
        this.jungle1 = [];
        this.jungle2 = [];
        this.imgNum = 51;
        this.timer = 0;
        this.count = 0;
        this.type = 0; //0：叶子不掉落， 1：叶子掉落

        this.init(x, y, scale);
    }

    init(x, y, scale){
        for(let i = 0; i < this.imgNum; i ++){
            this.jungle1X[i] = x;
            this.jungle1Y[i] = y;
            this.jungle1[i] = new Image();
            this.jungle1[i].src = require('../../../../assets/images/betaDog/dogHouse/jungle/wait1/guanmu-daiji_' + i + '.png');
            this.jungle2[i] = new Image();
            this.jungle2[i].src = require('../../../../assets/images/betaDog/dogHouse/jungle/wait2/guanmu-daiji2_' + i + '.png');
            this.jungle1Width[i] = this.jungle1[i].naturalWidth * scale;
            this.jungle1Height[i] = this.jungle1[i].naturalHeight * scale;
            this.jungle2Width[i] = this.jungle2[i].naturalWidth * scale;
            this.jungle2Height[i] = this.jungle2[i].naturalHeight * scale;
            this.jungle2X[i] = x - this.jungle2[i].naturalWidth * scale / 4.8;
            this.jungle2Y[i] = y;
        }
    }

    draw(deltaTime, ctx){
        this.timer += deltaTime;
        if(this.timer > 100){
            this.count = (this.count + 1) % this.imgNum;
            if(this.count === 0){
                this.type = (this.type + 1) % 2;
            }
            this.timer %= 100;
        }
        let count = this.count;
        if(this.type === 0){
            ctx.drawImage(this.jungle1[count], this.jungle1X[count], this.jungle1Y[count], this.jungle1Width[count], this.jungle1Height[count]);
        }else{
            ctx.drawImage(this.jungle2[count], this.jungle2X[count], this.jungle2Y[count], this.jungle2Width[count], this.jungle2Height[count]);
        }
    }

}

export default Jungle;
