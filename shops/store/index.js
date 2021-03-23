import Vue from 'vue'
import Vuex from 'vuex'
import * as db from '../config/db.js'
Vue.use(Vuex)
let goodsList = db.get('goodsList') || [];
const store = new Vuex.Store({
	state: {
		goodsList: goodsList,
		userInfo: {}
	},
	mutations: {
		addCardMutations(state, goods) {
			//判断是否添加了该商品
			let stateShopInfo = state.goodsList;
			let shopInfo = goods;
			let goodsItem = null;
			let index;
			goods.count = goods.count || 1;
			goodsItem = stateShopInfo.find((item, i) => {
				if (stateShopInfo[i].goodsId == shopInfo.goodsId) {
					index = i;
					return true;
				} else {
					return false;
				}
			})
			if (goodsItem) {
				if (goods.count) {
					goodsItem.count = shopInfo.count;
					goodsItem.goodsNumber = shopInfo.goodsNumber
				} else {
					//删除记录
					stateShopInfo.splice(index, 1)
				}
			} else {
				stateShopInfo.push({
					goodsId: shopInfo.goodsId,
					goodsName: shopInfo.goodsName,
					goodsNumber: shopInfo.goodsNumber,
					isflash: shopInfo.isflash || 0,
					count: shopInfo.count
				})
			}

			db.set('goodsList', state.goodsList)
		},
		setUserInfoMutations(state, userinfo) {
			state.userInfo = userinfo;
			db.set('userinfo', state.userInfo)
		},
		emptyAllCardMutations(state) {
			state.goodsList = [];
			db.del('goodsList')
		},
		saveUserTokenAction(state, userToken) {
			state.userToken = userToken;
			db.set('userToken', state.userToken)
		},
		delCardMutations(state, goodsId) {
			let index = state.goodsList.findIndex((item) => {
				return item.goodsId == goodsId
			})
			state.goodsList.splice(index, 1)
			db.set('goodsList', state.goodsList)
		}
	},
	actions: {
		addCardAction(state, goods) {
			state.commit('addCardMutations', goods)
		},
		setUserInfoAction(state, userinfo) {
			state.commit('setUserInfoMutations', userinfo)
		},
		emptyAllCardAction(state) {
			state.commit('emptyAllCardMutations')
		},
		saveUserTokenAction(state, userToken) {
			state.commit('saveUserTokenAction', userToken)
		},
		delCardAction(state, goodsId) {
			state.commit('delCardMutations', goodsId);
		}
	},
	getters: {
		getGoodsList(state) {
			return state.goodsList;
		},
		getNameGoodListNum: (state) => (goodsId) => {
			let goodsItem = state.goodsList.find((item, i) => {
				return item.goodsId == goodsId;
			})
			if (goodsItem) {
				return goodsItem;
			} else {
				return 0;
			}
		},
		getUserInfos(state) {
			return state.userInfo;
		},
		getisLogin(state) {
			if (JSON.stringify(state.userInfo) == "{}") {
				return false;
			} else {
				return true;
			}
		}
	}
})

export default store
