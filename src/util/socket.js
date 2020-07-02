class Socket {
    constructor(url = SOCKET_URL, options) {
        this.heartBeatTimer = null;
        this.heartBeatCount = 0;
        this.options = options;
        this.messageMap = {};
        this.connState = 0;
        this.socket = null;
        this.url = url;

    }
    doOpen(){
        try {
            const BrowserWebSocket = window.WebSocket || window.MozWebSocket;
            const socket = new BrowserWebSocket(this.url);
            socket.binaryType = 'arraybuffer';
            socket.onopen = evt => this.onOpen(evt);
            socket.onmessage = evt => this.onMessage(evt.data);
            socket.onclose = evt => this.onClose(evt);
            socket.onerror = err => this.onError(err);
            this.socket = socket;
        } catch (e) {
            console.error(e);
        }
    }
    onOpen(evt) {
        console.log('socket已连接');
        this.connState = 1;
        this.heartBeatFun();
        this.onReceiver({ Event: 'open' })
    }
    send(data) {
        this.socket.send(data);
    }
    onMessage(message) {
        try {
            const data = message;
            //console.log(data);
            if(data === 'pong'){
                this.heartBeatCount = 0;
            }else{
                this.onReceiver({ Event: 'message', Data: data })
            }
        } catch (e) {
            console.error('>> Data parsing error:', e)
        }
    }
    onClose(){
        //this.connState = 3;

        this.onReceiver({ Event: 'close' });

        console.log('socket已关闭')
    }
    onError(err) {
        console.error(err);
    }
    heartBeatFun() {
        this.heartBeatTimer = setInterval(() => {
            //console.log(this.heartBeatCount);
            if(this.heartBeatCount >= 3){
                this.destroy();
                this.onReceiver({ Event: 'reconnect' });
                return;
            }
            this.heartBeatCount++;
            this.send('ping');
        }, 10 * 1000);
    }
    emit(data) {
        return new Promise(resolve => {
            this.socket.send(data);
            this.on('message', data => {
                resolve(data);
            })
        })
    }
    on(name, handler) {
        this.messageMap[name] = handler;
    }
    onReceiver(data) {
        const callback = this.messageMap[data.Event];
        if(callback) callback(data.Data)
    }
    destroy() {
        if(this.connState === 1){
            console.log('销毁socket');
            clearInterval(this.heartBeatTimer);
            this.heartBeatTimer = null;
            this.heartBeatCount = 0;
            this.socket.close();
            //this.messageMap = {};
            this.socket = null;
        }
    }
}

export default Socket;
