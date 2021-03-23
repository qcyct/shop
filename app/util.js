//格式化显示日期
exports.formateDate = function (datetime) {
    function addDateZero(num) {
        return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    return formatdatetime;
}

function urlf2z(url) {
    return url.replace(/\\/ig, '/');
}

//上传图片的地址
function getUrlImg(req) {
    let url = "";
    url = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
    return url;
}

//上传多张图片的地址集合
function urlf2zList(req) {
    if (req.files) {
        let files = req.files;
        let urlList = [];
        urlList = files.map(file => {
            return urlf2z(`${req.protocol}://${req.headers.host}/${file.path}`)
        })
        return urlList;
    }

}

function getDay(num) {
    return '星期' + ['一', '二', '三', '四', '五', '六', '日'][num];
}

exports.urlf2z = urlf2z;
exports.urlf2zList = urlf2zList;
exports.getUrlImg = getUrlImg;
exports.getDay = getDay;
//数据方法
exports.sqlUpdateStr = function (sql, data) {
    Object.entries(data).forEach(item => {
        if (item[1] === '' || item[1] === null || item[1] === undefined) {
            return;
        }
        sql += (sql.toString() ? "," : "");
        sql += `${item[0]}='${item[1]}'`
    })
    return sql;
}

exports.sqlAddStr = function (data) {
    let vals = [];
    let keys = Object.keys(data);
    Object.entries(data).forEach(item => {
        if (keys.includes(item[0])) {
            vals.push(JSON.stringify(item[1]));
        }
    })
    return {
        keys: keys.join(","),
        vals: vals.join(",")
    };
}

exports.sqlSelectStr = function (condition, like) {
    Object.entries(like).forEach((item) => {
        if (item[1] != undefined && item[1] != "") {
            if (!String(condition).length) {
                condition += " where "
            } else {
                condition += " and "
            }
            condition += `${item[0]} like '%${item[1]}%'`
        }
    })
    return condition;
}

//数据库搜索语句
exports.sqlWhereStr = function (sql, data) {
    Object.entries(data).forEach((item) => {
        if (item[1] != undefined && item[1] != "") {
            if (!String(sql).length) {
                sql += " where "
            } else {
                sql += " and "
            }
            sql += `${item[0]}='${item[1]}'`
        }
    })
    return sql;
}

//控制层方法，获取订单信息
exports.getOrderBysalerId = function (data, salerId) {
    let arrListByDay = [];
    let orderTableId = 0;
    data.forEach(orderItem => {
        let itemContent = {}
        itemContent = JSON.parse(orderItem.content);
        itemContent.forEach(itemOrders => {
            if (itemOrders.salerId != salerId) {
                return;
            }
            arrListByDay.push({
                goodsId: itemOrders.goodsId,
                count: Number(itemOrders.count),
                goodsName: itemOrders.goodsName,
                goodsNumber: itemOrders.goodsNumber,
                money: itemOrders.money,
                salerId: itemOrders.salerId,
                time: orderItem.time,
                orderId: orderItem.orderId,
                address: orderItem.address,
                userId: orderItem.userId,
                isDeliver: itemOrders.isDeliver || 0,
                orderTableId: ++orderTableId
            })
        })
    })
    return arrListByDay;
}

exports.getFilterList = function (data, num = 0, limit = 0, like = {}) {
    let FilterList = [];
    FilterList = data.filter(item => {
        return Object.entries(like).every(LikeItem => {
            if (LikeItem[1] != undefined && LikeItem[1] != "") {
                return (String(item[LikeItem[0]]).indexOf(String(LikeItem[1])) != -1)
            } else {
                return true;
            }
        });
    })
    return FilterList.slice(num, limit);
}

exports.getFilterListByLike = function (data, like = {}) {
    let FilterList = [];
    FilterList = data.filter(item => {
        return Object.entries(like).every(LikeItem => {
            if (LikeItem[1] != undefined && LikeItem[1] != "") {
                return (String(item[LikeItem[0]]) == String(LikeItem[1]))
            } else {
                return true;
            }
        });
    })
    return FilterList[0];
}

//用户小程序方法/
exports.getBase64 = function (val) {
    val = val.toString();
    var bc = new Buffer.from(val);
    var bec = bc.toString("base64");
    return bec;
}
exports.setBase64 = function (val) {
    // val = String(val);
    var bdc = new Buffer.from(val, "base64");
    var bdcs = bdc.toString();
    return bdcs;
}
//处理性别
exports.isgender = function (gender) {
    if (gender == 0) {
        return "未知"
    } else if (gender == 1) {
        return "男"
    } else if (gender == 2) {
        return "女"
    }
}
//打乱数组排序
function shuffle(arr) {
    var length = arr.length,
        randomIndex,
        temp;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr;
}
