import * as common from './common.js';
import * as db from './db.js'
import {
	apiBaseUrl
} from './config.js'

// 需要登陆的，都写到这里，否则就是不需要登陆的接口
const methodsToken = [
	'userInfoInit',
	'userInfoById',
	'addCouponByUser',
	'getbeginMoneyUser',
	'userRecharge',
	'getCouponByUser',
	'getAddressList',
	'AddaddressUser',
	'getAddressBydefault',
	'getGoodsInfoCardById',
	'shopping',
	'getOrderListcompleted',
	'isFlashGoods'
];

const post = (url, data, callback) => {
	uni.showLoading({
		title: '加载中'
	});

	// 判断token是否存在
	if (methodsToken.indexOf(url) >= 0) {
		// 获取用户token
		let userToken = db.get("userToken");
		if (!userToken) {
			common.jumpToLogin();
			return false;
		} else {
			data.userToken = userToken;
		}
	}

	uni.request({
		url: apiBaseUrl + url,
		data: data,
		header: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			// 'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
		},
		method: 'POST',
		success: (response) => {
			uni.hideLoading();
			const result = response.data;
			callback(result);
		},
		complete: () => {
			uni.hideLoading();
		},
		fail: (error) => {
			uni.hideLoading();
			if (error && error.response) {
				showError(error.response);
			}
		},
	});

}

const get = (url, callback) => {
	uni.showLoading({
		title: '加载中'
	});
	uni.request({
		url: apiBaseUrl + url,
		header: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
		},
		method: 'GET',
		success: (response) => {
			uni.hideLoading();
			callback(response.data);
		},
		fail: (error) => {
			uni.hideLoading();
			if (error && error.response) {
				showError(error.response);
			}
		},
		complete: () => {
			setTimeout(function() {
				uni.hideLoading();
			}, 250);
		}
	});
}

/**
 * 所有的请求
 */
//用户登录
export const login = (data, callback) => post('login', data, callback);
//修改用户的初始的信息
export const upinfoLogin = (data, callback) => post('upinfoLogin', data, callback);
//更新用户界面显示的信息
export const userInfoInit = (data, callback) => post('userInfoInit', data, callback);
//获取用户信息
export const userInfoById = (data, callback) => post('userInfoById', data, callback);
//获取首页轮播图
export const GetimgSlideIndex = (callback) => get('GetimgSlideIndex', callback);
//获取首页通知信息
export const getNoticeListIndex = (callback) => get('getNoticeListIndex', callback);
//获取秒杀页面的轮播图
export const getimgSlideDataFlash = (callback) => get('getimgSlideDataFlash', callback);
//获取秒杀商品信息
export const getFlashList = (callback) => get('getFlashList', callback);
//获取今日热销的轮播图
export const getimgSlideDataHot = (callback) => get('getimgSlideDataHot', callback);
//获取今日热销商品
export const gethotSaleList = (callback) => get('gethotSaleList', callback);
//获取首页商品分类
export const getCategoryinfoIndex = (callback) => get('getCategoryinfoIndex', callback);
//获取首页热门商品
export const getGoodsDataIndex = (callback) => get('getGoodsDataIndex', callback);
//获取分类页面数据
export const getCategoryList = (callback) => get('getCategoryList', callback);
//根据类型获取相似商品
export const getGoodsInfoByType = (data, callback) => post('getGoodsInfoByType', data, callback);
//获取用户卷信息
export const getCouponList = (data, callback) => post('getCouponList', data, callback);
//用户领取优惠卷
export const addCouponByUser = (data, callback) => post('addCouponByUser', data, callback);
//获取用户余额
export const getbeginMoneyUser = (data, callback) => post('getbeginMoneyUser', data, callback);
//充值
export const userRecharge = (data, callback) => post('userRecharge', data, callback);
//获取用户优惠卷信息
export const getCouponByUser = (data, callback) => post('getCouponByUser', data, callback);
//获取商品的详细信息
export const getGoodsById = (data, callback) => post('getGoodsById', data, callback);
//获取指定商品的优惠卷
export const getGoodsCoupon = (data, callback) => post('getGoodsCoupon', data, callback);
//获取指定用户的收获地址
export const getAddressList = (data, callback) => post('getAddressList', data, callback);
//添加收获地址
export const AddaddressUser = (data, callback) => post('AddaddressUser', data, callback);
//获取指定id的收货地址信息
export const getAddressById = (data, callback) => post('getAddressById', data, callback);
//修改地址信息
export const UpadtaaddressUser = (data, callback) => post('UpadtaaddressUser', data, callback);
//删除地址信息
export const DeleteaddressUser = (data, callback) => post('DeleteaddressUser', data, callback);
//获取默认地址信息
export const getAddressBydefault = (data, callback) => post('getAddressBydefault', data, callback);
//获取商品的详细信息
export const getGoodsInfoById = (data, callback) => post('getGoodsInfoById', data, callback);
//获取商品信息和用户对应的优惠卷
export const getGoodsInfoCardById = (data, callback) => post('getGoodsInfoCardById', data, callback);
//购物
export const shopping = (data, callback) => post('shopping', data, callback);
//获取交易成功的数据
export const getOrderListcompleted = (data, callback) => post('getOrderListcompleted', data, callback);
//判断是否属于热门商品
export const isFlashGoods = (data, callback) => post('isFlashGoods', data, callback);
//删除优惠卷信息
export const deleteCoupon = (data, callback) => post('deleteCoupon', data, callback);

export {
	apiBaseUrl
};
