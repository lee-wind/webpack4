<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <form>
                <div v-katex="'\\frac{a_i}{1+x}'"></div>
                <div v-katex:display="'\\frac{a_i}{1+x}'"></div>
                <p>{{a}}、{{b}}：</p>
                <p>加：{{a | add(b)}}</p>
                <p>减：{{a | sub(b)}}</p>
                <p>乘：{{a | mul(b)}}</p>
                <p>除：{{a | div(b)}}</p>
                <p>{{c | digit(9)}}（9位小数）保留8位小数：{{c | digit(8)}}</p>
                <div class="mg bd flex-middle">
                    <button type="button" class="bd-right pd-md" @click="sub">-</button>
                    <wind-decimal-input :length="precision" class="pd-md" v-model="price"/>
                    <button type="button" class="bd-left pd-md" @click="add">+</button>
                </div>
                <div class="mg" style="width: 50%">
                    <wind-select :list="list" v-model="select" text-key="text"/>
                </div>
                <div class="mg input">
                    <wind-search class="pd-md" v-model="searchText" @submit="search"/>
                </div>
                <div class="mg input">
                    <wind-int-input class="pd-md bd radius" v-model="int" placeholder="整数输入框"/>
                </div>
                <div class="mg input">
                    <wind-decimal-input class="pd-md bd radius" v-model="decimalInput" placeholder="小数输入框"/>
                </div>
                <div class="mg input">
                    <wind-number-input class="pd-md bd radius" :value="decimal" placeholder="小数输入框"/>
                </div>
                <div class="mg input">
                    <p v-html="otherChatText"></p>
                    <p contenteditable="true" ref="chatEl" class="bd mg-bottom-sm pd-md radius" @input="chat($event)"></p>
                    <ul class="emojis">
                        <li v-for="(emoji, i) in emojis" :key="i">
                            <button type="button" @click="selectEmoji(emoji)">{{emoji}}</button>
                        </li>
                    </ul>
                </div>
                <div class="mg">
                    <button type="button" class="block polygon-btn pd-md" @click="submit">提交</button>
                </div>
            </form>
        </wind-body>
    </wind-container>
</template>

<script>
    import { Decimal } from 'decimal.js'
    export default {
        name: "Form",
        data(){
            return {
                int: '',
                decimalInput: '',
                searchText: '',
                list: [{
                    id: 1,
                    text: 11
                },{
                    id: 2,
                    text: 22
                }],
                select: {
                    id: 1,
                    text: 11
                },
                emojiText: 'I \u{1F600} emoji!',
                decimal: '',//new Decimal(1e-9)//0.3 - new Decimal(0.2),//new Decimal(1e-9),
                emojis: [
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
                ],
                chatText: '',
                otherChatText: '',
                chatEl: '',

                a: '0.003',
                b: '0.001',
                c: 0.000000789,
                price: '',
                precision: 8,
            }
        },
        mounted(){
            this.chatEl = this.$refs.chatEl;
            let a = 0.000000078;
            console.log(a.toFixed(8))
            console.log(a.toFixed(9).slice(0, -1));
        },
        methods: {
            submit(){
                console.log(new Decimal(9));
                console.log(this.int);
                console.log(this.decimalInput);
                console.log(this.searchText);
                console.log(this.emojiToUnicode(this.chatText));
                //console.log(this.unicodeToEmoji(this.emojiToUnicode(this.chatText)));
                this.otherChatText = this.unicodeToEmoji(this.emojiToUnicode(this.chatText));
            },
            search() {
                console.log('查找: ' + this.searchText);
            },
            chat(e){
                this.chatText = e.target.innerHTML;
                console.log(this.chatText);

            },
            selectEmoji(emoji){
                this.chatText += emoji;
                this.chatEl.innerHTML = this.chatText;
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
            add(){
                let price = Math.pow(10, -this.precision);
                if(!this.price){
                    this.price = this.$digit(price, this.precision);
                }else{
                    let result = this.$add(this.price, price);
                    this.price = this.$digit(result, this.precision);
                }
            },
            sub(){
                let price = Math.pow(10, -this.precision);
                if(this.price){
                    console.log(Number.parseFloat(this.price));
                    if(Number.parseFloat(this.price) === 0) return;
                    let result = this.$sub(this.price, price);
                    this.price = this.$digit(result, this.precision);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
.emojis{
    display: flex;
    flex-wrap: wrap;
    font-size: .42rem;
    li{
       width: 10%;
    }
}
</style>
