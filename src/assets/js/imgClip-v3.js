export default class ImgClip{
    constructor(container){
        this.imgClipContainer = document.body.querySelector(container);
        this.imgClipSrc = this.imgClipContainer.querySelector('img');
        this.imgClipCanvas = this.imgClipContainer.querySelector('.img-clip-canvas');
        this.imgClipContext = this.imgClipCanvas.getContext('2d');
        this.imgClipCanvasWidthRatio = 0.8;
        this.canSlide = false;
        this.canSlideToLeft = false;
        this.canSlideToRight = false;
        this.canSlideToTop = false;
        this.canSlideToBottom = false;
        this.forbidSlideToLeftValue = 0;
        this.forbidSlideToRightValue = 0;
        this.forbidSlideToTopValue = 0;
        this.forbidSlideToBottomValue = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.initTranslateX = 0;
        this.initTranslateY = 0;
        this.startPoint = {
            x: 0,
            y: 0,
        };
        this.endPoint = {
            x: 0,
            y: 0,
        };
        this.firstScaleStartPoint = {
            x: 0,
            y: 0
        }
        this.lastScaleStartPoint = {
            x: 0,
            y: 0
        }
        this.firstScaleEndPoint = {
            x: 0,
            y: 0
        }
        this.lastScaleEndPoint = {
            x: 0,
            y: 0
        }

        console.log(this.imgClipSrc);
        this.imgClipCanvas.addEventListener('touchstart', this.ontouchstart.bind(this), false);
        this.imgClipCanvas.addEventListener('touchmove', this.ontouchmove.bind(this), false);
        this.imgClipCanvas.addEventListener('touchend', this.ontouchend.bind(this), false);

        this.init();
    }
    init(){
        let imgClipContainerClientWidth = this.imgClipContainer.clientWidth;
        let imgClipContainerClientHeight = this.imgClipContainer.clientHeight;
        console.log(`容器可见宽高：${imgClipContainerClientWidth}, ${imgClipContainerClientHeight}`);

        this.imgClipCanvasWidth = imgClipContainerClientWidth * this.imgClipCanvasWidthRatio;
        this.imgClipCanvasHeight = imgClipContainerClientWidth * this.imgClipCanvasWidthRatio;
        console.log(`裁剪的图片的宽高：${this.imgClipCanvasWidth}, ${this.imgClipCanvasHeight}`);

        let imgClipSrcClientWidth = this.imgClipSrc.width;
        let imgClipSrcClientHeight = this.imgClipSrc.height;
        console.log(`图片源宽高分别为：${imgClipSrcClientWidth}, ${imgClipSrcClientHeight}`);

        let imgClipSrcScaleWidth = 0;
        let imgClipSrcScaleHeight = 0;
        if(imgClipSrcClientWidth > imgClipSrcClientHeight){ //宽大于高
            this.imgClipSrc.style.height = this.imgClipCanvasHeight + 'px';
            imgClipSrcScaleWidth = imgClipSrcClientWidth * (this.imgClipCanvasHeight / imgClipSrcClientHeight);
            this.forbidSlideToRightValue = -this.imgClipCanvasWidth / 2;
            this.forbidSlideToLeftValue = -(imgClipSrcScaleWidth - this.imgClipCanvasWidth / 2);
            this.forbidSlideToBottomValue = -this.imgClipCanvasHeight / 2;
            this.forbidSlideToTopValue = -this.imgClipCanvasHeight / 2;
            // this.forbidSlideToTopValue = -(imgClipSrcScaleHeight - this.imgClipCanvasHeight / 2);
            this.translateX = -imgClipSrcScaleWidth / 2;
            this.translateY = -this.imgClipCanvasHeight / 2;
        }
        if(imgClipSrcClientWidth < imgClipSrcClientHeight){ //宽小与高
            // console.log(11);
            this.imgClipSrc.style.width = this.imgClipCanvasWidth + 'px';
            imgClipSrcScaleHeight = imgClipSrcClientHeight * (this.imgClipCanvasWidth / imgClipSrcClientWidth)
            this.forbidSlideToBottomValue = -this.imgClipCanvasHeight / 2;
            this.forbidSlideToTopValue = -(imgClipSrcScaleHeight - this.imgClipCanvasHeight / 2);
            this.forbidSlideToRightValue = -this.imgClipCanvasWidth / 2;
            this.forbidSlideToLeftValue = -this.imgClipCanvasWidth / 2;
            this.translateX = -this.imgClipCanvasWidth / 2;
            this.translateY = -imgClipSrcScaleHeight / 2;
        }
        if(imgClipSrcClientWidth === imgClipSrcClientHeight){ //宽等于高
            this.imgClipSrc.style.width = this.imgClipCanvasWidth + 'px';
            this.imgClipSrc.style.height = this.imgClipCanvasHeight + 'px';
            imgClipSrcScaleWidth = this.imgClipCanvasWidth;
            imgClipSrcScaleHeight = this.imgClipCanvasHeight;
            this.forbidSlideToRightValue = -this.imgClipCanvasWidth / 2;
            this.forbidSlideToLeftValue = -this.imgClipCanvasWidth / 2;
            this.forbidSlideToBottomValue = -this.imgClipCanvasHeight / 2;
            this.forbidSlideToTopValue = -this.imgClipCanvasHeight / 2;

            this.translateX = -this.imgClipCanvasWidth / 2;
            this.translateY = -this.imgClipCanvasHeight / 2;
        }

        // this.translateX = imgClipSrcScaleWidth / 2;
        // this.translateY = this.imgClipCanvasHeight / 2;

        // this.forbidSlideToRightValue = -this.imgClipCanvasWidth / 2;
        // this.forbidSlideToLeftValue = -(imgClipSrcScaleWidth - this.imgClipCanvasWidth / 2);
        // console.log(`禁止右滑临界值：${this.forbidSlideToRightValue}`);
        // console.log(`禁止左滑临界值：${this.forbidSlideToLeftValue}`);

        this.imgClipSrc.style.transform = "translate3d(" + this.translateX + "px, " + this.translateY +"px, 0)";

        let maskTop = this.imgClipContainer.querySelector('.mask-top');
        let maskLeft = this.imgClipContainer.querySelector('.mask-left');
        let maskRight = this.imgClipContainer.querySelector('.mask-right');
        let maskBottom = this.imgClipContainer.querySelector('.mask-bottom');


        this.maskTopHeight = (imgClipContainerClientHeight - this.imgClipCanvasHeight) / 2;
        this.maskLeftWidth = (imgClipContainerClientWidth - this.imgClipCanvasWidth) / 2;

        maskTop.style.width = "100%";
        maskTop.style.height = this.maskTopHeight + 'px';

        maskLeft.style.width = this.maskLeftWidth + 'px';
        maskLeft.style.height = this.imgClipCanvasHeight + 'px';
        maskRight.style.width = this.maskLeftWidth + 'px';
        maskRight.style.height = this.imgClipCanvasHeight + 'px';

        maskBottom.style.width = "100%";
        maskBottom.style.height = this.maskTopHeight + 'px';

        this.imgClipCanvas.style.width = this.imgClipCanvasWidth + 'px';
        this.imgClipCanvas.style.height = this.imgClipCanvasHeight + 'px';
        this.imgClipCanvas.width = this.imgClipCanvasWidth;
        this.imgClipCanvas.height =  this.imgClipCanvasHeight;

        console.log(`图片裁剪canvas宽高分别为：${this.imgClipCanvas.width}, ${this.imgClipCanvas.height}`);

        this.imgClipSrc.onload = () =>{
            //this.imgClipContext.drawImage(this.imgClipSrc, 0, 0);
        }
    }
    ontouchstart(e){
        e.preventDefault();
        let touches = e.touches;
        if(touches.length > 1){
            this.firstScaleStartPoint = {
                x: touches[0].pageX,
                y: touches[0].pageY,
            }
            this.lastScaleStartPoint = {
                x: touches[touches.length - 1].pageX,
                y: touches[touches.length - 1].pageY,
            }
        }else{
            this.startPoint = {
                x: touches[0].pageX,
                y: touches[0].pageY,
            };
        }
        this.canSlide = true;
        this.translateX = Number.parseInt(this.imgClipSrc.style.transform.substring(12, this.imgClipSrc.style.transform.indexOf(',') - 2).trim());
        this.translateY = Number.parseInt(this.imgClipSrc.style.transform.slice(this.imgClipSrc.style.transform.indexOf(',') + 1, -8).trim());
        console.log(`开始点：${this.startPoint}`);
        console.log(`初始位移，translateX:${this.translateX}, translateY:${this.translateY}`);
    }
    ontouchmove(e){
        e.preventDefault();
        if(this.canSlide){
            let touches = e.touches;
            if(touches.length > 1){
                this.firstScaleEndPoint = {
                    x: touches[0].pageX,
                    y: touches[0].pageY,
                }
                this.lastScaleEndPoint = {
                    x: touches[touches.length - 1].pageX,
                    y: touches[touches.length - 1].pageY,
                }
                let originX = (this.lastScaleEndPoint.x - this.lastScaleStartPoint.x) / 2 / this.imgClipSrcScaleWidth;
                let originY = (this.lastScaleEndPoint.y - this.lastScaleStartPoint.y) / 2 / this.imgClipSrcScaleHeight;
                let scaleX = 1 + ((this.firstScaleEndPoint.x - this.firstScaleStartPoint.x)
                    + (this.lastScaleEndPoint.x - this.lastScaleStartPoint.x)) / this.imgClipSrcScaleWidth;
                let scaleY = 1 + ((this.firstScaleEndPoint.y - this.firstScaleStartPoint.y)
                    + (this.lastScaleEndPoint.y - this.lastScaleStartPoint.y)) / this.imgClipSrcScaleWidth;
                //console.log(`originX：${originX}, originY: ${originY}`);
                this.imgClipSrc.style.transform = this.imgClipSrc.style.transform.substring(0, this.imgClipSrc.style.transform.indexOf(")") + 1)
                    + "scaleX(" + scaleX + ", "+ scaleY + ")";
                this.imgClipSrc.style.transformOrigin = originX + " " + originY;

            }else{
                this.endPoint = {
                    x: touches[0].pageX,
                    y: touches[0].pageY
                };
                let translateX =  this.translateX + this.endPoint.x - this.startPoint.x;
                let translateY =  this.translateY + this.endPoint.y - this.startPoint.y;

                if(translateX >= this.forbidSlideToRightValue){
                    translateX = this.forbidSlideToRightValue;
                }
                if(translateX <= this.forbidSlideToLeftValue){
                    translateX = this.forbidSlideToLeftValue;
                }
                if(translateY >= this.forbidSlideToBottomValue){
                    translateY = this.forbidSlideToBottomValue
                }
                if(translateY <= this.forbidSlideToTopValue){
                    translateY = this.forbidSlideToTopValue
                }
                console.log(`translateX: ${translateX}`);
                console.log(`translateY: ${translateY}`);
                this.imgClipSrc.style.transform = "translate3d(" + translateX +"px, "+ translateY + "px, 0)";
            }
        }
    }
    ontouchend(e){
        e.preventDefault();
        this.canSlide = false;
    }
}
