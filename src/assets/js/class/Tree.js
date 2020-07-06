class tree {
    constructor(x, y, scale){
        this.tree1Width = [];
        this.tree1Height = [];
        this.tree2Width = [];
        this.tree2Height = [];
        this.tree1X = [];
        this.tree1Y = [];
        this.tree2X = [];
        this.tree2Y = [];
        this.tree1 = [];
        this.tree2 = [];
        this.imgNum = 61;
        this.timer = 0;
        this.count = 0;
        this.type = 0; //0：叶子不掉落， 1：叶子掉落
        this.init(x, y, scale);
    }

    init(x, y, scale){
        for(let i = 0; i < this.imgNum; i ++){
            this.tree1X[i] = x;
            this.tree1Y[i] = y;
            this.tree1[i] = new Image();
            this.tree1[i].src = require('../../../../assets/images/betaDog/dogHouse/tree/wait1/shu-daiji_' + i + '.png');
            this.tree2[i] = new Image();
            this.tree2[i].src = require('../../../../assets/images/betaDog/dogHouse/tree/wait2/shu-daiji2_' + i + '.png');
            this.tree1Width[i] = this.tree1[i].naturalWidth * scale;
            this.tree1Height[i] = this.tree1[i].naturalHeight * scale;
            this.tree2Width[i] = this.tree2[i].naturalWidth * scale;
            this.tree2Height[i] = this.tree2[i].naturalHeight * scale;
            this.tree2X[i] = x + this.tree2[i].naturalWidth * scale / 7;
            this.tree2Y[i] = y;
        }
    }

    draw(deltaTime, ctx){
        this.timer += deltaTime;
        if(this.timer > 80){
            this.count = (this.count + 1) % this.imgNum;
            if(this.count === 0){
                this.type = (this.type + 1) % 2;
            }
            this.timer %= 80;
        }
        let count = this.count;
        ctx.save();
        // if(this.type === 0){
        //     ctx.drawImage(this.tree1[count], this.tree1X[count], this.tree1Y[count], this.tree1Width[count], this.tree1Height[count]);
        // }else{
        //     ctx.drawImage(this.tree2[count], this.tree2X[count], this.tree2Y[count], this.tree2Width[count], this.tree2Height[count]);
        // }
        if(this.type === 0){
            ctx.translate(this.tree1X[count], this.tree1Y[count]);
            ctx.scale(-1, 1);
            ctx.drawImage(this.tree1[count], -this.tree1Width[count], 0, this.tree1Width[count], this.tree1Height[count]);
        }else{
            ctx.translate(this.tree2X[count], this.tree2Y[count]);
            ctx.scale(-1, 1);
            ctx.drawImage(this.tree2[count], -this.tree2Width[count] * .785, 0, this.tree2Width[count], this.tree2Height[count]);
        }
        ctx.restore();
    }

}

export default tree;
