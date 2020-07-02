const os = require('os');

module.exports = {
    dev: {
        dist: 'dev',
        origin: "http://47.56.65.191:8000/",
        socketUrl: "ws://47.56.65.191:8000/websocket/market",
    },
    test: {
        dist: 'test',
        origin: 'http://47.56.107.199:9765',
    },
    build: {
        dist: 'build',
        origin: 'http://app.idra.site:8009',
    },
    getDist(env){
        let dist = this.build.dist;
        switch (env) {
            case 'development':
                dist = this.dev.dist;
                break;
            case 'test':
                dist = this.test.dist;
                break;
            default:
        }
        return dist;
    },
    getLocalIP(){
        let networkInfo = os.networkInterfaces();
        for(let key in networkInfo){
            for(let network of networkInfo[key]){
                if(network.family === 'IPv4' && !network.internal){
                    return network.address;
                }
            }
        }
    }
};
