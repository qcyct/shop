const query = require('./fun')
const sqlCount = 'SQL_CALC_FOUND_ROWS';
const { SALER, ORDERS, GOODS, USER, COUPON, FLASH } = require('./database')
let { sqlUpdateStr, sqlAddStr, sqlSelectStr, sqlWhereStr } = require('../util.js');
/**
 * 所有商户请求
 */
/**
 *  登录
 */
function isSalerLogin(data) {
    return new Promise((resolve, reject) => {
        query(`select  * from ${SALER} where salerPhone=? and salerPass=?`, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 *根据商户id获取商品购物信息
 */
function getOrdersBysalerId(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ORDERS} where salerId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 *  获取所有的商品购物信息
 */
function getOrdersList() {
    return new Promise((resolve, reject) => {
        query(`select * from ${ORDERS}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 *  获取指定id的商品购物信息
 */
function getOrdersById(orderId) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ORDERS} where orderId=${orderId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 修改订单是否发货
 */
function updataDeliver(orderId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${ORDERS} SET ${sql} WHERE orderId=${orderId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品数目
 */
function getGoodsCount(salerId) {
    return new Promise((resolve, reject) => {
        query(`select count(goodsId) as counts from ${GOODS} where salerId=?`, { salerId })
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品信息
 */
function GetGoodsList(salerId, num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlWhereStr(condition, { salerId })
        condition = sqlSelectStr(condition, like)
        query(`select  ${sqlCount}  * from ${GOODS}  ${condition}  limit ?,?`, { num, limit }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 据id获取商品信息
 */
function GetGoodsById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${GOODS} WHERE goodsId=?`, { id })
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
 * 添加商品
 */
function addGoods(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${GOODS}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id获取用户信息
 */
function GetUsersById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${USER} where userId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id获取商家信息
 */
function GetSalerById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${SALER} where salerId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 提交修改商户
 */
function UpdateSalerById(salerId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${SALER} SET ${sql} WHERE salerId=${salerId}`)
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
function getCouponCount(salerId) {
    return new Promise((resolve, reject) => {
        query(`select count(couponId) as counts from ${COUPON} where salerId=?`, { salerId })
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
function GetCouponList(salerId, num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlWhereStr(condition, { [`${COUPON}.salerId`]: salerId })
        condition += ` and ${GOODS}.goodsId=${COUPON}.goodsId `
        condition = sqlSelectStr(condition, like)
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
 * 根据id获取优惠卷信息
 */
function GetCouponById(id) {
    return new Promise((resolve, reject) => {
        query(`select ${COUPON}.*,${GOODS}.goodsName from ${COUPON},${GOODS} where ${COUPON}.couponId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id删除优惠卷
 */
function DeleteCouponById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${COUPON} WHERE couponId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取全部商品信息
 */
function GetGoodsListAll(salerId) {
    let condition = ''
    condition = sqlWhereStr(condition, { salerId })
    return new Promise((resolve, reject) => {
        query(`select  ${sqlCount}  * from ${GOODS} ${condition} `, {}, true)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加优惠卷
 */
function addCoupon(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${COUPON}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 修改优惠卷信息
 */
function UpdateCoupon(couponId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${COUPON} SET ${sql} WHERE couponId=${couponId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取今日秒杀卷数目
 */
function getFlashCount(salerId) {
    return new Promise((resolve, reject) => {
        query(`select count(flashId) as counts from ${FLASH} where salerId=?`, { salerId })
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取今日秒杀信息
 */
function GetFlasList(salerId, num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlWhereStr(condition, { [`${FLASH}.salerId`]: salerId })
        condition += ` and ${GOODS}.goodsId=${FLASH}.goodsId `
        condition = sqlSelectStr(condition, like)
        query(`select  ${sqlCount}  ${FLASH}.*,${GOODS}.goodsName from ${FLASH},${GOODS}  ${condition}  limit ?,?`, { num, limit }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id获取秒杀信息
 */
function GetFlashById(id) {
    return new Promise((resolve, reject) => {
        query(`select ${FLASH}.*,${GOODS}.goodsName from ${FLASH},${GOODS} where ${FLASH}.flashId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id删除秒杀信息
 */
function DeleteFlashById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${FLASH} WHERE flashId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加秒杀信息
 */
function addFlash(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT ignore INTO ${FLASH}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 修改秒杀信息
 */
function UpdateFlash(flashId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${FLASH} SET ${sql} WHERE flashId=${flashId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}

exports.isSalerLogin = isSalerLogin;
exports.getOrdersBysalerId = getOrdersBysalerId;
exports.getOrdersList = getOrdersList;
exports.getGoodsCount = getGoodsCount;
exports.GetGoodsList = GetGoodsList;
exports.GetGoodsById = GetGoodsById;
exports.DeleteGoodsById = DeleteGoodsById;
exports.UpdateGoods = UpdateGoods;
exports.addGoods = addGoods;
exports.GetUsersById = GetUsersById;
exports.GetSalerById = GetSalerById;
exports.UpdateSalerById = UpdateSalerById;
exports.getCouponCount = getCouponCount;
exports.GetCouponList = GetCouponList;
exports.GetCouponById = GetCouponById;
exports.DeleteCouponById = DeleteCouponById;
exports.GetGoodsListAll = GetGoodsListAll;
exports.addCoupon = addCoupon;
exports.UpdateCoupon = UpdateCoupon;
exports.getFlashCount = getFlashCount;
exports.GetFlasList = GetFlasList;
exports.GetFlashById = GetFlashById;
exports.DeleteFlashById = DeleteFlashById;
exports.addFlash = addFlash;
exports.UpdateFlash = UpdateFlash;
exports.getOrdersById = getOrdersById
exports.updataDeliver=updataDeliver;