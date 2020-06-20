<template>
    <div class="wind-img-upload">
        <img class="img" ref="img" :src="imgSrc" alt="">
        <input ref="file" type="file" :accept=accept @change="imgSelect($event.target)">
        <canvas ref="canvas"></canvas>
        <img class="img" :src="base64" alt="">
        <button class="button" type="button" @click="selectImg">
            <slot></slot>
        </button>
        <div v-if="optionShow" @click="optionShow = false">
            <ul class="upload-option">
                <li>
                    <button @click.stop="takePicture">拍照</button>
                </li>
                <li>
                    <button @click.stop="pickPicture">相册</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ImgUpload",
        props: {
            accept: {
                default: 'image/*'
            },
            maxSize: {
                default: 204800 //200KB
            },
            suffix: {
                default: '.jpeg'
            },
            option: {
                default: '' //camera, gallery
            }
        },
        data(){
            return {
                imgSrc: '',
                base64: '',
                optionShow: false,
                count: 0,
            }
        },
        methods: {
            selectImg(){
                this.$emit('update:uploadBase64', '');
                if(window.plus){
                    if(!this.option){
                        return this.optionShow = true;
                    }
                    if(this.option === 'camera'){
                        return this.takePicture();
                    }
                    this.pickPicture();
                }else{
                    this.$refs.file.click();
                }
            },
            imgSelect(el){
                let file = el.files[0];
                if(file){
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        this.imgSrc = reader.result;
                        this.$nextTick(() => {
                            let size = file.size;
                            console.log("原始大小：" + size);
                            if(size > this.maxSize){
                                this.toBase64(size);
                            }else{
                                this.$emit('update:uploadBase64', this.imgSrc)
                                this.$emit('callback');
                                this.imgSrc = '';
                                this.base64 = '';
                            }
                        })
                    }
                }else{
                    this.imgSrc = '';
                    this.base64 = '';
                }
                el.value = ""
            },
            takePicture(){
                if(window.plus){
                    let camera = plus.camera.getCamera();
                    this.optionShow = false;
                    camera.captureImage((path) => {
                        this.getPicture(path, (entry) => {
                            plus.gallery.save(path, () => {
                                //alert('拍照图片已保存到相册');
                                entry.remove((entry2) => {
                                   // alert('本地拍照图片文件删除成功');
                                })
                            })
                        })
                    }, (err) => {

                    }, {
                        index: 1,
                        filename: '_doc/camera/'
                    })
                }
            },
            pickPicture(){
                if(window.plus){
                    this.optionShow = false;
                    plus.gallery.pick((path) => {
                        this.getPicture(path)
                    })
                }
            },
            getPicture(path, callback = null){
                plus.io.resolveLocalFileSystemURL(path, (entry) => {
                    entry.file((file) => {
                        let reader = new plus.io.FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                            this.imgSrc = e.target.result;
                            let size = file.size;
                            this.$nextTick(() => {
                                if(size > this.maxSize){
                                    this.toBase64(size);
                                }else{
                                    //alert("原始大小：" + size);
                                    this.$emit('update:uploadBase64', this.imgSrc)
                                    this.$emit('callback');
                                    this.imgSrc = '';
                                    this.base64 = '';
                                }
                                if(callback){
                                    callback(entry);
                                }
                            })
                        }
                    })
                })
            },
            toBase64(size){
                // 1:
                // 原理：x(像素) * y(像素) = 总像素
                // 原尺寸 / 现尺寸 = 原总像素 / 现总像素
                // 现总像素 = y * (x/y) * y = 原总像素 / (原尺寸 / 现尺寸)
                // y = Math.sqrt(现总像素 / (x/y));
                // x = y * (x/y);

                // 2:
                // 原理：x(像素) * y(像素) = 总像素
                // 每尺寸N个像素 = 总像素 / 总尺寸
                // 现总像素 = 现尺寸 * 每尺寸N个像素
                // y * （x/y) y = 现总像素
                // y = Math.sqrt(现总像素 / (x/y));
                // x = y * (x/y);
                this.count++;

                console.log("压缩前：" + size);
                let canvas = this.$refs.canvas;
                //let dpr = window.devicePixelRatio || 1;
                //console.log(dpr);
                let img = this.$refs.img;
                //console.log(img);
                let ctx = canvas.getContext('2d');
                img.onload = () => {

                    let width = img.naturalWidth;
                    let height = img.naturalHeight;

                    console.log('原宽：' + width);
                    console.log('原高：' + height);

                    let originPixel = width * height;
                    console.log('原总像素：' + originPixel);

                    let ratio = width / height;
                    console.log('宽等于：' + ratio + '高'); //height * height * ratio = pixel;

                    //方法一
                    let sizeRatio = size / this.maxSize;
                    console.log('尺寸比：' + sizeRatio);
                    let currentPixel = originPixel / sizeRatio;
                    console.log('现总像素：' + currentPixel);
                    let currentHeight = Math.sqrt(currentPixel / ratio);
                    let currentWidth = currentHeight * ratio;
                    console.log('当前高：' + currentHeight);
                    console.log('当前宽' + currentWidth);

                    //方法二
                    /*let pixelPerSize = width * height / size;
                    console.log('每尺寸：' + pixelPerSize + '个像素');
                    let currentPixel = this.maxSize * pixelPerSize;
                    console.log('现总像素：' + currentPixel);
                    let currentHeight = Math.sqrt(currentPixel / ratio);
                    let currentWidth = currentHeight * ratio;
                    console.log('当前高：' + currentHeight);
                    console.log('当前宽' + currentWidth);*/

                    canvas.width = currentWidth;
                    canvas.height = currentHeight;
                    //console.log(canvas.width);
                    //console.log(canvas.height);

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    let imgSrc = canvas.toDataURL('image/' + this.suffix, 1);
                    let newSize = this.calcBase64Size(imgSrc);
                    console.log("压缩后：" + newSize);
                    if(newSize > this.maxSize){
                        img.src = imgSrc;
                        return this.toBase64(newSize);
                    }else{
                        this.base64 = imgSrc;
                        //alert("压缩后的大小：" + size);
                        this.$emit('update:uploadBase64', this.base64)
                        this.$emit('callback');
                        this.imgSrc = '';
                        this.base64 = '';
                        console.log('循环次数：' + this.count);
                    }
                }
            },
            calcBase64Size(base64){
                let tag="base64,";
                let baseStr = base64.substring(base64.indexOf(tag) + tag.length);
                //console.log(baseStr);
                let eqTagIndex = baseStr.indexOf("=");
                baseStr = eqTagIndex !== -1 ? baseStr.substring(0, eqTagIndex) : baseStr;
                let baseStrLength = baseStr.length;
                return baseStrLength - (baseStrLength / 8) * 2;
            }
        },
    }
</script>

<style scoped lang="scss">
    .wind-img-upload{
        .img{
            display: none;
        }
        input{
            display: none;
        }
        canvas{
            display: none;
        }
        button{
            display: block;
        }
        .upload-option{
            width: 4rem;
            color: #666666;
            bottom: 1rem;
           .list-item{
               padding: 0;
           }
            button{
                padding: .2rem 0;
                width: 100%;
                margin: 0 auto;
            }
        }
    }
</style>
