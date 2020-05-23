module.exports = {
    dev: {
        dist: 'dev',
        origin: 'development',
    },
    test: {
        dist: 'test',
        origin: 'test',
    },
    build: {
        dist: 'build',
        origin: 'build'
    },
    getDist(env){
        let dist = 'build';
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
    }
};
