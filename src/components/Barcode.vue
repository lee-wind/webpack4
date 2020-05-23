<template>
    <div class="wind-barcode">
        <button type="button" @click="showBarcode">
            <img src="../assets/img/components/barcode/barcode_icon.png"
                 alt="">
        </button>
        <wind-modal class="bar-code-modal" ref="barcodeModal">
            <div class="header space-between flex-middle white-bg theme-color">
                <img @click="hideBarcode" class="mg-left" src="../assets/img/components/back/back_icon.png" alt="">
                <button class="theme-color mg-left-auto mg-right" @click="pickPicture">相册</button>
            </div>
            <div id="scan" class="body">

            </div>
        </wind-modal>
    </div>
</template>

<script>
    export default {
        name: "Barcode",
        model: {
            prop: 'code',
            event: 'scan',
        },
        props: {
            code: ''
        },
        data(){
            return {
                barcode: '',
            }
        },
        created(){

        },
        methods: {
            showBarcode(){
                this.$refs.barcodeModal.show();
                if(!window.plus) return;
                this.$nextTick(() =>{
                    this.barcode = new plus.barcode.Barcode('scan');
                   // this.$alert(this.barcode);
                    this.barcode.onmarked = (type, code) => {
                        this.$emit('scan', code);
                        this.hideBarcode();
                    };
                    this.barcode.start();
                })
            },
            hideBarcode(){
                this.$refs.barcodeModal.hide();
                if(this.barcode){
                    this.barcode.close();
                }
            },
            pickPicture(){
                if(window.plus){
                    plus.gallery.pick((path) => {
                        plus.barcode.scan(path, (type, code) => {
                            this.$emit('scan', code);
                            this.hideBarcode();
                        })
                    }, {
                        filter: "image"
                    })
                }
            },
        },
        beforeDestroy() {
            if(this.barcode){
                this.barcode.close();
            }
        }
    }
</script>

<style lang="scss">
.wind-barcode{
    width: .36rem;
    img{
        width: 100%;
    }
    .bar-code-modal{
        .container{
            width: 100%;
            height: 100%;
            border-radius: 0;
            .header{
                height: 1rem;
                img{
                    width: .28rem;
                }
            }
            .body{
                height: calc(100% - 1rem);
            }
        }
    }
}
</style>
