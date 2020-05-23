//去除小数和0开头
export const onlyInt = (value) => {
    if(!value){
        return value;
    }
    return value.replace(/^(0+)|[^\d]+/g,'');
};

//百分数（没有小数）
export const percentage = function(value) {
    if(!value){
        return value;
    }
    return (value * 100).toFixed(0) + '%';
};

//保留多少位小数
export const toFixed = (value, length) => {
    if(!value){
        return value;
    }
    return value.toFixed(length);
};

//检测是否为数字
let num = function(a) {
    if(a != null && a.toString() != "") {
        let r = /^-?(0|[1-9]+\d*|[1-9]+\d*\.\d+|0\.\d+)$/;
        if(r.test(a.toString())) {
            return true;
        }
    }
    return false;
};

//加法
export const plus = function(a, b) {
    if(!num(a) || !num(b)) {
        return null;
    }
    let c, d, m;
    try {
        c = a.toString().split(".")[1].length;
    } catch(e) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch(e) {
        d = 0;
    }
    m = Math.pow(10, Math.max(c, d));
    return(a * m + b * m) / m;
};

//减法
export const minus = function(a, b) {
    if(!num(a) || !num(b)) {
        return null;
    }
    let c, d, m, n;
    try {
        c = a.toString().split(".")[1].length;
    } catch(e) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch(e) {
        d = 0;
    }
    m = Math.pow(10, Math.max(c, d));
    // return(a * m - b * m) / m;
    n = (c >= d) ? c : d;
    return((a * m - b * m) / m).toFixed(n);//数字转换字符串，保留n位小数
};

//乘法
export const multiply = function(a, b) {
    let m = 0,
        c = a.toString(),
        d = b.toString();
    try {
        m += c.split(".")[1].length
    } catch(e) {

    }
    try {
        m += d.split(".")[1].length
    } catch(e) {}
    return Number(c.replace(".", ""))
        * Number(d.replace(".", ""))
        / Math.pow(10, m)
};

//除法
export const division = function(a, b) {
    if(!num(a) || !num(b)) {
        return null;
    }
    let c, d, f, g;
    try {
        c = a.toString().split(".")[1].length;
    } catch(e) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch(e) {
        d = 0;
    }
    f = Number(a.toString().replace(".", ""));
    g = Number(b.toString().replace(".", ""));
    return(f / g) * Math.pow(10, d - c);
};
