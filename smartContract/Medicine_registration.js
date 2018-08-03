"use strict";

// MedicineInfo,定义一个类,描述药品的属性：code，name，indications，adr，author
var MedicineInfo = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.code = obj.code; //药品编码
        this.name = obj.name;
        this.indications = obj.indications; //药品适应症
        this.adr = obj.adr; //药品不良反应
        this.manufacturer = obj.manufacturer;//生产商账户，也可以叫做 manufacturer_Accounnt
    } else {
        this.code = "";
        this.name = "";
        this.indications = "";
        this.adr = "";
        this.manufacturer = "";
    }
};

//定义方法，一个prototype
MedicineInfo.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

//prototype的实现类，medicine字符串转化的两个方法
var MedicineRegistration = function () {
    LocalContractStorage.defineMapProperty(this, "medicine", {
        parse: function (text) {
            return new MedicineInfo(text)
        },
        stringify: function (res) {
            return res.toString()
        }
    })
};

//定义合约内的方法，一个init
MedicineRegistration.prototype = {
    init: function () {

    },


//save方法
//需要传入药品name，code，indications，adr，manufacturer四个参数
    save: function (name, code, indications, adr) {
        code = code.trim();
        name = name.trim();
        indications = indications.trim();
        adr = adr.trim();
        //空字符串处理:nn都不能为空
        if (name === "" || code === "" || indications === "" || adr === "") {
            throw new Error("登记药品时，药品名称，编码，适应症，不良反应，生产商都不能为空");
        }
        //因为上传文件大小有限制，所以暂时设定为此
        if (indications.length > 64 || adr.length > 64) {
            throw new Error("药品适应症和不良反应描述过长，描述请简洁明了")
        }

        //自动获取当前登陆的钱包地址
        var from = Blockchain.transaction.from;
        var medicineInfo = this.medicine.get(name);
        //如果药品名称已存在
        if (medicineInfo) {
            throw new Error("此药品已被注册");
        }
        //创建一个medicineinfo对象
        medicineInfo = new MedicineInfo();
        medicineInfo.code = code;
        medicineInfo.name = name;
        medicineInfo.indications = indications;
        medicineInfo.adr = adr;
        medicineInfo.manufacturer = from;
        //保存
        this.medicine.put(name, medicineInfo);
    },

//get方法
//需要传入参数，name
    get: function (name) {
        name = name.trim();
        if (name === "") {
            throw new Error("药品名称为空")
        }
        return this.medicine.get(name)
    }

};

//导出
module.exports = MedicineRegistration;
