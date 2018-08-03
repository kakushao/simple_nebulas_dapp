$(document).ready(function () {
    var NebPay = require("nebpay");
    var nebPay = new NebPay();

    if (typeof(webExtensionWallet) === "undefined") {
        $("#noExtension").removeClass("hide")
    } else {
        $("#search").attr("disabled", false)
        $("#register").attr("disabled", false)
    }

    var nebulas = require("nebulas"),
        Account = nebulas.Account,
        neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
    var api = neb.api;
    var dappAddress = "n1nooarMncaiqxpMksKVeRAPLEnpckiDpJz";

    $("#search").click(function () {
        var from = "n1RNvkvTrM5BM1hd3JF11K34zuRHocSaCba";
        var callFunction = "get";
        var callArgs = "[\"" + $("#medicineName").val() + "\"]";

        api.call({
            from: from,
            to: dappAddress,
            value: 0,
            nonce: 0,
            gasPrice: 1000000,
            gasLimit: 2000000,
            contract: {
                function: callFunction,
                args: callArgs
            }
        }).then(function (resp) {
            console.log("数据查询完成\n")
            console.log(resp)

            $("#registration").addClass("hide")

            if (resp["result"] != "null") {
                result = JSON.parse(resp["result"]);
                console.log(result);
                $("#resName").html(result.name);
                $("#resCode").html(result.code);
                $("#resIndications").html(result.indications);
                $("#resManufacture").html(result.adr);
                $("#searchRes").removeClass("hide");
            } else {
                $("#searchRes").addClass("hide")
                $("#registration").removeClass("hide");
            }
        }).catch(function (err) {
            console.log("error:" + err)
        })
    });

    //点击添加数据
    $("#register").click(function () {
        var api = neb.api;
        var to = dappAddress;
        var value = "0";
        var callFunction = "save"
        var callArgs = '["'
            + $("#inputName").val() + '","'
            + $("#inputCode").val() + '","'
            + $("#inputIndications").val() + '","'
            + $("#inputManufacture").val()
            + '"]';
        nebPay.call(to, value, callFunction, callArgs, {
            listener: saveCall
        });
    });

    function saveCall(resp) {
        var stateQuery = setInterval(function () {
            api.getTransactionReceipt({hash: resp["txhash"]}).then(function (receipt) {
                if (receipt["status"] == 2) {
                    console.log("正在提交。。。");
                } else if (receipt["status"] == 1) {
                    alert("注册成功");
                    clearInterval(stateQuery);
                } else {
                    alert("交易失败");
                    clearInterval(stateQuery);
                }

            }).catch(function (err) {
                console.log(err);
            });
        }, 5000);
    }


})