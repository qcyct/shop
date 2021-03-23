var express = require('express');
var router = express.Router();
let upload = require('../util/multer/index')
var moment = require('moment');
const rp = require('request-promise-native');
const { USER, ACTIVITYIMG, SALER, GOODS } = require('../mysql/database')
let { formateDate, urlf2z, urlf2zList, getDay, getOrderBysalerId, getFilterList, getBase64, setBase64, isgender } = require('../util.js');
let { GetopenID_Url, appId, AppSecret, GETIMGSLIDEINDEX, GETIMGSLIDEFLASH, GETIMGSLIDEHOT } = require('../config');
let { isUser, addUser, updataUser, GetUsersById, GetactivityimgList, getNoticeList, getFlashList, getCategoryinfoIndex,
  getCategoryList, getGoodsInfoByType, getCouponCount, GetCouponList, addCouponByUser, getbeginMoneyUser, userRecharge,
  getCouponByUser, getGoodsById, getGoodsCoupon, getAddressList, AddaddressUser, getAddressById, UpadtaaddressUser, DeleteaddressUser,
  updataAlladdress, getAddressBydefault, getGoodsInfoById, getCouponBygoods, getMoney, addOrder, Recharge, UpdateGoodsCard, getOrderListcompleted,
  getGoodsInfFlashoById, getFlashListById, deleteCoupon, getGoodsInfoByName
} = require('../mysql/users')
let { getOrdersList, GetGoodsById } = require('../mysql/saler')
/**
 * 所有关于用户的请求接口
 */
const methodsToken = [
  '/userInfoInit',
  '/userInfoById',
  '/addCouponByUser',
  '/getbeginMoneyUser',
  '/userRecharge',
  '/getCouponByUser',
  '/getAddressList',
  '/AddaddressUser',
  '/getAddressBydefault',
  '/getGoodsInfoCardById',
  '/shopping',
  '/getOrderListcompleted'
];


router.post("*", (req, res, next) => {
  // 判断token是否存在
  if (methodsToken.indexOf(req.url) >= 0) {
    // 获取用户token
    let userToken = req.body.userToken;
    if (!userToken) {
      return res.json({
        code: 0,
        data: "请先登录"
      });
    } else {
      let userId = setBase64(userToken);
      req.body.userId = userId;
    }
  }
  next();
})
/**
 *  获取openid
 */
router.post('/login', async (req, res, next) => {
  let url = `${GetopenID_Url}appid=${appId}&secret=${AppSecret}&js_code=${req.body.code}&grant_type=authorization_code`;
  let userCode = await rp({
    method: 'GET', url, json: true
  })
  let isUserInfo = await isUser({
    openid: userCode.openid
  })
  if (isUserInfo.length) {
    res.json({
      code: 1,
      data: {
        Token: getBase64(isUserInfo[0].userId)
      }
    })
  } else {
    let data = await addUser({
      openid: userCode.openid,
      session_key: userCode.session_key
    })
    res.json({
      code: 1,
      data: {
        Token: getBase64(data.insertId)
      }
    })
  }
});
/**
 *   修改初始信息并返回用户信息
 */
router.post('/upinfoLogin', async (req, res, next) => {
  let { nickName, gender, country, avatarUrl, userId, Token } = req.body;
  userId = setBase64(Token)
  await updataUser(userId, {
    userName: nickName,
    userSex: isgender(gender),
    userCountry: country,
    userUrl: avatarUrl
  })
  let data = await GetUsersById(userId);
  res.json({
    code: 1,
    data
  })
})
/**
 * 同步用户数据
 */
router.post('/userInfoInit', async (req, res, next) => {
  let { nickName, gender, country, avatarUrl, userId } = req.body;
  await updataUser(userId, {
    userName: nickName,
    userSex: isgender(gender),
    userCountry: country,
    userUrl: avatarUrl
  })
  let data = await GetUsersById(userId);
  res.json({
    code: 1,
    data
  })
})
/**
 * 返回用户信息
 */
router.post('/userInfoById', async (req, res, next) => {
  let { userId } = req.body;
  let data = await GetUsersById(userId);
  res.json({
    code: 1,
    data
  })
})
/**
 * 返回首页轮播图
 */
router.get('/GetimgSlideIndex', async (req, res, next) => {
  let data = await GetactivityimgList({
    activityimgtype: GETIMGSLIDEINDEX
  })
  res.json({
    code: 1,
    data
  })
})
/**
 * 返回首页通知
 */
