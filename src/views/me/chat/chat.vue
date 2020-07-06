<template>
    <wind-container id="chat">
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <p v-html="inputText"></p>
            <ul id="chatList">
                <li v-for="(chat, i) in chatList" :key="i">
                    <div class="from" v-if="chat.messageType === 0
                        && userName !== chat.senderLoginName">
                        <p v-html="chat.content"></p>
                    </div>
                    <div class="you text-right" v-if="chat.messageType === 0
                        && userName === chat.senderLoginName">
                        <p v-html="chat.content"></p>
                    </div>
                    <div class="system text-center" v-if="chat.messageType === 1">
                        <p>{{chat.content}}</p>
                    </div>
                </li>
            </ul>
        </wind-body>
        <wind-footer>
            <p id="inputText" class="text-input flex1 bd radius" contenteditable="true"
               @input="input"></p>
            <button class="xxlg mg-left-md" @click="toggleEmoji" v-html="'\u{1F600}'"></button>
            <button class="mg-left-md pd-md theme-bg radius send-btn" :class="{ disabled: disabled }"
                    @click="sendMessage" :disabled="disabled">发送</button>
        </wind-footer>
        <emoji ref="emoji" :input-el="inputEl" v-model="inputText"/>
    </wind-container>
</template>

<script>
    import SockJS from 'sockjs-client';
    import Stomp from 'stompjs';
    import { chatHistory, sendChatMessage, orderDetail } from "../../../api/me";
    import Emoji from "./components/Emoji";
    import { emojiToUnicode, unicodeToEmoji } from "../../../util";

    export default {
        name: "chat",
        components: {Emoji},
        data(){
            return {
                userName: localStorage.getItem('userName'),
                chatList: [],
                inputText: '',
                inputEl: '',
                stompClient: '',
                orderId: 111,
                orderData: {},
                intervalEvent: '',
            }
        },
        computed: {
            disabled(){
                return this.inputText.length === 0;
            },
        },
        created(){
            console.log(this.$router.history.current.query.name);

            this.orderDetail();
            this.chatHistory();
            this.initSockJS();
            this.intervalEvent = setInterval(() => {
                try{
                    this.stompClient.send('test');
                }catch (err) {
                    this.initSockJS();
                }
            }, 5 * 1000);

        },
        mounted(){
            this.inputEl = document.getElementById('inputText')
        },
        methods: {
            chatHistory(){
                chatHistory(1, 9999, this.orderId)
                    .then(res => {
                        if(res.code === 200){
                            this.chatList = res.data.records;
                            console.log(this.chatList)
                        }
                    })
            },
            initSockJS(){
                let sockJS = new SockJS(SOCKJS_URL);
                this.stompClient = Stomp.over(sockJS);
                this.stompClient.connect({}, () => {
                    this.stompClient.subscribe(`/user/${this.orderId}${this.userName}/messages`, res => {
                        this.chatList.push(JSON.parse(res.body));
                    });
                    this.stompClient.subscribe(`/user/${this.orderId}/messages/system`, res => {
                        this.chatList.push({
                            content: res.body,
                            messageType: 1
                        });
                    })
                }, err => {
                    console.error(err);
                })
            },
            sendMessage(){
                let text = this.inputText.replace(/\<emoji\>/g, '');
                text = text.replace(/\<\/emoji\>/g, '');
                text = emojiToUnicode(text);
                let receiverId = this.orderData.loginUserRole === 1
                    ? this.orderData.sellerId : this.orderData.buyerId;
                sendChatMessage(receiverId, this.orderId, text).then(res => {
                    if(res.code === 200){
                        this.chatList.push({
                            messageType: 0,
                            content: text,
                            senderLoginName: this.userName
                        })
                        this.inputText = '';
                        this.inputEl.innerHTML = '';
                        this.$refs.emoji.hide();
                    }else{
                        this.$toast(res.msg);
                    }
                })
            },
            input(e){
                this.inputText = e.target.innerHTML;
            },
            toggleEmoji(){
                this.$refs.emoji.toggleEmoji();
            },
            orderDetail(){
                orderDetail(this.orderId).then(res => {
                    if(res.code === 200){
                        this.orderData = res.data;
                    }else{
                        this.toast(res.msg);
                    }
                })
            },
        },
        filters: {
            unicodeToEmoji
        },
        beforeDestroy(){
            clearInterval(this.intervalEvent);
        }
    }
</script>

<style scoped lang="scss">
#chat{
    display: flex;
    flex-direction: column;

    .wind-header{

    }
    .wind-body{
        flex: 1;
        #chatList{
            li{
                margin: .3rem;
                p{
                    padding: .15rem .2rem;
                    display: inline-block;
                }
            }
            .from{
                p{
                    max-width: 70%;
                    color: #666666;
                    background: white;
                    border: 0.02rem solid #e6e6e6;
                    border-radius: 0.00rem 0.24rem 0.24rem 0.24rem;
                }
            }
            .you{
                p{
                    max-width: 70%;
                    color: #ffffff;
                    background: linear-gradient(180deg, #3b37de 0%, #3761de 100%);
                    border-radius: 0.24rem 0.00rem 0.24rem 0.24rem;
                }
            }
            .system{
                p{
                    font-size: .24rem;
                }
            }
        }
    }
    .wind-footer{
        max-height: 2.4rem;
        height: auto;
        min-height: 1.4rem;
        padding: .3rem;
        .text-input{
            height: auto;
            max-height: 1.8rem;
            padding: .2rem;
            overflow: scroll;
        }
        .send-btn{
            &.disabled{
                background-color: #5a6375;
            }
        }
    }
}
</style>
