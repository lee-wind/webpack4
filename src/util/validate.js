//支付密码校验
export const payPassReg = {
    reg: /^\d{6}$/,
    text: '支付密码长度为6位数字',
};

//密码校验
export const passwordReg = {
    reg: /^[A-Za-z0-9]{6,16}$/,
    text: '密码必须由 6-16位字母、数字组成'
};

//号码校验
export const phoneReg = {
    ChinaMainLand: {
        code: 86,
        reg: /^1[23456789]\d{9}$/
    },
    // HongKong: /^[6|9]\d{7}/,
    HongKong: {
        code: 852,
        reg: /^\d{8}/
    },
    Macao: {
        code: 853,
        //reg: /^[6](\d{7}$)/
        reg: /^\d{8}/
    },
    TaiWan: {
        code: 886,
        //reg: /^[0][9]\d{8}$/
        reg: /^\d{9}/
    }
};

//名字校验
export const nameReg = {
    reg: /^[a-zA-Z\u4e00-\u9fa5\s]{1,20}$/,
    text: '姓名为中文或英文或中英文，长度为20以内',
};

//身份证校验
export const IDCardReg = {
    reg: /^[A-Za-z0-9]{8,18}$/,
    text: '身份证号码长度8到18位',
};

//银行卡校验
export const bankNumberReg = {
    reg: /^\d{16,24}/,
    text: '银行卡号码长度为16至24位',
};

//区域码校验
export const phoneMatchCountryCode = (phone, areaCode) => {
    switch (areaCode) {
        case '86':
            return phoneReg.ChinaMainLand.reg.test(phone);
        case '852':
            return phoneReg.HongKong.reg.test(phone);
        case '853':
            return phoneReg.Macao.reg.test(phone);
        case '886':
            return phoneReg.TaiWan.reg.test(phone);
        default:
            return !!phone;
    }
};
