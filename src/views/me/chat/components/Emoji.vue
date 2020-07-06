<template>
    <!--<ul class="emojis">
        <li v-for="(emoji, i) in emojis" :key="i">
            <button type="button" @click="selectEmoji(emoji)">{{emoji}}</button>
        </li>
    </ul>-->
    <div id="emojis" class="swiper hidden" :class="{ show: emojiShow }">
        <div class="swiper-wrapper">
            <div class="emojis swiper-slide">
                <div class="emoji" v-for="(emoji, i) in emojis1" :key="i">
                    <button type="button" @click="selectEmoji(emoji)">{{emoji}}</button>
                </div>
            </div>
            <div class="emojis swiper-slide">
                <div class="emoji" v-for="(emoji, i) in emojis2" :key="i">
                    <button type="button" @click="selectEmoji(emoji)">{{emoji}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper'
    export default {
        name: "Emoji",
        model: {
            prop: 'inputText',
            event: 'select'
        },
        props: {
            inputEl: '',
            inputText: {
                default(){
                    return ''
                }
            }
        },
        data(){
            return {
                emojiShow: false,
                /*emojis: [
                    '\u{1F600}', '\u{1F601}', '\u{1F602}', '\u{1F603}', '\u{1F604}', '\u{1F605}', '\u{1F606}', '\u{1F607}', '\u{1F608}', '\u{1F609}',
                    '\u{1F60A}', '\u{1F60B}', '\u{1F60C}', '\u{1F60D}', '\u{1F60E}', '\u{1F60F}',
                    '\u{1F610}', '\u{1F611}', '\u{1F612}', '\u{1F613}', '\u{1F614}', '\u{1F615}', '\u{1F616}', '\u{1F617}', '\u{1F618}', '\u{1F619}',
                    '\u{1F61A}', '\u{1F61B}', '\u{1F61C}', '\u{1F61D}', '\u{1F61E}', '\u{1F61F}',
                    '\u{1F620}', '\u{1F621}', '\u{1F622}', '\u{1F623}', '\u{1F624}', '\u{1F625}', '\u{1F626}', '\u{1F627}', '\u{1F628}', '\u{1F629}',
                    '\u{1F62A}', '\u{1F62B}', '\u{1F62C}', '\u{1F62D}', '\u{1F62E}', '\u{1F62F}',
                    '\u{1F630}', '\u{1F631}', '\u{1F632}', '\u{1F633}', '\u{1F634}', '\u{1F635}', '\u{1F636}', '\u{1F637}', '\u{1F638}', '\u{1F639}',
                    '\u{1F63A}', '\u{1F63B}', '\u{1F63C}', '\u{1F63D}', '\u{1F63E}', '\u{1F63F}',
                    '\u{1F640}', '\u{1F641}', '\u{1F642}', '\u{1F643}', '\u{1F644}', '\u{1F645}', '\u{1F646}', '\u{1F647}', '\u{1F648}', '\u{1F649}',
                    '\u{1F64A}', '\u{1F64B}', '\u{1F64C}', '\u{1F64D}', '\u{1F64E}', '\u{1F64F}',
                ],*/
                emojis1: [
                    '\u{1F600}', '\u{1F601}', '\u{1F602}', '\u{1F603}', '\u{1F604}', '\u{1F605}', '\u{1F606}', '\u{1F607}', '\u{1F608}', '\u{1F609}',
                    '\u{1F60A}', '\u{1F60B}', '\u{1F60C}', '\u{1F60D}', '\u{1F60E}', '\u{1F60F}',
                    '\u{1F610}', '\u{1F611}', '\u{1F612}', '\u{1F613}', '\u{1F614}', '\u{1F615}', '\u{1F616}', '\u{1F617}', '\u{1F618}', '\u{1F619}',
                    '\u{1F61A}', '\u{1F61B}', '\u{1F61C}', '\u{1F61D}', '\u{1F61E}', '\u{1F61F}',
                    '\u{1F620}', '\u{1F621}', '\u{1F622}', '\u{1F623}', '\u{1F624}', '\u{1F625}', '\u{1F626}', '\u{1F627}', '\u{1F628}', '\u{1F629}',
                    '\u{1F62A}', '\u{1F62B}', '\u{1F62C}', '\u{1F62D}', '\u{1F62E}', '\u{1F62F}',
                    '\u{1F630}', '\u{1F631}',
                ],
                emojis2: [
                    '\u{1F632}', '\u{1F633}', '\u{1F634}', '\u{1F635}', '\u{1F636}', '\u{1F637}', '\u{1F638}', '\u{1F639}',
                    '\u{1F63A}', '\u{1F63B}', '\u{1F63C}', '\u{1F63D}', '\u{1F63E}', '\u{1F63F}',
                    '\u{1F640}', '\u{1F641}', '\u{1F642}', '\u{1F643}', '\u{1F644}', '\u{1F645}', '\u{1F646}', '\u{1F647}', '\u{1F648}', '\u{1F649}',
                    '\u{1F64A}', '\u{1F64B}', '\u{1F64C}', '\u{1F64D}', '\u{1F64E}', '\u{1F64F}',
                ]
            }
        },
        mounted(){
            new Swiper('#emojis', {
                resistanceRatio: 0 //是否回弹
            })
        },
        methods: {
            selectEmoji(emoji){
                let selection = getSelection();
                let range = selection.getRangeAt(0);

                let emojiEl = document.createElement('emoji');
                emojiEl.innerHTML = emoji
                range.insertNode(emojiEl);
                if(!emojiEl.nextSibling){
                    console.log('插入元素没有后接元素');
                    range.setStart(emojiEl, 1);
                }else if(emojiEl.nextSibling){
                    console.log('插入元素有后接元素');
                    range.setStart(emojiEl.nextSibling, 0)
                }else{
                    console.log('插入元素');
                    range.setStartAfter(emojiEl);
                }
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                let text = this.inputEl.innerHTML;

                this.$emit('select', text);
            },
            emojiToUnicode(str){
                let patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
                str = str.replace(patt, function(char){
                    let H, L, code;
                    if (char.length===2) {
                        H = char.charCodeAt(0); // 取出高位
                        L = char.charCodeAt(1); // 取出低位
                        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                        return "&#" + code + ";";
                    } else {
                        return char;
                    }
                });
                return str;
            },
            unicodeToEmoji(str){
                let reg = /\&#.*?;/g;
                let result = str.replace(reg,function(char){
                    let H,L,code;
                    if(char.length == 9 ){
                        code = parseInt(char.match(/[0-9]+/g));
                        H = Math.floor((code-0x10000) / 0x400)+0xD800;
                        L = (code - 0x10000) % 0x400 + 0xDC00;
                        return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
                    }else{
                        return char;
                    }
                });
                return result;
            },
            toggleEmoji(){
                this.inputEl.focus();
                // this.$nextTick(() => {
                    this.emojiShow = !this.emojiShow;
                // })
            },
            show(){
                this.emojiShow = false;
            },
            hide(){
                this.emojiShow = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    #emojis{
        height: 0;
        &.show{
            height: auto;
        }
        .emojis{
            display: flex;
            flex-wrap: wrap;
            font-size: .42rem;
            padding: .2rem;
            align-content: flex-start;
            .emoji{
                text-align: center;
                width: 10%;
                margin: .1rem 0;
            }
        }
    }
</style>
