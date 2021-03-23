var express = require('express');
var router = express.Router();
let { formateDate, urlf2z, urlf2zList, getDay, getOrderBysalerId, getFilterList, getFilterListByLike } = require('../util.js');
const { SALER, ORDERS, GOODS, USER, COUPON, FLASH } = require('../mysql/database')
var moment = require('moment');
let { isSalerLogin, getOrdersList, getGoodsCount, GetGoodsList, GetGoodsById, DeleteGoodsById, UpdateGoods, addGoods, GetUsersById,
    GetSalerById, UpdateSalerById, getCouponCount, GetCouponList, GetCouponById, DeleteCouponById, GetGoodsListAll, addCoupon, UpdateCoupon,
    getFlashCount, GetFlasList, GetFlashById, DeleteFlashById, addFlash, UpdateFlash, getOrdersById, updataDeliver
} = require('../mysql/saler')
let upload = require('../util/multer/index')

//本周销售订单表
router.get('/getOrdersBysalerIdCharsOne', async (req, res, next) => {
    let startWeek = moment().isoWeekday(1).format('YYYY-MM-DD');
    let endWeek = moment().isoWeekday(7).format('YYYY-MM-DD');
    let DayList = [];
    let MonarrList = [];
    let NumarrList = [];
    for (var i = 1; i <= 7; i++) {
        DayList.push(moment().isoWeekday(i))
    }
    let id = req.session.AdminInfo.userId;
    let data = await getOrdersList();
    let OrdersItem = [];
    data.forEach(dataItem => {
        let itemContent = JSON.parse(dataItem.content);
        itemContent.forEach(item => {
            if (item.salerId == id) {
                OrdersItem.push({
                    orderId: dataItem.orderId,
                    userId: dataItem.userId,
                    content: item,
                    time: dataItem.time,
                    money: Number(item.count) * Number(item.money)
                })
            }
        })
    })
    data = OrdersItem;
    let WeekDayList = [];
    data.forEach((item) => {
        if (moment(item.time).isBetween(startWeek, endWeek)) {
            WeekDayList.push(item);
        }
    })
    DayList.forEach((dayItem, index) => {
        let sumMon = 0;
        let sunNum = 0;
        WeekDayList.forEach(item => {
            if (dayItem.isSame(item.time, 'day')) {
                sumMon += Number(item.money);
                sunNum++;
            }
        })
        MonarrList.push(sumMon);
        NumarrList.push(sunNum);
    })
    res.json({
        code: 1,
        MonarrList: MonarrList,
        NumarrList: NumarrList
    })
});

//本周热销商品入围数量表
router.get('/getOrdersBysalerIdCharsTwo', async (req, res, next) => {
    let startWeek = moment().isoWeekday(1).format('YYYY-MM-DD');
    let endWeek = moment().isoWeekday(7).format('YYYY-MM-DD');
    let DayList = [];
    let arrListByDay = [];
    let WeekDayList = [];
    let CharsTwoData = [];
    for (var i = 1; i <= 7; i++) {
        DayList.push(moment().isoWeekday(i))
    }
    let id = req.session.AdminInfo.userId;
    let data = await getOrdersList();
    data.forEach((item) => {
        if (moment(item.time).isBetween(startWeek, endWeek)) {
            WeekDayList.push(item);
        }
    })
    DayList.forEach((dayItem, index) => {
        let dayList = []
        WeekDayList.forEach(item => {
            if (dayItem.isSame(item.time, 'day')) {
                let itemContent = {}
                itemContent = JSON.parse(item.content);
                itemContent.forEach(itemOrders => {
                    if (dayList.some(dayListitem => dayListitem.goodsId == itemOrders.goodsId)) {
                        (dayList.find(dayListitem => {
                            return dayListitem.goodsId == itemOrders.goodsId
                        })).count += Number(itemOrders.count)
                    } else {
                        dayList.push({
                            goodsId: itemOrders.goodsId,
                            count: Number(itemOrders.count),
                            salerId: itemOrders.salerId
                        })
                    }
                })
            }
        })
        arrListByDay.push(dayList);
    })

    CharsTwoData = arrListByDay.map(item => {
        item.sort((a, b) => {
            return a.count < b.count
        })
        let indexCount = 0;
        item.slice(0, 3).forEach(val => {
            if (val.salerId == id) {
                indexCount++;
            }
        })
        return indexCount;
    })
    res.json({
        code: 1,
        CharsTwoData
    })
})