router.get('/getNoticeListIndex', async (req, res, next) => {
  let data = await getNoticeList();
  let noticeList = [];
  data[0].forEach(dataItem => {
    noticeList.push({
      type: SALER,
      title: `${dataItem.salerName}商铺成功入驻平台`,
      id: dataItem.salerId,
      time: moment(dataItem.salerTime).format('YYYY-MM-DD')
    })
  })
  data[1].forEach(dataItem => {
    noticeList.push({
      type: GOODS,
      title: `${dataItem.goodsName}商品成功添加到平台`,
      id: dataItem.goodsId,
      time: moment(dataItem.goodsTime).format('YYYY-MM-DD')
    })
  })
  res.json({
    code: 1,
    data: noticeList
  })
})
/**
 * 返回首页轮播图
 */
router.get('/getimgSlideDataFlash', async (req, res, next) => {
  let data = await GetactivityimgList({
    activityimgtype: GETIMGSLIDEFLASH
  })
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取秒杀信息
 */
router.get('/getFlashList', async (req, res, next) => {
  let data = await getFlashList()
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取今日热销的轮播图
 */
router.get('/getimgSlideDataHot', async (req, res, next) => {
  let data = await GetactivityimgList({
    activityimgtype: GETIMGSLIDEHOT
  })
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取今日热销商品
 */
router.get('/gethotSaleList', async (req, res, next) => {
  let startDay = moment().format('YYYY-MM-DD');
  let data = await getOrdersList();
  let arrListByDay = [];
  let WeekDayList = [];
  data.forEach((item) => {
    if (moment(item.time).isSame(startDay, 'day')) {
      WeekDayList.push(item);
    }
  })
  WeekDayList.forEach(item => {
    let itemContent = {}
    itemContent = JSON.parse(item.content);
    itemContent.forEach(itemOrders => {
      console.log(itemOrders)
      if (arrListByDay.some(dayListitem => dayListitem.goodsId == itemOrders.goodsId)) {
        (arrListByDay.find(dayListitem => {
          return dayListitem.goodsId == itemOrders.goodsId
        })).count += Number(itemOrders.count)
      } else {
        arrListByDay.push({
          goodsId: itemOrders.goodsId,
          count: Number(itemOrders.count)
        })
      }
    })
  })
  arrListByDay = arrListByDay.sort((b, a) => {
    return a.count - b.count
  })
  await new Promise(async (resolve, reject) => {
    let promiseList = arrListByDay.map((item) => {
      return new Promise(async (res, rej) => {
        let goodsInfo = await GetGoodsById(item.goodsId)
        item.goodsImg = goodsInfo[0].goodsImg
        item.goodsNum = goodsInfo[0].goodsNum;
        item.goodsSale = goodsInfo[0].goodsSale;
        item.goodsPayNum = goodsInfo[0].goodsPayNum;
        item.goodsName = goodsInfo[0].goodsName;
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })
  res.json({
    code: 1,
    data: arrListByDay
  })
})
/**
 * 获取首页商品分类
 */
router.get('/getCategoryinfoIndex', async (req, res, next) => {
  let data = await getCategoryinfoIndex();
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取首页热门商品
 */
router.get('/getGoodsDataIndex', async (req, res, next) => {
  let data = await getOrdersList();
  let arrListByDay = [];
  data.forEach(item => {
    let itemContent = {}
    itemContent = JSON.parse(item.content);
    itemContent.forEach(itemOrders => {
      if (arrListByDay.some(dayListitem => dayListitem.goodsId == itemOrders.goodsId)) {
        (arrListByDay.find(dayListitem => {
          return dayListitem.goodsId == itemOrders.goodsId
        })).count += Number(itemOrders.count)
      } else {
        arrListByDay.push({
          goodsId: itemOrders.goodsId,
          count: Number(itemOrders.count)
        })
      }
    })
  })
  arrListByDay.sort((a, b) => {
    return b.count - a.count
  })
  arrListByDay = arrListByDay.splice(0, 9)
  await new Promise(async (resolve, reject) => {
    let promiseList = arrListByDay.map((item) => {
      return new Promise(async (res, rej) => {
        let goodsInfo = await GetGoodsById(item.goodsId)
        item.goodsImg = goodsInfo[0].goodsImg
        item.goodsNum = goodsInfo[0].goodsNum;
        item.goodsSale = goodsInfo[0].goodsSale;
        item.goodsPayNum = goodsInfo[0].goodsPayNum;
        item.goodsName = goodsInfo[0].goodsName;
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })
  res.json({
    code: 1,
    data: arrListByDay
  })
})
/**
 *  获取分类页面信息
 */
router.get('/getCategoryList', async (req, res, next) => {
  let data = await getCategoryList();
  let mainArray = []
  data[0].forEach(item => {
    let list = []
    data[1].forEach(type => {
      if (type.categoryId == item.categoryId) {
        list.push(type)
      }
    })
    mainArray.push({
      title: item.categoryName,
      list: list
    })
  })
  res.json({
    code: 1,
    leftArray: data[0],
    mainArray: mainArray
  })
})
/**
 * 根据类型获取相似商品
 */
router.post('/getGoodsInfoByType', async (req, res, next) => {
  let { searchKey, type } = req.body;
  let data = null;
  switch (type) {
    case 'category':
      data = await getGoodsInfoByType({
        goodsType: searchKey[0],
        goodsTypeTwo: searchKey[1]
      });
      break;
    case 'bygoodsName':
      data = await getGoodsInfoByName({
        goodsName: searchKey[0]
      });
      break;
    default:
      break;
  }
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取优惠卷信息
 */
router.post('/getCouponList', async (req, res, next) => {
  let { page, limit } = req.body;
  limit = Number(limit);
  let count = await getCouponCount();
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 0,
      data: []
    });
  }
  var num = (page - 1) * limit;
  let data = await GetCouponList(num, limit);
  data.data = data.data.filter(item => moment().isBefore(item.endTime))
  data.data.forEach(item => {
    item.startTime = moment(item.startTime).format('YYYY-MM-DD')
    item.endTime = moment(item.endTime).format('YYYY-MM-DD')
  })
  res.json({
    code: 1,
    data: data.data,
    count: data.count
  })
})
/**
 * 用户领取优惠卷
 */
router.post('/addCouponByUser', async (req, res, next) => {
  let { userId, couponId } = req.body;
  let info = await addCouponByUser({
    userId, couponId
  })
  if (!info.affectedRows) {
    return res.json({
      code: 0,
      data: "不能重复领取优惠卷"
    })
  } else {
    res.json({
      code: 1,
      data: "领取成功"
    })
  }
})
/**
 * 获取用户余额
 */
router.post('/getbeginMoneyUser', async (req, res, next) => {
  let { userId } = req.body;
  let data = await getbeginMoneyUser(userId)
  res.json({
    code: 1,
    data: data[0]
  })
})
/**
 * 充值
 */
router.post('/userRecharge', async (req, res, next) => {
  let { userId, Money } = req.body;
  let data = await userRecharge(userId, {
    Money
  })
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取用户优惠卷信息
 */
router.post('/getCouponByUser', async (req, res, next) => {
  let { userId } = req.body;
  let data = await getCouponByUser(userId);
  let couponValidList = [];
  let couponinvalidList = [];
  data.forEach(item => {
    item.startTime = moment(item.startTime).format('YYYY-MM-DD')
    item.endTime = moment(item.endTime).format('YYYY-MM-DD')
    item.time = moment(item.time).format('YYYY-MM-DD')
    if (moment().isAfter(item.endTime)) {
      couponinvalidList.push(item)
    } else {
      couponValidList.push(item)
    }
  })
  res.json({
    code: 1,
    data: {
      couponValidList,
      couponinvalidList
    }
  })
})
/**
 * 获取商品的详细信息
 */
router.post('/getGoodsById', async (req, res, next) => {
  let { goodsId, isflash } = req.body;
  if (isflash) {
    let data = await getGoodsInfFlashoById(goodsId);
    data.goodImgList = JSON.parse(data.goodImgList);
    data.goodsNumber = JSON.parse(data.goodsNumber)
    data.goodsFactory = data.goodsSale;
    data.goodsSale = data.flashMon;
    res.json({
      code: 1,
      data
    })
  } else {
    let data = await getGoodsById(goodsId);
    data.goodImgList = JSON.parse(data.goodImgList);
    data.goodsNumber = JSON.parse(data.goodsNumber)
    res.json({
      code: 1,
      data
    })
  }
})
/**
 * 获取指定商品的优惠卷
 */
router.post('/getGoodsCoupon', async (req, res, next) => {
  let { goodsId } = req.body;
  let data = await getGoodsCoupon(goodsId);
  data.forEach(item => {
    item.startTime = moment(item.startTime).format('YYYY-MM-DD')
    item.endTime = moment(item.endTime).format('YYYY-MM-DD')
  })
  data = data.filter(item => moment().isBefore(item.endTime))
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取指定用户的收获地址
 */
router.post('/getAddressList', async (req, res, next) => {
  let { userId } = req.body;
  let data = await getAddressList(userId);
  data.forEach(item => {
    item.isDefault = Boolean(item.isDefault)
    item.region = JSON.parse(item.region)
  })
  res.json({
    code: 1,
    data
  })
})
/**
 * 添加收获地址
 */
router.post('/AddaddressUser', async (req, res, next) => {
  let { userId, addressName, addresstel, isDefault, detailed, region } = req.body;
  let { insertId } = await AddaddressUser({
    userId, addressName, addresstel, isDefault: Number(isDefault), detailed, region: JSON.stringify(region)
  })
  if (isDefault) {
    await updataAlladdress(insertId, {
      isDefault: 0
    })
  }
  res.json({
    code: 1,
    data: "添加成功"
  })
})
/**
 * 获取指定id的收货地址信息
 */
router.post('/getAddressById', async (req, res, next) => {
  let { addressId } = req.body;
  let data = await getAddressById(addressId)
  data.region = JSON.parse(data.region)
  data.isDefault = Boolean(data.isDefault)
  res.json({
    code: 1,
    data
  })
})
/**
 * 修改地址信息
 */
router.post('/UpadtaaddressUser', async (req, res, next) => {
  let { addressId, addressName, addresstel, isDefault, detailed, region } = req.body;
  await UpadtaaddressUser(addressId, {
    addressName, addresstel, isDefault: Number(isDefault), detailed, region: JSON.stringify(region)
  });
  if (isDefault) {
    await updataAlladdress(addressId, {
      isDefault: 0
    })
  }
  res.json({
    code: 1,
    data: "修改成功"
  })
})
/**
 * 删除地址信息
 */
router.post('/DeleteaddressUser', async (req, res, next) => {
  let { addressId } = req.body;
  await DeleteaddressUser(addressId);
  res.json({
    code: 1,
    data: "删除成功"
  })
})
/**
 * 获取默认收获地址
 */
router.post('/getAddressBydefault', async (req, res, next) => {
  let { userId } = req.body;
  let data = await getAddressBydefault(userId)
  data.region = JSON.parse(data.region)
  data.isDefault = Boolean(data.isDefault)
  res.json({
    code: 1,
    data
  })
})
/**
 * 获取商品的详细信息
 */
router.post('/getGoodsInfoById', async (req, res, next) => {
  let { goodsId, isflash } = req.body;
  if (isflash) {
    let data = await getGoodsInfFlashoById(goodsId);
    data.goodImgList = JSON.parse(data.goodImgList);
    data.goodsNumber = JSON.parse(data.goodsNumber)
    data.goodsFactory = data.goodsSale;
    data.goodsSale = data.flashMon;
    res.json({
      code: 1,
      data
    })
  } else {
    let data = await getGoodsInfoById(goodsId);
    data.goodImgList = JSON.parse(data.goodImgList);
    data.goodsNumber = JSON.parse(data.goodsNumber)
    res.json({
      code: 1,
      data
    })
  }
})
/**
 * 获取商品信息和用户对应的优惠卷
 */
router.post('/getGoodsInfoCardById', async (req, res, next) => {
  let { goodsId, userId, isflash } = req.body;
  let data = null;
  if (isflash) {
    data = await getGoodsInfFlashoById(goodsId);
    data.goodsFactory = data.goodsSale;
    data.goodsSale = data.flashMon;
  } else {
    data = await getGoodsInfoById(goodsId);
  }
  let coupon = await getCouponBygoods(data.goodsId, userId)
  coupon = coupon.filter(item => moment().isBefore(item.endTime))
  coupon.forEach(item => {
    item.startTime = moment(item.startTime).format('YYYY-MM-DD')
    item.endTime = moment(item.endTime).format('YYYY-MM-DD')
    item.time = moment(item.time).format('YYYY-MM-DD')
  })
  data.coupon = coupon
  data.goodImgList = JSON.parse(data.goodImgList);
  data.goodsNumber = JSON.parse(data.goodsNumber)
  data.goodsTime = moment(data.goodsTime).format('YYYY-MM-DD')
  res.json({
    code: 1,
    data
  })
})
/**
 * 购买商品
 */
router.post('/shopping', async (req, res, next) => {
  let { userId, goodsMoney, content, address, couponListInfo } = req.body;
  let Money = await getMoney(userId)
  if (goodsMoney > Money) {
    return res.json({
      code: 0,
      data: "你的余额不足"
    });
  }
  await new Promise(async (resolve, reject) => {
    let promiseList = couponListInfo.map((item) => {
      return new Promise(async (res, rej) => {
        await deleteCoupon(item)
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  await Recharge(userId, {
    Money: -(goodsMoney)
  })

  await new Promise(async (resolve, reject) => {
    let promiseList = content.map((item) => {
      return new Promise(async (res, rej) => {
        await UpdateGoodsCard(item.goodsId, {
          count: item.count
        })
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })
  let contentStr = content.map(item => {
    return {
      goodsId: item.goodsId,
      goodsName: item.goodsName,
      count: item.count,
      money: item.count * Number(item.goodsInfo.goodsSale),
      goodsNumber:item.goodsNumber,
      salerId: item.goodsInfo.salerId
    }
  })
  await addOrder({
    userId, content: JSON.stringify(contentStr), money: goodsMoney, address
  })

  res.json({
    code: 1,
    data: "购买成功"
  })
})
/**
 * 获取订单成功
 */
router.post('/getOrderListcompleted', async (req, res, next) => {
  let { userId, type } = req.body
  let data = await getOrderListcompleted(userId)
  let arrList = []
  data.forEach(item => {
    let itemContent = {}
    itemContent = JSON.parse(item.content);
    itemContent.forEach(itemOrders => {
      if (type == 1) {
        if (itemOrders.isDeliver == 1) {
          return
        }
      } else if (type == 2) {
        if (itemOrders.isDeliver != 1) {
          return;
        }
      }
      let orderType = 'unreceived'
      if (itemOrders.isDeliver) {
        orderType = 'back'
      } else {
        orderType = 'unreceived'
      }
      arrList.push({
        orderId: item.orderId,
        time: moment(item.time).format('YYYY-MM-DD'),
        money: itemOrders.money,
        address: item.address,
        type: orderType,
        goodsId: itemOrders.goodsId,
        count: Number(itemOrders.count),
        goodsName: itemOrders.goodsName,
        salerId: itemOrders.salerId
      })
    })
  })
  await new Promise(async (resolve, reject) => {
    let promiseList = arrList.map((item) => {
      return new Promise(async (res, rej) => {
        let goodsInfo = await GetGoodsById(item.goodsId)
        item.goodsImg = goodsInfo[0].goodsImg
        item.goodsNum = goodsInfo[0].goodsNum;
        item.goodsSale = goodsInfo[0].goodsSale;
        item.goodsPayNum = goodsInfo[0].goodsPayNum;
        item.goodsName = goodsInfo[0].goodsName;
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  res.json({
    code: 1,
    data: arrList
  })
})
/**
 * 判断是否属于热门商品
 */
router.post('/isFlashGoods', async (req, res, next) => {
  let { goodsId } = req.body;
  let now = moment();
  let start = null;
  let end = null;
  let data = await getFlashListById(goodsId)
  let flog = 0;
  if (data.length > 0) {
    let timeData = moment(data[0].flashtime, "HH:mm").minutes(0);
    for (let i = 0; i <= 23; i += 2) {
      start = moment().hour(i).minutes(0);
      end = moment().hour(i + 2).minutes(0).subtract(1, 'second');
      if (now.isBetween(start, end) && timeData.isBetween(start, end)) {
        flog = 1
        break;
      }
    }
    res.json({
      code: 1,
      data: flog
    })
  } else {
    res.json({
      code: 1,
      data: flog
    })
  }
})
/**
 * 删除优惠卷信息 
 */
router.post('/deleteCoupon', async (req, res, next) => {
  let { couponId } = req.body;
  await deleteCoupon(couponId)
  res.json({
    code: 1,
    data: "删除成功"
  })
})
module.exports = router;
