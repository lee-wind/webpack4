import FemaleDog from './FemaleDog';
import Tractor from './Tractor'
import Jungle from './Jungle'
import Tree from './Tree'
import Mosquito from './Mosquito'
import Bird from './Bird'
import Parrot from './Parrot'

class AniCanvas {
    constructor(id, width, height, scale){
        this.cannvas = document.getElementById(id);
        this.ctx = this.cannvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.deltaTime = 0;
        this.lastTime = 0;
        this.touch = {
            x: 0,
            y: 0
        };
        this.touchY = 0;
        this.aniObj = [];

        console.log(111);

        this.init();
    }

    init() {
        let scale = this.scale;
        this.cannvas.width = this.width;
        this.cannvas.height = this.height;

        this.aniObj.push(new FemaleDog(this.width * .1, this.height * .7, scale));
        this.aniObj.push(new Tractor(this.width * .54, this.height * .39, scale));
        this.aniObj.push(new Jungle(this.width * .59, this.height * .496, scale * .5));
      /*  this.aniObj.push(new Tree(this.width, this.height,this.width * .39, this.height * .2, scale));*/
        this.aniObj.push(new Tree(this.width * .36, this.height * .2, scale));
        this.aniObj.push(new Mosquito(this.width, this.height, scale));
        this.aniObj.push(new Bird(this.width, this.height, scale));
        this.aniObj.push(new Parrot(this.width, this.height, scale));

        // this.cannvas.addEventListener('touchmove', this.touchmove.bind(this), true);

        this.lastTime = Date.now();
        this.loop();
    }

    loop(){

        requestAnimationFrame(this.loop.bind(this));

        this.ctx.clearRect(0, 0, this.width, this.height);

        // console.log(this.deltaTime);

        const now = Date.now();
        this.deltaTime = now - this.lastTime;
        this.lastTime = now;

        for(let aniObj of this.aniObj){
            aniObj.draw(this.deltaTime, this.ctx);
        }


        /*this.ctx.clearRect(0, 0, this.width, this.height);*/
    }

    touchmove(e){
        e.preventDefault();
        let touch = e.touches[0];
        //console.log(e.pageY);
        this.touch = {
            x: touch.pageX - this.cannvas.getBoundingClientRect().left,
            y: touch.pageY - this.cannvas.getBoundingClientRect().top
        }
    }
}

export default AniCanvas;