//获取本周销售冠军
router.get('/getOrdersBysalerIdchampion', async (req, res, next) => {
    let id = req.session.AdminInfo.userId;
    let startWeek = moment().isoWeekday(1).format('YYYY-MM-DD');
    let endWeek = moment().isoWeekday(7).format('YYYY-MM-DD');
    let WeekDayList = [];
    let arrListByDay = [];
    let data = await getOrdersList();
    data.forEach((item) => {
        if (moment(item.time).isBetween(startWeek, endWeek)) {
            WeekDayList.push(item);
        }
    })
    WeekDayList.forEach(item => {
        let itemContent = {}
        itemContent = JSON.parse(item.content);
        itemContent.forEach(itemOrders => {
            if (itemOrders.salerId != id) {
                return;
            }
            if (arrListByDay.some(dayListitem => dayListitem.goodsId == itemOrders.goodsId)) {
                (arrListByDay.find(dayListitem => {
                    return dayListitem.goodsId == itemOrders.goodsId
                })).count += Number(itemOrders.count)
            } else {
                arrListByDay.push({
                    goodsId: itemOrders.goodsId,
                    count: Number(itemOrders.count),
                    goodsName: itemOrders.goodsName
                })
            }
        })
    })
    arrListByDay.sort((a, b) => {
        return a.count < b.count
    })
    res.json({
        code: 1,
        arrListByDay: arrListByDay[0]
    })
})

//获取商品信息
router.get('/GetGoodsList', async (req, res, next) => {
    let { page, limit, goodsId, goodsName, salerId } = req.query;
    limit = Number(limit);
    let count = await getGoodsCount(salerId);
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 0,
            data: []
        });
    }
    var num = (page - 1) * limit;
    let data = await GetGoodsList(salerId, num, limit, {
        goodsId, goodsName
    });
    data.data.forEach(item => {
        item.goodImgList = JSON.parse(item.goodImgList)
        item.goodsNumber = JSON.parse(item.goodsNumber)
    })
    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})

//查询商品信息
router.get('/GetGoodsById', async (req, res, next) => {
    let id = req.query.editNo;
    let data = await GetGoodsById(id);
    data.forEach(item => {
        item.goodImgList = JSON.parse(item.goodImgList)
        item.goodsNumber = JSON.parse(item.goodsNumber)
        item.goodsTime = formateDate(item.goodsTime)
    })
    res.json({
        code: 1,
        data
    })
})

//删除商品
router.post('/DeleteGoodsById', async (req, res, next) => {
    let { goodsId } = req.body;
    await DeleteGoodsById(goodsId);
    res.json({
        code: 1,
        data: "删除成功"
    })
})

//修改商品
router.post('/UpdateGoods', upload.array('goodsImg', 10), async (req, res, next) => {
    let { goodsId, goodsName, goodsSale, goodsFactory, goodsType, goodsNum, goodsPayNum, goodsTypeTwo, goodImgList, goodsNumber } = req.body;
    let goodImgListUpdate = urlf2zList(req);
    goodImgList = JSON.parse(goodImgList);
    goodImgList = goodImgList.concat(goodImgListUpdate);
    let goodsImg = goodImgList[0];
    goodImgList = JSON.stringify(goodImgList);
    if (!goodImgList.length) {
        return res.json({
            code: 0,
            msg: "至少上传一张图片"
        })
    }
    await UpdateGoods(goodsId, {
        goodsName, goodsSale, goodsFactory, goodsType, goodsNum, goodsPayNum, goodsTypeTwo, goodImgList, goodsImg, goodsNumber
    })
    res.json({
        code: 1,
        data: "修改成功"
    })
})

//添加商品
router.post('/addGoods', upload.array('goodsImg', 10), async (req, res, next) => {
    let countFile = req.files.length;
    let { goodsName, goodsSale, goodsFactory, goodsNum, salerId, goodsType, goodsTypeTwo, goodsNumber } = req.body;
    salerId = req.session.AdminInfo.userId;
    if (countFile === 0) {
        return res.json({
            code: 0,
            msg: "至少上传一张图片"
        })
    }
    let goodImgList = urlf2zList(req);
    let goodsImg = goodImgList[0];
    goodImgList = JSON.stringify(goodImgList);
    await addGoods({
        goodsName, goodsSale, goodsFactory, goodsNum, goodsNumber,
        goodsImg: goodsImg,
        goodImgList: goodImgList,
        salerId, goodsType, goodsTypeTwo
    })
    res.json({
        code: 1,
        data: "添加成功"
    })

})

