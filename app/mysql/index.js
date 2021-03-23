const query = require('./fun')
const sqlCount = 'SQL_CALC_FOUND_ROWS';
const { ADMIN, USER, SALER, ISUSING, CATEGORY, CATEGORYINFO, ACTIVITYIMG, ARTICLE, DISCUSS, GOODS } = require('./database')
let { sqlUpdateStr, sqlAddStr, sqlSelectStr, sqlWhereStr } = require('../util.js');
/**
 * 所有请求方法
 */
/**
 *  登录
 */
function isAdminLogin(data) {
    return new Promise((resolve, reject) => {
        query(`select  * from ${ADMIN} where name=? and password=?`, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取用户的数目
 */
function getUserCount() {
    return new Promise((resolve, reject) => {
        query(`select count(userId) as counts from ${USER}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取分页用户数
 */
function getUserList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
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
        query(`select  ${sqlCount} * from ${USER} ${condition}  limit ?,${limit}`, { num }, true)
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
 * 删除用户的方法
 */
function DeleteUserById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${USER} WHERE userId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商家信息
 */
function getSalerList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select ${sqlCount} * from ${SALER} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商家信息的数目
 */
function getSalerCount() {
    return new Promise((resolve, reject) => {
        query(`select count(salerId) as counts from ${SALER}`)
            .then((res) => {
                resolve(res[0]['counts'])
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
 * 根据id删除商户
 */
function DeleteSalerById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${SALER} WHERE salerId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取状态
 */
function GetSalerIsusing() {
    return new Promise((resolve, reject) => {
        query(`select * from ${ISUSING}`)
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
 * 添加商户
 */
function addSaler(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${SALER}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品分类
 */
function GetCategoryList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select ${sqlCount} * from ${CATEGORY} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品全部分类
 */
function GetCategory() {
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
 * 获取商品分类的数目
 */
function getCategoryCount() {
    return new Promise((resolve, reject) => {
        query(`select count(categoryId) as counts from ${CATEGORY}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取一级分类的Id
 */
function getCategoryByName(categoryName) {
    return new Promise((resolve, reject) => {
        query(`select * from ${CATEGORY} where categoryName=?`, { categoryName })
            .then((res) => {
                resolve(res[0])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加商品分类
 */
function AddCategory(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT ignore INTO ${CATEGORY}(${obj.keys}) VALUES(${obj.vals})`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加二级分类
 */
function AddCategoryInfo(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT ignore INTO ${CATEGORYINFO}(${obj.keys}) VALUES(${obj.vals})`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 删除商品分类
 */
function DeleteCategory(categoryId) {
    return new Promise((resolve, reject) => {
        query([`DELETE FROM ${CATEGORY} WHERE categoryId=${categoryId}`, `DELETE FROM ${CATEGORYINFO} WHERE categoryId=${categoryId}`])
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 删除二级分类
 */
function DeleteCategoryInfo(categoryinfoId) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM  ${CATEGORYINFO} WHERE categoryinfoId=${categoryinfoId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取管理员全部信息
 */
function GetAdminList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select ${sqlCount} * from ${ADMIN} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取管理员总数目
 */
function getAdminCount() {
    return new Promise((resolve, reject) => {
        query(`select count(id) as counts from ${ADMIN}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据管理员id查询管理员信息
 */
function GetAdminById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ADMIN} where id=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id修改管理员信息
 */
function UpdateAdminById(id, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${ADMIN} SET ${sql} WHERE id=${id}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id删除管理员
 */
function DeleteAdminById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${ADMIN} WHERE id=?`, id)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加管理员
 */
function addAdmin(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${ADMIN}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 主页轮播图和今日秒杀和今日热销的活动图
 */
function GetactivityimgList(num, limit, data) {
    let sql = '';
    sql = sqlWhereStr(sql, data)
    return new Promise((resolve, reject) => {
        query(`select * from ${ACTIVITYIMG} ${sql}  limit ?,${limit}`, { num }, true)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取活动图的数目
 */
function getActivityimgCount() {
    return new Promise((resolve, reject) => {
        query(`select count(activityimgId) as counts from ${ACTIVITYIMG}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 *根据id返回活动图信息
 */
function GetActivityimgById(activityimgId) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ACTIVITYIMG} where activityimgId=?`, { activityimgId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id删除活动图信息
 */
function DeleteActivityimgById(activityimgId) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${ACTIVITYIMG} WHERE activityimgId=?`, activityimgId)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 根据id修改活动图
 */
function UpdateActivityimgById(activityimgId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${ACTIVITYIMG} SET ${sql} WHERE activityimgId=${activityimgId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 添加活动图
 */
function addActivityimg(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${ACTIVITYIMG}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
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
 * 返回数据库受影响的条数
 */
function getDataCount() {
    return new Promise((resolve, reject) => {
        query(`SELECT FOUND_ROWS() as count`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品信息
 */
function GetGoodsList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
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
        query(`select  ${sqlCount}  * from ${GOODS} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * 获取商品信息的数目
 */
function getGoodsCount() {
    return new Promise((resolve, reject) => {
        query(`select count(goodsId) as counts from ${GOODS}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}




exports.isAdminLogin = isAdminLogin;
exports.getUserCount = getUserCount;
exports.getUserList = getUserList;
exports.GetUsersById = GetUsersById;
exports.DeleteUserById = DeleteUserById;
exports.getSalerList = getSalerList;
exports.getSalerCount = getSalerCount;
exports.GetSalerById = GetSalerById;
exports.DeleteSalerById = DeleteSalerById;
exports.GetSalerIsusing = GetSalerIsusing;
exports.UpdateSalerById = UpdateSalerById;
exports.addSaler = addSaler;
exports.GetCategoryList = GetCategoryList;
exports.getCategoryCount = getCategoryCount;
exports.GetCategory = GetCategory;
exports.AddCategory = AddCategory;
exports.getCategoryByName = getCategoryByName;
exports.AddCategoryInfo = AddCategoryInfo;
exports.DeleteCategory = DeleteCategory;
exports.DeleteCategoryInfo = DeleteCategoryInfo;
exports.GetAdminList = GetAdminList;
exports.getAdminCount = getAdminCount;
exports.GetAdminById = GetAdminById;
exports.UpdateAdminById = UpdateAdminById;
exports.DeleteAdminById = DeleteAdminById;
exports.addAdmin = addAdmin;
exports.GetactivityimgList = GetactivityimgList;
exports.getActivityimgCount = getActivityimgCount;
exports.GetActivityimgById = GetActivityimgById;
exports.DeleteActivityimgById = DeleteActivityimgById;
exports.UpdateActivityimgById = UpdateActivityimgById;
exports.addActivityimg = addActivityimg;
exports.GetGoodsById = GetGoodsById;
exports.GetGoodsList = GetGoodsList;
exports.getGoodsCount = getGoodsCount;
exports.DeleteGoodsById = DeleteGoodsById;
exports.UpdateGoods = UpdateGoods;
exports.addGoods = addGoods;