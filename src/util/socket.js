class Socket {
    constructor(url, options) {
        this.heartBeatTimer = null;
        this.heartBeatReturnTimer = null;
        this.options = options;
        this.messageMap = {};
        this.connState = 0;
        this.scoker = null;
        this.url = url;
    }
    doOpen(){
        if(this.connState) return;
        this.connState = 1;
        this.afterOpenEmit = [];

        try {
            const BrowserWebSocket = window.WebSocket || window.MozWebSocket;
            const socket = new BrowserWebSocket(this.url);
            socket.binaryType = 'arraybuff';
            socket.onopen = evt => this.onOpen(evt);
            socket.onclose = evt => this.onClose(evt);
            socket.onmessage = evt => this.onMessage(evt.data);
            socket.onerror = err => this.onError(err);
            this.socket = socket;
        } catch (e) {
            console.error(e);
        }
    }

    opOpen(evt) {
        this.connState = 2;
        this.heartBeatFun();
        this.onReceiver({ Event: 'open' })
    }

    heartBeatFun() {
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
        this.heartBeatReturnTimer && clearTimeout(this.heartBeatReturnTimer);
        this.heartBeatTimer = setTimeout(() => {
            const data = 'ping';
            this.send(data);
            this.heartBeatReturnTimer = setTimeout(() => {
                this.onReceiver({ Event: 'reconnect' })
            }, 40000)
        }, 60000)
    }
    checkOpen() {
        return this.connState === 2;
    }
    onClose(){
        this.connState = 0;
        if(this.connState){
            this.onReceiver({ Event: 'close' })
        }
    }
    send(data) {
        this.socket.send(data);
    }
    emit(data) {
        return new Promise(resolve => {
            this.socket.send(data);
            this.on('message', data => {
                resolve(data);
            })
        })
    }
    onMessage(message) {
        try {
            const data = message;
            this.heartBeatFun();
            this.onReceiver({ Event: 'message', Data: data })
        } catch (e) {
            console.error('>> Data parsing error:', e)
        }
    }
    checkHeartbeat() {
        let data = 'ping';
        this.send(data);
    }
    onError(err) {
        console.error(err);
    }
    onReceiver(data) {
        const callback = this.messageMap[data.Event];
        if(callback) callback(data.Data)
    }
    on(name, handler) {
        this.messageMap[name] = handler;
    }
    doClose() {
        this.socket.close();
    }
    destroy() {
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
        this.heartBeatReturnTimer && clearTimeout(this.heartBeatReturnTimer);

        this.connState = 0;
        this.doClose();
        this.messageMap = {};
        this.socket = null;
    }
}

export default Socket;