//订单信息
router.get('/GetOrderList', async (req, res, next) => {
    let { page, limit, orderId, salerId } = req.query;
    limit = Number(limit);
    let data = await getOrdersList()
    data = getOrderBysalerId(data, salerId, true)
    let count = data.length;
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 0,
            data: []
        });
    }
    var num = (page - 1) * limit;
    data = getFilterList(data, num, limit, { orderId });
    data.forEach(item => {
        item.time = formateDate(item.time)
    })

    await new Promise(async (resolve, reject) => {
        let promiseList = data.map((item) => {
            return new Promise(async (res, rej) => {
                let user = await GetUsersById(item.userId)
                item.userName = user[0].userName
                res()
            })
        })
        await Promise.all(promiseList)
        resolve()
    })

    await new Promise(async (resolve, reject) => {
        let promiseList = data.map((item) => {
            return new Promise(async (res, rej) => {
                let goodsInfo = await GetGoodsById(item.goodsId)
                item.goodsImg = goodsInfo[0].goodsImg
                res()
            })
        })
        await Promise.all(promiseList)
        resolve()
    })

    res.json({
        code: 0,
        data: data,
        count: data.length
    })
})

//查询订单信息
router.get('/GetOrderListById', async (req, res, next) => {
    let { editNo, salerId } = req.query;
    let data = await getOrdersList()
    data = getOrderBysalerId(data, salerId, true)
    data = getFilterList(data, 0, 1, { orderTableId: editNo });
    data.forEach(item => {
        item.time = formateDate(item.time)
    })
    await new Promise(async (resolve, reject) => {
        let promiseList = data.map((item) => {
            return new Promise(async (res, rej) => {
                let user = await GetUsersById(item.userId)
                item.userName = user[0].userName
                res()
            })
        })
        await Promise.all(promiseList)
        resolve()
    })

    await new Promise(async (resolve, reject) => {
        let promiseList = data.map((item) => {
            return new Promise(async (res, rej) => {
                let goodsInfo = await GetGoodsById(item.goodsId)
                item.goodsImg = goodsInfo[0].goodsImg
                res()
            })
        })
        await Promise.all(promiseList)
        resolve()
    })
    res.json({
        code: 1,
        data
    })
})

//商家信息
router.get('/GetSalerById', async (req, res, next) => {
    let id = req.query.salerId;
    let data = await GetSalerById(id);
    data.forEach(item => {
        item.salerTime = formateDate(item.salerTime)
    })
    res.json({
        code: 1,
        data
    })
})
//修改商家信息
router.post('/UpdateSalerById', upload.single('salerUrl'), async (req, res, next) => {
    let { salerId, salerName, salerIsusing, salerTime, salerPhone, salerAddress, salerUrl } = req.body;
    salerUrl = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
    let data = await UpdateSalerById(salerId, { salerName, salerIsusing, salerTime, salerPhone, salerAddress, salerUrl });
    res.json({
        code: 1,
        data
    })
})
//修改商家密码
router.post('/UpdateSalerPassById', async (req, res, next) => {
    let { oldPsw, newPsw } = req.body;
    let id = req.session.AdminInfo.userId;
    let salerPhone = req.session.AdminInfo.salerPhone;
    let saler = await isSalerLogin({
        salerPhone: salerPhone,
        salerPass: oldPsw
    });
    if (saler.length) {
        await UpdateSalerById(id, {
            salerPass: newPsw
        })
        return res.json({
            code: 200,
            msg: "修改密码成功"
        })
    } else {
        return res.json({
            code: 500,
            msg: "旧密码错误"
        })
    }

})
//优惠券信息
router.get('/GetCouponList', async (req, res, next) => {
    let { page, limit, goodsId, goodsName, couponId, salerId } = req.query;
    limit = Number(limit);
    let count = await getCouponCount(salerId);
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 0,
            data: []
        });
    }
    var num = (page - 1) * limit;
    let data = await GetCouponList(salerId, num, limit, {
        [`${COUPON}.goodsId`]: goodsId, [`${GOODS}.goodsName`]: goodsName, [`${COUPON}.couponId`]: couponId
    });
    data.data.forEach(item => {
        item.startTime = moment(item.startTime).format('YYYY-MM-DD')
        item.endTime = moment(item.endTime).format('YYYY-MM-DD')
    })
    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})
