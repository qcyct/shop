const query = require('./fun')
const sqlCount = 'SQL_CALC_FOUND_ROWS';
const { USER, ACTIVITYIMG, SALER, GOODS, FLASH, CATEGORYINFO, CATEGORY, COUPON, USERCOUPON, ADDRESS, ORDERS } = require('./database')
let { sqlUpdateStr, sqlAddStr, sqlSelectStr, sqlWhereStr } = require('../util.js');
/**
 * 所有请求方法
 */
/**
 * 判断是否存在用户
 */
function isUser(data) {
    return new Promise((resolve, reject) => {
        query(`select  * from ${USER} where openid=?`, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加用户
 */
function addUser(data) {
    return new Promise((resolve, reject) => {
        query(`INSERT INTO ${USER} (userId,openid,session_key) VALUES(null,?,?) `, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 修改用户信息
 */
function updataUser(userId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        Object.entries(data).forEach(item => {
            if (sql.toString()) {
                sql += ',';
            }
            sql += `${item[0]}='${item[1]}'`
        })
        query(`UPDATE ${USER} SET ${sql} WHERE userId=${userId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据用户的id返回用户信息
 */
function GetUsersById(id) {
    return new Promise((resolve, reject) => {
        query(`select userName,userUrl,beginMoney,usercontent,userCountry,userSex from ${USER} where userId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 主页轮播图
 */
function GetactivityimgList(data) {
    let sql = '';
    sql = sqlWhereStr(sql, data)
    return new Promise((resolve, reject) => {
        query(`select * from ${ACTIVITYIMG} ${sql} `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取公告信息
 */
function getNoticeList() {
    return new Promise((resolve, reject) => {
        query([`select * from ${SALER} where to_days(salerTime) = to_days(now())`, `select * from ${GOODS} where to_days(goodsTime) = to_days(now())`])
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取秒杀信息
 */
function getFlashList() {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition += ` where ${GOODS}.goodsId=${FLASH}.goodsId `
        query(`select  ${sqlCount}  ${FLASH}.*,${GOODS}.* from ${FLASH},${GOODS}  ${condition}`)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取首页商品分类
 */
function getCategoryinfoIndex() {
    return new Promise((resolve, reject) => {
        query(`select  * from ${CATEGORYINFO} limit 0,10`)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取分类页面信息
 */
function getCategoryList() {
    return new Promise((resolve, reject) => {
        query([`select * from ${CATEGORY}`, `select * from ${CATEGORYINFO}`])
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据类型获取相似商品
 */
function getGoodsInfoByType(data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlWhereStr(sql, data)
        query(`select * from ${GOODS} ${sql} `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取所有优惠卷数目
 */
function getCouponCount() {
    return new Promise((resolve, reject) => {
        query(`select count(couponId) as counts from ${COUPON}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取所有优惠卷
 */
function GetCouponList(num, limit) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition += ` where ${GOODS}.goodsId=${COUPON}.goodsId `
        query(`select  ${sqlCount}  ${COUPON}.*,${GOODS}.goodsName from ${COUPON},${GOODS}  ${condition}  limit ?,?`, { num, limit }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 用户领取优惠卷
 */
function addCouponByUser(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT ignore INTO ${USERCOUPON}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取用户余额
 */
function getbeginMoneyUser(userId) {
    return new Promise((resolve, reject) => {
        query(`select beginMoney from ${USER} where userId=?`, { userId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 用户充值
 */
function userRecharge(userId, data) {
    return new Promise((resolve, reject) => {
        let sql = `beginMoney=beginMoney+${data.Money}`;
        query(`UPDATE ${USER} SET ${sql} WHERE userId=${userId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取用户的优惠卷
 */
function getCouponByUser(userId) {
    return new Promise((resolve, reject) => {
        query(`select ${COUPON}.*,${USERCOUPON}.*,${GOODS}.* from ${USERCOUPON},${COUPON},${GOODS} where userId=? and ${USERCOUPON}.couponId=${COUPON}.couponId and ${COUPON}.goodsId=${GOODS}.goodsId`, { userId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 查看商品详情
 */
function getGoodsById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${GOODS},${SALER} WHERE ${GOODS}.goodsId=? and ${GOODS}.salerId=${SALER}.salerId`, { id })
            .then((res) => {
                resolve(res[0])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取指定商品的优惠卷
 */
function getGoodsCoupon(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${COUPON} WHERE ${COUPON}.goodsId=? `, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取指定用户的收获地址
 */
function getAddressList(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ADDRESS} WHERE ${ADDRESS}.userId=? `, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加收获地址
 */
function AddaddressUser(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT ignore INTO ${ADDRESS}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取指定id的收货地址信息
 */
function getAddressById(addressId) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ADDRESS} WHERE ${ADDRESS}.addressId=? `, { addressId })
            .then((res) => {
                resolve(res[0])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 修改地址信息
 */
function UpadtaaddressUser(addressId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${ADDRESS} SET ${sql} WHERE addressId=${addressId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 删除地址信息
 */
function DeleteaddressUser(addressId) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${ADDRESS} WHERE addressId=?`, { addressId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 修改其他地址的选中
 */
function updataAlladdress(addressId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${ADDRESS} SET ${sql} WHERE addressId<>${addressId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取默认的收获地址
 */
function getAddressBydefault(userId) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ADDRESS} WHERE ${ADDRESS}.userId=? and ${ADDRESS}.isDefault=1`, { userId })
            .then((res) => {
                resolve(res[0])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品的详细信息
 */
function getGoodsInfoById(goodsId) {
    return new Promise((resolve, reject) => {
        query(`select * from ${GOODS} WHERE ${GOODS}.goodsId=?`, { goodsId })
            .then((res) => {
                resolve(res[0])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取指定商品和用户的用户卷
 */
function getCouponBygoods(goodsId, userId) {
    let condition = ''
    condition = sqlWhereStr(condition, { [`${COUPON}.goodsId`]: goodsId, [`${USERCOUPON}.userId`]: userId, })
    return new Promise((resolve, reject) => {
        query(`select  ${COUPON}.*,${USERCOUPON}.* from ${USERCOUPON},${COUPON} ${condition} and ${USERCOUPON}.couponId=${COUPON}.couponId`)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取用户钱
 */
function getMoney(id) {
    return new Promise((resolve, reject) => {
        query(`select ${USER}.beginMoney from ${USER} WHERE ${USER}.userId=?`, { id })
            .then((res) => {
                resolve(Number(res[0].beginMoney))
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 用户购物信息
 */
function addOrder(data) {
    return new Promise((resolve, reject) => {
        console.log(data)
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${ORDERS}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 余额修改
 */
function Recharge(userId, data) {
    return new Promise((resolve, reject) => {
        let sql = `beginMoney=beginMoney+${data.Money}`;
        query(`UPDATE ${USER} SET ${sql} WHERE userId=${userId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id删除商品
 */
function DeleteGoodsById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${GOODS} WHERE goodsId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id修改商品
 */
function UpdateGoods(goodsId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${GOODS} SET ${sql} WHERE goodsId=${goodsId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 购买修改商品数目
 */
function UpdateGoodsCard(goodsId, data) {
    return new Promise((resolve, reject) => {
        let sql = `goodsPayNum=goodsPayNum+${data.count}`;
        query(`UPDATE ${GOODS} SET ${sql} WHERE goodsId=${goodsId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 *  订单成功
 */
function getOrderListcompleted(userId) {
    return new Promise((resolve, reject) => {
        query(`select ${ORDERS}.* from ${ORDERS} WHERE ${ORDERS}.userId=?`, { userId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品信息和秒杀价格
 */
function getGoodsInfFlashoById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${GOODS},${SALER},${FLASH} WHERE ${GOODS}.goodsId=? and ${GOODS}.salerId=${SALER}.salerId and ${GOODS}.goodsId=${FLASH}.goodsId`, { id })
            .then((res) => {
                resolve(res[0])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取指定秒杀信息
 */
function getFlashListById(goodsId) {
    return new Promise((resolve, reject) => {
        query(`select * from ${FLASH} WHERE ${FLASH}.goodsId=? `, { goodsId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 删除优惠卷
 */
function deleteCoupon(couponId) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${USERCOUPON} WHERE couponId=?`, { couponId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据商品姓名查询商品
 */
// 
function getGoodsInfoByName(like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select * from ${GOODS} ${condition}`)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
exports.isUser = isUser;
exports.addUser = addUser;
exports.updataUser = updataUser;
exports.GetUsersById = GetUsersById;
exports.GetactivityimgList = GetactivityimgList;
exports.getNoticeList = getNoticeList;
exports.getFlashList = getFlashList;
exports.getCategoryinfoIndex = getCategoryinfoIndex;
exports.getCategoryList = getCategoryList;
exports.getGoodsInfoByType = getGoodsInfoByType;
exports.getCouponCount = getCouponCount;
exports.GetCouponList = GetCouponList;
exports.addCouponByUser = addCouponByUser;
exports.getbeginMoneyUser = getbeginMoneyUser;
exports.userRecharge = userRecharge;
exports.getCouponByUser = getCouponByUser;
exports.getGoodsById = getGoodsById;
exports.getGoodsCoupon = getGoodsCoupon;
exports.getAddressList = getAddressList;
exports.AddaddressUser = AddaddressUser;
exports.getAddressById = getAddressById;
exports.UpadtaaddressUser = UpadtaaddressUser;
exports.DeleteaddressUser = DeleteaddressUser;
exports.updataAlladdress = updataAlladdress;
exports.getAddressBydefault = getAddressBydefault;
exports.getGoodsInfoById = getGoodsInfoById;
exports.getCouponBygoods = getCouponBygoods;
exports.getMoney = getMoney;
exports.addOrder = addOrder;
exports.Recharge = Recharge;
exports.UpdateGoods = UpdateGoods;
exports.UpdateGoodsCard = UpdateGoodsCard;
exports.getOrderListcompleted = getOrderListcompleted;
exports.getGoodsInfFlashoById = getGoodsInfFlashoById;
exports.getFlashListById = getFlashListById;
exports.deleteCoupon = deleteCoupon;
exports.getGoodsInfoByName = getGoodsInfoByName;