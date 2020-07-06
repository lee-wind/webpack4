let bgImg = require('../../../../assets/images/dogHouse/bg.png');
let houseImg = require('../../../../assets/images/dogHouse/kennel.png');

class BgCanvas {
    constructor(id, height, resolve){
        this.cannvas = document.getElementById(id);
        this.ctx = this.cannvas.getContext('2d');
        this.width = 0;
        this.height = height;
        this.scale = 0;
        this.bg = new Image();
        this.bg.src = bgImg;
        this.house = new Image();
        this.house.src = houseImg;

        this.draw(resolve);
    }

    draw(resolve){
        let bg = this.bg;
        let ctx = this.ctx;
        bg.onload = () => {
            let natureWidth = bg.naturalWidth;
            let natureHeight = bg.naturalHeight;
            this.scale = this.height / natureHeight;
            this.cannvas.width = natureWidth * this.scale;
            this.cannvas.height = this.height;
            this.width = this.cannvas.width;
            ctx.drawImage(bg, 0, 0, this.width, this.height);
            if(resolve){
                resolve();
            }
            this.drawHouse();
        }
        // this.bg = bgImg;
        // this.house = houseImg;
    };
    /*draw(){
        let ctx = this.ctx;
        let bg = new Image();
        bg.src = this.bg;
        bg.onload = () => {
            let natureWidth = bg.naturalWidth;
            let natureHeight = bg.naturalHeight;
            //let scale = Math.sqrt( (this.width * this.height) / (natureWidth * natureHeight));
            ctx.drawImage(bg, 0, natureHeight - this.height / scale ,  natureWidth, natureHeight, 0, 0, this.width, this.height);

            this.drawHouse();
        }
    }*/
    drawHouse(){
        let house = this.house;
        house.onload = () => {
            let natureWidth = house.naturalWidth;
            let natureHeight = house.naturalHeight;
            let scale = this.scale;
            this.ctx.drawImage(house, 0, this.height * .4 ,  natureWidth * scale, natureHeight * scale);
        }
    }
    reset(key, src){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this[key] = src;
        this.draw();
    }
}


export default BgCanvas;