//查询优惠券
router.get('/GetCouponById', async (req, res, next) => {
    let id = req.query.editNo;
    let data = await GetCouponById(id);
    data.forEach(item => {
        item.startTime = moment(item.startTime).format('YYYY-MM-DD')
        item.endTime = moment(item.endTime).format('YYYY-MM-DD')
    })
    res.json({
        code: 1,
        data
    })
})
//删除优惠券
router.post('/DeleteCouponById', async (req, res, next) => {
    let { couponId } = req.body;
    await DeleteCouponById(couponId);
    res.json({
        code: 1,
        data: "删除成功"
    })
})
router.get('/GetGoodsListAll', async (req, res, next) => {
    let { salerId } = req.query;
    let data = await GetGoodsListAll(salerId);

    res.json({
        code: 1,
        data: data.data
    })
})
//添加优惠券
router.post('/addCoupon', upload.none(), async (req, res, next) => {
    let { goodsId, couponMon, couponMin, startTime, endTime, salerId } = req.body;
    salerId = req.session.AdminInfo.userId;
    await addCoupon({
        goodsId, couponMon, couponMin, startTime, endTime, salerId
    })
    res.json({
        code: 1,
        data: "添加成功"
    })
})
//修改优惠券
router.post('/UpdateCoupon', upload.none(), async (req, res, next) => {
    let { couponId, couponMon, couponMin, startTime, endTime, goodsId } = req.body;
    await UpdateCoupon(couponId, { couponMon, couponMin, startTime, endTime, goodsId });
    res.json({
        code: 1,
        data: "修改成功"
    })
})
//秒杀信息
router.get('/GetFlashList', async (req, res, next) => {
    let { page, limit, goodsId, goodsName, flashId, salerId } = req.query;
    limit = Number(limit);
    salerId = 1
    let count = await getFlashCount(salerId);
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 0,
            data: []
        });
    }
    var num = (page - 1) * limit;
    let data = await GetFlasList(salerId, num, limit, {
        [`${FLASH}.goodsId`]: goodsId, [`${GOODS}.goodsId`]: goodsName, [`${FLASH}.flashId`]: flashId
    });
    data.data.forEach(item => {
        item.flashtime = moment(String(item.flashtime), "HH:mm:ss").format('HH:mm')
    })
    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})
//查询秒杀信息
router.get('/GetFlashById', async (req, res, next) => {
    let id = req.query.editNo;
    let data = await GetFlashById(id);
    data.forEach(item => {
        item.flashtime = moment(String(item.flashtime), "HH:mm:ss").format('HH:mm')
    })
    res.json({
        code: 1,
        data
    })
})
//删除秒杀商品
router.post('/DeleteFlashById', async (req, res, next) => {
    let { flashId } = req.body;
    await DeleteFlashById(flashId);
    res.json({
        code: 1,
        data: "删除成功"
    })
})
//添加秒杀商品
router.post('/addFlash', async (req, res, next) => {
    let { goodsId, flashtime, flashNum, flashMon, salerId } = req.body;
    salerId = req.session.AdminInfo.userId;
    flashtime = moment(String(flashtime), "HH:mm:ss").minutes(0).format('HH:mm')
    let info = await addFlash({
        goodsId, flashtime, flashNum, flashMon, salerId
    })
    if (!info.affectedRows) {
        return res.json({
            code: 0,
            data: "不能重复添加商品"
        })
    } else {
        res.json({
            code: 1,
            data: "添加成功"
        })
    }
})
//修改秒杀信息
router.post('/UpdateFlash', async (req, res, next) => {
    let { flashId, goodsId, flashNum, flashMon, flashtime } = req.body;
    flashtime = moment(String(flashtime), "HH:mm:ss").minutes(0).format('HH:mm')
    await UpdateFlash(flashId, { flashNum, flashMon, flashtime, goodsId });
    res.json({
        code: 1,
        data: "修改成功"
    })
})
//提交订单
router.post('/DeliverOrderListById', async (req, res, next) => {
    let { salerId, goodsId, userId, orderId } = req.body;
    let data = await getOrdersById(orderId)
    let goodList = JSON.parse(data[0].content)
    let goodItem = goodList.find(item => item.goodsId == goodsId)
    if (goodItem.isDeliver) {
        res.json({
            code: 0,
            data: "订单已经发货"
        })
    } else {
        goodItem.isDeliver = 1
        await updataDeliver(orderId, {
            content: JSON.stringify(goodList)
        })
        res.json({
            code: 1,
            data: "订单发货成功"
        })
    }
})

module.exports = router;