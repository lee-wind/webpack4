<template>
    <div class="wind-pagination relative scroll " id="pagination" ref="pagination"
         @scroll="upLoading($event.target)"
         @touchstart="touchstart($event)"
         @touchmove="touchmove($event)"
         @touchend="touchend($event)">
        <div class="refresh" ref="refresh" v-show="isShowRefresh">
            <img ref="refreshIcon" v-if="refreshPullShow" :src="pull" alt="">
            <img ref="refreshIcon" v-if="refreshLoadShow" :src="load" alt="">
        </div>
        <slot></slot>
        <div class='hint' v-if="!noMoreData" :class="{ visible: isLoading }">加载中...</div>
        <div class='hint' v-if="noMoreData" :class="{ visible: noMoreData }">没有更多数据了</div>
    </div>
</template>

<script>
    import load from '../assets/img/components/pagination/load.png'
    import pull from '../assets/img/components/pagination/pull.png'

    export default {
        name: "Pagination",
        props: {
            length: {
                default: 0
            },
            total: {
                default: 0
            },
            isAutoRefresh: {
                default: true,
            },
            isShowRefresh: {
                default: true,
            },
        },
        data(){
            return{
                current: 0,
                isLoading: false,
                refreshDone: true,
                noMoreData: false,
                scrollTop: 0,
                load: load,
                pull: pull,
                touch: {
                    length: 0,
                    start: {

                    },
                    end: {

                    },
                },
                refreshPullShow: true,
                refreshLoadShow: false,
                rootFontSize: 0,
                isMoving: false,
                isRefreshing: false,
                canTouchMove: false,
                refreshShow: false,
                paginationEl: null,
                refreshEl: null,
                perimeter: 0,
                maxPullLength: 0
            }
        },
        created(){
            if(this.isAutoRefresh === true){
                this.toRefreshLoad();
            }
        },
        activated(){
            this.$refs.pagination.scrollTop = this.scrollTop;
        },
        mounted(){
            this.refreshEl = this.$refs.refresh;
            this.perimeter = ((this.$refs.refreshIcon.clientWidth / 2) * Math.PI).toFixed(0);
            this.maxPullLength = this.perimeter * 1.8;
            this.paginationEl = this.$refs.pagination;
            this.rootFontSize = document.documentElement.style.fontSize.slice(0, -2);
        },
        methods: {
            emitLoadMore(current){
                new Promise(resolve => {
                    this.$emit('loadMore', current, resolve)
                }).then(() => {
                    console.log(this.length);
                    console.log(this.total);
                    this.refreshDone = true;
                    this.isLoading = false;
                    if(this.length === this.total){
                        console.log('全部數據加載完');
                        this.noMoreData = true;
                    }
                })
            },
            upLoading(el){
                this.scrollTop = el.scrollTop;
                if(this.noMoreData){
                    return;
                }
                if(this.isLoading){
                    return;
                }
                if(el.clientHeight + el.scrollTop + 1 >= el.scrollHeight){ //1px是误差
                    this.isLoading = true;
                    this.current++
                    this.emitLoadMore(this.current);
                }
            },
            touchstart(e){
                if(this.paginationEl.scrollTop > 0){
                    return this.touch.canTouchMove = false;
                }
                this.touch.canTouchMove = true;
                let touch = e.touches[0];
                this.touch.start = {
                    x: touch.pageX,
                    y: touch.pageY
                }
            },
            touchmove(e){
                if(!this.touch.canTouchMove){
                    return;
                }
                let touch = e.touches[0];
                this.touch.end = {
                    x: touch.pageX,
                    y: touch.pageY
                };
                let direction = 1;
                if(this.touch.end.y < this.touch.start.y){
                    direction = -1
                }
                let length = direction * Math.sqrt(Math.pow(this.touch.start.x - this.touch.end.x, 2)
                    + Math.pow(this.touch.start.y - this.touch.end.y, 2));
                if(length > 0 && length < this.maxPullLength){
                    this.paginationEl.style.overflow = 'hidden';

                    let rotate = length / this.perimeter * 360;
                    let translateY = length / this.rootFontSize;
                    this.refreshEl.style.transform = 'translate3d(0, '+ translateY + 'rem, 0) rotate(' + rotate + 'deg)';
                    this.touch.length = length;
                    this.touch.isMoving = true;
                }
            },
            touchend(e){
                if(!this.touch.isMoving){
                    return;
                }
                this.isRefreshing = true;
                if(this.touch.length < this.maxPullLength / 7 * 3){
                    this.refreshEl.style.transform = 'translate3d(0, 0, 0)';
                    this.refreshEl.style.transition = 'transform .8s';
                    this.refreshEl.addEventListener('transitionend', this.resetTransition);
                }else{
                    this.toRefreshLoad();
                }
                this.touch.canTouchMove = false;
                this.touch.isMoving = false;
            },
            toRefreshLoad(){
                this.refreshDone = false;
                this.isLoading = false;
                this.noMoreData = false;
                this.current = 1;
                if(document.getElementById('pagination')){
                    document.getElementById('pagination').scrollTop = 0
                }
                this.emitLoadMore(1);

            },
            resetTransition(){
                this.paginationEl.style.overflow = 'scroll';
                this.isRefreshing = false;
                this.refreshEl.style.transition = '';
                this.refreshEl.removeEventListener('transitionend', this.resetTransition);
            },
            addRotate(){
                this.refreshPullShow = false;
                this.refreshLoadShow = true;
                this.refreshEl.className = 'refresh rotate';
            },
            resetRefresh(){
                this.paginationEl.style.overflow = 'scroll';
                this.refreshPullShow = true;
                this.refreshLoadShow = false;
                this.isRefreshing = false;
                this.refreshEl.style.transform = '';
                this.refreshEl.style.transition = '';
                this.refreshEl.className = 'refresh';
                this.refreshEl.removeEventListener('animationend', this.resetRefresh);
            },
            //自动刷新
            autoRefresh(){
                // this.$nextTick(() => {
                let rotate = this.maxPullLength / this.perimeter * 360;
                this.refreshEl.style.transform = 'translate3d(0, ' + this.maxPullLength + 'px, 0) rotate(' + rotate + 'deg)';
                this.refreshEl.style.transition = "transform 1s";
                this.refreshEl.addEventListener('transitionend', this.toRefreshLoad);
                // });
            }
        },
        watch: {
            refreshDone(newVal){
                if(newVal){
                    this.refreshEl.removeEventListener('transitionend', this.addRotate);
                    this.refreshEl.className = 'refresh scale';
                    this.refreshEl.addEventListener('animationend', this.resetRefresh);
                }else{
                    this.refreshEl.removeEventListener('transitionend', this.toRefreshLoad);
                    let rotate = this.rootFontSize * 1.3 / this.perimeter * 360;
                    console.log(rotate);
                    this.refreshEl.style.transform = 'translate3d(0, 1.3rem, 0) rotate(' + rotate + 'deg)';
                    this.refreshEl.style.transition = 'transform .8s';
                    this.refreshEl.addEventListener('transitionend', this.addRotate);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .wind-pagination{
        width: 100%;
        height: 100%;
        .refresh{
            width: .8rem;
            position: absolute;
            top: -1rem;
            left: 50%;
            margin-left: -.4rem;
            overflow: hidden;
            img{
                display: block;
                width: .8rem;
                height: auto;
            }
            &.rotate{
                animation: rotate 1s infinite linear;
            }
            &.scale{
                animation: scale .1s linear;
            }
        }
        @keyframes rotate
        {
            from{
                transform: translate3d(0, 1.3rem, 0) rotate(0);
            }
            to{
                transform: translate3d(0, 1.3rem, 0) rotate(-360deg);
            }
        }
        @keyframes scale
        {
            from{
                transform: translate3d(0, 1.3rem, 0) rotate(0) scale(1);
            }
            to{
                transform: translate3d(0, 1.3rem, 0) rotate(-360deg) scale(0);
            }
        }
        .hint {
            visibility: hidden;
            font-size: .24rem;
            text-align: center;
            margin: .3rem 0;
        }
        .visible{
            visibility: visible;
        }
        .list{
            margin-bottom: 0;
        }
    }
</style>
