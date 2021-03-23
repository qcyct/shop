import * as db from './db.js';
import moment from '../static/js/moment.js'
//操作失败的提示信息
function errorToShow(msg = '操作失败', callback = function() {}) {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: 1500
	})
	setTimeout(function() {
		callback()
	}, 1500)
}

//操作成功后，的提示信息
function successToShow(msg = '保存成功', callback = function() {}) {
	uni.showToast({
		title: msg,
		icon: 'success',
		duration: 1000
	})
	setTimeout(function() {
		callback()
	}, 500)
}
//跳转到登陆页面
function jumpToLogin(method) {
	var now_time = Date.parse(new Date())
	var value = db.get('jump_to_login')
	if (!value) {
		value = 0
	}
	if (now_time - value > 3000) {
		db.set('jump_to_login', now_time); //暂时屏蔽登录时间查询
		uni.showToast({
			title: '请先登录!',
			icon: 'none',
			duration: 1000,
			success: function(res) {
				setTimeout(() => {
					uni.hideToast();
					uni.switchTab({
						url: '/pages/member/member',
						animationType: 'pop-in',
						animationDuration: 200
					})
				}, 500)
			}
		})
	}
}

function throttle(fn, gapTime) {
	if (gapTime == null || gapTime == undefined) {
		gapTime = 1500
	}

	let _lastTime = null

	// 返回新的函数
	return function() {
		let _nowTime = +new Date()
		if (_nowTime - _lastTime > gapTime || !_lastTime) {
			fn.apply(this, arguments) //将this和参数传给原函数
			_lastTime = _nowTime
		}
	}
}

function timestampToTime(timestamp) {
	var date = new Date(timestamp * 1000);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();
	return Y + M + D + h + m + s;
}
/**
 * 统一跳转
 */
function navigateTo(url) {
	uni.navigateTo({
		url: url,
		animationType: 'pop-in',
		animationDuration: 300
	})
}

function tabbarTime(tabbarData = [], startTime = 0, endTime = 23, flog = 2) {
	let list = []
	let tabbarDataList = [];
	var now = moment();
	let data = null;
	let end = null;
	let startTimeStr = "",
		endTimeStr = "";
	let FlashGoods = []
	for (let i = startTime; i <= endTime; i += flog) {
		data = moment().hour(i).minutes(0).seconds(0);
		end = moment().hour(i + 2).minutes(0).seconds(0).subtract(1, 'second');
		let ListGoods = []
		if (now.isBefore(data, 'hour')) {
			list.push({
				time: data.format('HH:mm'),
				state: "还未开始"
			})
			for (let i = 0; i < tabbarData.length; i++) {
				let item = tabbarData[i];
				let index = i;
				let tabbarNow = moment(item.flashtime, "HH:mm").minutes(0);
				if (tabbarNow.isBetween(data, end)) {
					ListGoods.push({
							...tabbarData.splice(index, 1)[0],
							state: "还未开始"
						})
						--i;
				}
			}
			tabbarDataList.push({
				time: data.format('HH:mm'),
				List: ListGoods,
				state: "还未开始"
			})
		} else {
			if (now.isBetween(data, end)) {
				endTimeStr = end.format('HH:mm');
				startTimeStr = data.format('HH:mm');
				list.push({
					time: data.format('HH:mm'),
					state: "进行中",
				})
				for (let i = 0; i < tabbarData.length; i++) {
					let item = tabbarData[i];
					let index = i;
					let tabbarNow = moment(item.flashtime, "HH:mm").minutes(0);
					if (tabbarNow.isBetween(data, end)) {
						ListGoods.push({
								...tabbarData.splice(index, 1)[0],
								state: "进行中"
							})
							--i;
					}
				}
				tabbarDataList.push({
					time: data.format('HH:mm'),
					List: ListGoods,
					state: "进行中"
				})
				FlashGoods = ListGoods
			} else {
				list.push({
					time: data.format('HH:mm'),
					state: "已结束"
				})
				for (let i = 0; i < tabbarData.length; i++) {
					let item = tabbarData[i];
					let index = i;
					let tabbarNow = moment(item.flashtime, "HH:mm").minutes(0);
					if (tabbarNow.isBetween(data, end)) {
						ListGoods.push({
								...tabbarData.splice(index, 1)[0],
								state: "已结束"
							})
							--i;
					}
				}
				tabbarDataList.push({
					time: data.format('HH:mm'),
					List: ListGoods,
					state: "已结束"
				})
			}
		}

	}
	return {
		list: list,
		startTime: startTimeStr,
		endTime: endTimeStr,
		tabbarDataList: tabbarDataList
	}
}


/**
 * 获取秒杀倒计时
 */
function getFlashTime(endtime) {
	if (endtime == '00:00') {
		endtime = '24:00'
	}
	let data = moment(endtime, "HH:mm");
	let data1 = moment();
	return moment(data).diff(data1, 'second')
}
/**
 * 计算百分比
 */
function GetPercent(num, total) {
	num = parseFloat(num);
	total = parseFloat(total);
	if (isNaN(num) || isNaN(total)) {
		return "-";
	}
	return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
}
/**
 *  过滤非法字符
 */
function filterNum(i) {
	let num = i.charAt(i.length - 1)
	var reg = new RegExp("^[0-9]*$")
	if (!reg.test(num)) {
		return i.slice(0, -1)
	} else {
		return i
	}
}
export {
	errorToShow,
	successToShow,
	jumpToLogin,
	throttle,
	timestampToTime,
	navigateTo,
	tabbarTime,
	getFlashTime,
	GetPercent,
	filterNum
}
