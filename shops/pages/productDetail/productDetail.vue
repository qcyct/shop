<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
			<view class="tui-header" :style="{paddingTop:top+'px', opacity:opcity}">
				商品详情
			</view>
			<view class="tui-header-icon" :style="{marginTop:top+'px'}">
				<view class="tui-icon tui-icon-arrowleft tui-icon-back" :style="{color:opcity>=1?'#000':'#fff',background:'rgba(0, 0, 0,'+iconOpcity+')'}"
				 @tap="back"></view>
				<view class="tui-icon tui-icon-more-fill  tui-icon-ml" :style="{color:opcity>=1?'#000':'#fff',background:'rgba(0, 0, 0,'+iconOpcity+')',fontSize:'20px'}"
				 @tap.stop="openMenu"></view>
				<tui-badge type="red" size="small">5</tui-badge>
			</view>
		</view>
		<!--header-->

		<!--banner-->
		<view class="tui-banner-swiper">
			<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{height:scrollH + 'px'}" @change="bannerChange">
				<block v-for="(item,index) in GoodInfo.goodImgList" :key="index">
					<swiper-item :data-index="index" @tap.stop="previewImage">
						<image :src="item" class="tui-slide-image" :style="{height:scrollH+'px'}" />
					</swiper-item>
				</block>
			</swiper>
			<tui-tag type="translucent" shape="circleLeft" size="small">{{bannerIndex+1}}/{{GoodInfo.goodImgList.length}}</tui-tag>
		</view>

		<!--banner-->

		<view class="tui-pro-detail">
			<view class="tui-product-title tui-border-radius">
				<view class="tui-pro-pricebox tui-padding">
					<view class="tui-pro-price">
						<view>￥<text class="tui-price">{{GoodInfo.goodsSale}}</text></view>
						<tui-tag size="small" :plain="true" type="high-green" shape="circle">新品</tui-tag>
						<block v-if="isflash">
							<tui-tag size="small" :plain="true" type="red" shape="circle">热卖商品</tui-tag>
						</block>
					</view>
					<view class="tui-collection tui-size" @tap="collecting">
						<view class="tui-icon tui-icon-collection" :class="['tui-icon-'+(collected?'like-fill':'like')]" :style="{color:collected?'#ff201f':'#333',fontSize:'20px'}"></view>
						<view class="tui-scale" :class="[collected?'tui-icon-red':'']">收藏</view>
					</view>
				</view>
				<view class="tui-original-price tui-gray">
					价格
					<text class="tui-line-through">￥{{GoodInfo.goodsFactory}}</text>
				</view>
				<view class="tui-pro-titbox">
					<view class="tui-pro-title"> {{GoodInfo.goodsName}}</view>
					<button open-type="share" class="tui-share-btn tui-share-position">
						<tui-tag type="gray" tui-tag-class="tui-tag-share tui-size" shape="circleLeft" size="small">
							<view class="tui-icon tui-icon-partake" style="color:#999;font-size:15px"></view>
							<!-- <tui-icon name="partake" color="#999" size="15"></tui-icon> -->
							<text class="tui-share-text tui-gray">分享</text>
						</tui-tag>
					</button>
				</view>
				<view class="tui-padding">
					<view class="tui-sale-info tui-size tui-gray">
						<view>快递：0.00</view>
						<view>月销{{GoodInfo.goodsPayNum}}</view>
						<view>{{GoodInfo.salerAddress}}</view>
					</view>
				</view>
			</view>

			<view class="tui-discount-box tui-radius-all tui-mtop">
				<view class="tui-list-cell" @tap="showCoupon">
					<view class="tui-bold tui-cell-title">领券</view>
					<view class="tui-tag-coupon-box">
						<block v-for="(CouponItem) in GoodsCoupon" :key="CouponItem.couponId">
							<tui-tag size="small" type="red" shape="circle" tui-tag-class="tui-tag-coupon">满{{CouponItem.couponMin}}减{{CouponItem.couponMon}}</tui-tag>
						</block>
					</view>
					<tui-icon name="more-fill" :size="20" class="tui-right tui-top40" color="#666"></tui-icon>
				</view>
			</view>

			<view class="tui-basic-info tui-mtop tui-radius-all">
				<view class="tui-list-cell tui-last">
					<view class="tui-bold tui-cell-title">运费</view>
					<view class="tui-selected-box">在线支付免运费</view>
				</view>
				<view class="tui-guarantee">
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">可配送海外</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">店铺发货&售后</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">7天无理由退货</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">闪电退款</text>
					</view>
					<view class="tui-guarantee-item">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">极速审核</text>
					</view>
				</view>
			</view>

			<!-- <view class="tui-cmt-box tui-mtop tui-radius-all">
				<view class="tui-list-cell tui-last tui-between">
					<view class="tui-bold tui-cell-title">评价</view>
					<view @tap="common">
						<text class="tui-cmt-all">查看全部</text>
						<view class="tui-icon tui-icon-more-fill" style="color:#ff201f; font-size: 20px;"></view>
					</view>
				</view>

				<view class="tui-cmt-content tui-padding">
					<view class="tui-cmt-user">
						<image src="../../static/img/face.jpg" class="tui-acatar"></image>
						<view>z***9</view>
					</view>
					<view class="tui-cmt">物流很快，很适合我的风格❤</view>
					<view class="tui-attr">颜色：叠层钛钢流苏耳环（A74）</view>
				</view>

				<view class="tui-cmt-btn">
					<tui-tag type="black" :plain="true" tui-tag-class="tui-tag-cmt" @tap="common">查看全部评价</tui-tag>
				</view>
			</view> -->

			<view class="tui-nomore-box">
				<tui-nomore text="宝贝详情" :visible="true" bgcolor="#f7f7f7"></tui-nomore>
			</view>
			<view class="tui-product-img tui-radius-all">
				<image :src="item" v-for="(item,index) in GoodInfo.goodImgList" :key="index" mode="widthFix"></image>
			</view>
			<tui-nomore text="已经到最底了" :visible="true" bgcolor="#f7f7f7"></tui-nomore>
			<view class="tui-safearea-bottom"></view>
		</view>

		<!--底部操作栏-->
		<view class="tui-operation">
			<view class="tui-operation-left tui-col-3">
				<view class="tui-operation-item" hover-class="opcity" :hover-stay-time="150">
					<tui-icon name="kefu" :size="22" color='#333'></tui-icon>
					<view class="tui-operation-text tui-scale-small">客服</view>
				</view>
				<view class="tui-operation-item" hover-class="opcity" :hover-stay-time="150" @click="showCard">
					<tui-icon name="cart" :size="22" color='#333'></tui-icon>
					<view class="tui-operation-text tui-scale-small">购物车</view>
					<tui-badge type="danger" size="small">{{stockNum}}</tui-badge>
				</view>
			</view>
			<view class="tui-operation-right tui-right-flex tui-col-9 tui-btnbox-4">
				<view class="tui-flex-1">
					<tui-button type="danger" shape="circle" size="mini" @click="addCart" :disabled="!goodsNumber">加入购物车</tui-button>
				</view>
				<view class="tui-flex-1">
					<tui-button type="warning" shape="circle" size="mini" @click="submit" :disabled="!goodsNumber">购物车</tui-button>
				</view>
				<view class="tui-flex-1">
					<tui-button type="green" shape="circle" size="mini" @click="submitOrder" :disabled="!goodsNumber">立即购买</tui-button>
				</view>
			</view>
		</view>

		<!--底部操作栏--->

		<!--顶部下拉菜单-->
		<tui-top-dropdown tui-top-dropdown="tui-top-dropdown" bgcolor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0"
		 @close="closeMenu">
			<view class="tui-menu-box tui-padding tui-ptop">
				<view class="tui-menu-header" :style="{paddingTop:top+'px'}">
					功能直达
				</view>
				<view class="tui-menu-itembox">
					<block v-for="(item,index) in topMenu" :key="index">
						<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="common">
							<view class="tui-badge-box">
								<tui-icon :name="item.icon" color="#fff" :size="item.size"></tui-icon>
								<tui-badge type="red" tui-badge-class="tui-menu-badge" size="small" v-if="item.badge">{{item.badge}}</tui-badge>
							</view>
							<view class="tui-menu-text">{{item.text}}</view>
						</view>
					</block>
				</view>
				<view class="tui-icon tui-icon-up" style="color: #fff; font-size: 26px;" @tap.stop="closeMenu"></view>
			</view>

		</tui-top-dropdown>
		<!---顶部下拉菜单-->

		<tui-bottom-popup :show="cardShow" @close="hideCard">
			<view style="width: 100%;max-height: 804upx;background: #FFFFFF;">
				<view class="pop-c">
					<view class="pop-t">
						<view class='goods-img'>
							<image :src='GoodInfo.goodsImg' mode='aspectFill'></image>
						</view>
						<view class='goods-information'>
							<view class='pop-goods-name'>{{GoodInfo.goodsName}}</view>
							<view class='pop-goods-price red-price'>￥{{GoodInfo.goodsSale}}</view>
						</view>
						<view class='close-btn' @click="hideCard()">
							<image src='../../static/image/close.png'></image>
						</view>
					</view>
					<scroll-view class="pop-m" scroll-y="true" style="max-height: 560upx;padding:0upx 28upx;">
						<view class="goods-number" style="padding-left: 0upx;padding-right: 0upx;">
							<text class="pop-m-title">数量</text>
							<view class="pop-m-bd-in">
								<tui-numberbox :max="99" :min="0" :value="stockNum" @change="bindChange"></tui-numberbox>
							</view>
						</view>
						<view class="tui-bold tui-attr-title">码数</view>
						<view class="tui-attr-box">
							<block v-for="(item) in GoodInfo.goodsNumber">
								<view class="tui-attr-item" :class="item==goodsNumber?'tui-attr-active':''" @click="goodsNumberItemClick(item)">
									{{item}}
								</view>
							</block>
						</view>
					</scroll-view>
					<view class="pop-b">
						<button class='btn btn-square btn-b btn-all' hover-class="btn-hover2" @click="submit()" :disabled='submitStatus'
						 :loading='submitStatus' v-if="stockNum">立即购买</button>
						<button class='btn btn-square btn-g btn-all' v-else>请购买</button>
					</view>
				</view>
			</view>
		</tui-bottom-popup>

		<!-- 优惠劵 -->
		<tui-bottom-popup tui-top-dropdown="tui-top-dropdown" bgcolor="rgba(76, 76, 76, 0.95)" :show="couponShow" :height="0"
		 @close="closeCoupon">
			<view class="coupon-list-window">
				<view class="title">
					优惠券<text class="iconfont icon-guanbi"></text>
				</view>
				<view>
					<block v-for="(CouponItem) in GoodsCoupon" :key="CouponItem.couponId">
						<CouponItme :CouponListItem="CouponItem"></CouponItme>
					</block>
				</view>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	import CouponItme from '../../components/CouponItme/CouponItme.vue';
	import {
		mapActions,
		mapGetters
	} from "vuex";
	export default {
		components: {
			CouponItme
		},
		data() {
			return {
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				goodsId: 1,
				iconOpcity: 0.5,
				bannerIndex: 0,
				cardShow: false,
				stockNum: 0,
				topMenu: [{
					icon: "message",
					text: "消息",
					size: 26,
					badge: 3
				}, {
					icon: "home",
					text: "首页",
					size: 23,
					badge: 0
				}, {
					icon: "people",
					text: "我的",
					size: 26,
					badge: 0
				}, {
					icon: "cart",
					text: "购物车",
					size: 23,
					badge: 2
				}, {
					icon: "kefu",
					text: "客服小蜜",
					size: 26,
					badge: 0
				}, {
					icon: "feedback",
					text: "我要反馈",
					size: 23,
					badge: 0
				}, {
					icon: "share",
					text: "分享",
					size: 26,
					badge: 0
				}],
				menuShow: false,
				value: 1,
				collected: false,
				couponShow: false,
				GoodInfo: {},
				GoodsCoupon: [],
				isflash: 0,
				goodsNumber: 0
			}
		},
		onLoad: async function(options) {
			let obj = {};
			obj = wx.getMenuButtonBoundingClientRect();
			setTimeout(() => {
				uni.getSystemInfo({
					success: (res) => {
						this.width = obj.left || res.windowWidth;
						this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
						this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
						this.scrollH = res.windowWidth
					}
				})
			}, 50)
			this.goodsId = options.goodsId;
			// this.isflash = options.isflash;
			//判断是否是秒杀商品
			this.$api.isFlashGoods({
				goodsId: this.goodsId
			}, res => {
				if (res.code) {
					this.isflash = res.data;
				}
				this.getGoodsInfoById()
				this.getGoodsCoupon()
				this.stockNum = this.getNameGoodListNum(this.goodsId).count
				this.goodsNumber = this.getNameGoodListNum(this.goodsId).goodsNumber
			})
		},
		computed: {
			...mapGetters({
				getGoodsList: "getGoodsList",
				getNameGoodListNum: 'getNameGoodListNum',
				getUserInfos: 'getUserInfos',
				getisLogin: 'getisLogin'
			})
		},
		methods: {
			bannerChange: function(e) {
				this.bannerIndex = e.detail.current
			},
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.GoodInfo.goodImgList[index],
					urls: this.GoodInfo.goodImgList
				})
			},
			showCard: function() {
				if (!this.goodsNumber) return;
				this.cardShow = true;
			},
			back: function() {
				uni.navigateBack()
			},
			hideCard: function() {
				this.cardShow = false;
			},
			openMenu: function() {
				this.menuShow = true
			},
			showCoupon: function() {
				this.couponShow = true;
			},
			closeCoupon: function() {
				this.couponShow = false;
			},
			closeMenu: function() {
				this.menuShow = false
			},
			change: function(e) {
				this.value = e.value
			},
			collecting: function() {
				this.collected = !this.collected
			},
			common: function() {
				this.tui.toast("功能开发中~")
			},
			submit() {
				// if (!this.getisLogin) {
				// 	this.$common.jumpToLogin();
				// 	return false;
				// }
				uni.switchTab({
					url: '../cart/cart'
				})
			},
			goodsNumberItemClick(goodsNumber) {
				this.goodsNumber = goodsNumber
				let {
					goodsId,
					goodsName
				} = this.GoodInfo;
				this.addCardAction({
					goodsId,
					goodsName,
					goodsNumber: this.goodsNumber,
					count: this.stockNum,
					isflash: this.isflash,
					selected: true
				})
			},
			bindChange: function(e) {
				this.stockNum = e.value;
				let {
					goodsId,
					goodsName
				} = this.GoodInfo;
				this.addCardAction({
					goodsId,
					goodsName,
					goodsNumber: this.goodsNumber,
					count: this.stockNum,
					isflash: this.isflash,
					selected: true
				})
			},
			submitOrder() {
				if (!this.getisLogin) {
					this.$common.jumpToLogin();
					return false;
				}
				if (!this.stockNum) {
					this.stockNum = 1
				}
				let {
					goodsId,
					goodsName
				} = this.GoodInfo;
				let goodsItemInfo = {
					goodsId,
					goodsName,
					isflash: this.isflash,
					count: this.stockNum,
					selected: true
				}
				// this.emptyAllCardAction()

				this.$api.getGoodsInfoById({
					goodsId: goodsId,
					isflash: this.isflash,
				}, (res) => {
					if (res.code) {
						goodsItemInfo.selected = true;
						goodsItemInfo.goodsNumber = this.goodsNumber
						goodsItemInfo.goodsInfo = res.data
						
						// this.addCardAction(goodsItemInfo)
						uni.setStorage({
							key: 'buylist',
							data: [goodsItemInfo],
							success: () => {
								uni.navigateTo({
									url: '../confirmation/confirmation?isOne=1'
								})
							}
						})
					}
				})
			},
			addCart() {
				if (this.stockNum) {
					this.$common.errorToShow("购物车已存在该商品");
					return;
				}
				let {
					goodsId,
					goodsName
				} = this.GoodInfo;
				this.addCardAction({
					goodsId,
					goodsName,
					goodsNumber: this.goodsNumber,
					isflash: this.isflash,
					selected: true
				})
				this.stockNum = 1;
			},
			getGoodsInfoById() {
				this.$api.getGoodsById({
					goodsId: this.goodsId,
					isflash: this.isflash
				}, (res) => {
					if (res.code) {
						this.GoodInfo = res.data
						if (this.GoodInfo.goodsNumber.length) {
							this.goodsNumber = this.goodsNumber || this.GoodInfo.goodsNumber[0]
						} else {
							this.$common.errorToShow('商品暂时缺货')
							this.goodsNumber = 0
						}
					}
				})
			},
			getGoodsCoupon() {
				this.$api.getGoodsCoupon({
					goodsId: this.goodsId
				}, (res) => {
					if (res.code) {
						this.GoodsCoupon = res.data
					}
				})
			},
			...mapActions({
				addCardAction: 'addCardAction',
				setUserInfoAction: 'setUserInfoAction',
				emptyAllCardAction: 'emptyAllCardAction'
			})
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
		}
	}
</script>

<style lang="scss">
	/* icon 也可以使用组件*/
	@import "../../static/css/icon.css";

	page {
		background: #f7f7f7;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-attr-box {
		font-size: 0;
		padding: 20rpx 0;
	}

	.tui-attr-title {
		padding: 10rpx 0;
		color: #333;
	}

	.container {
		padding-bottom: 110rpx;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9998;
	}

	.tui-attr-active {
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-attr-active::after {
		content: "";
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	.tui-attr-item {
		max-width: 100%;
		min-width: 200rpx;
		height: 64rpx;
		display: -webkit-inline-flex;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f7f7f7;
		padding: 0 26rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
	}

	.container {
		padding-bottom: 110rpx;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9998;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 99999;
	}



	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon {
		border-radius: 16px;
	}


	.tui-icon-back {
		height: 32px !important;
		width: 32px !important;
		display: block !important;
	}

	.tui-header-icon .tui-icon-more-fill {
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;
		display: block !important;
		box-sizing: content-box;
	}

	.tui-banner-swiper {
		position: relative;
	}

	.tui-banner-swiper .tui-tag-class {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 0;
	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}

	/*顶部菜单*/

	.tui-menu-box {
		box-sizing: border-box;
	}

	.tui-menu-header {
		font-size: 34rpx;
		color: #fff;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.tui-top-dropdown {
		z-index: 9999 !important;
	}

	.tui-menu-itembox {
		color: #fff;
		padding: 40rpx 10rpx 0 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		font-size: 26rpx;
	}

	.tui-menu-item {
		width: 22%;
		height: 160rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		margin-right: 4%;
		margin-bottom: 4%;
	}

	.tui-menu-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-badge-box {
		position: relative;
	}

	.tui-badge-box .tui-badge-class {
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.tui-msg-badge {
		top: -10px;
	}

	.tui-icon-up {
		position: relative;
		display: inline-block;
		left: 50%;
		transform: translateX(-50%);
	}

	.tui-menu-text {
		padding-top: 12rpx;
	}

	.tui-opcity .tui-menu-text,
	.tui-opcity .tui-badge-box {
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
	}

	/*顶部菜单*/

	/*内容 部分*/

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}


	.tui-size {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-gray {
		color: #999;
	}

	.tui-icon-red {
		color: #ff201f;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-radius-all {
		border-radius: 24rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding: 30rpx 0;
	}

	.tui-pro-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ff201f;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 44rpx;
	}

	.tui-pro-price {
		display: flex;
		align-items: center;
	}

	.tui-pro-price .tui-tag-class {
		transform: scale(0.7);
		transform-origin: center center;
		line-height: 24rpx;
		font-weight: normal;
	}

	.tui-price {
		font-size: 58rpx;
	}

	.tui-original-price {
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-line-through {
		text-decoration: line-through;
	}

	.tui-collection {
		color: #333;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 44rpx;
	}

	.tui-scale {
		transform: scale(0.7);
		transform-origin: center center;
		line-height: 24rpx;
		font-weight: normal;
	}

	.tui-icon-collection {
		line-height: 20px !important;
		margin-bottom: 0 !important;

	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		box-sizing: border-box;
	}

	.tui-pro-title {
		padding-top: 20rpx;
	}

	.tui-share-btn {
		display: block;
		background: none;
		margin: 0;
		padding: 0;
		border-radius: 0;
	}

	.tui-tag-share {
		display: flex;
		align-items: center;
	}

	.tui-share-position {
		position: absolute;
		right: 0;
		top: 30rpx;
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-sub-title {
		padding: 20rpx 0;
	}

	.tui-sale-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 30rpx;
	}

	.tui-discount-box {
		background: #fff;
	}

	.tui-list-cell {
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.tui-top40 {
		top: 40rpx !important;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-tag-coupon-box {
		display: flex;
		align-items: center;
	}

	.tui-tag-coupon-box .tui-tag-class {
		margin-right: 20rpx;
	}


	.tui-cell-title {
		width: 66rpx;
		flex-shrink: 0;
	}

	/* .tui-inline-block {
		display: inline-block !important;
		transform: scale(0.8);
		transform-origin: 0 center;
	} */

	.tui-basic-info {
		background: #fff;
	}


	.tui-guarantee {
		background: #fdfdfd;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 30rpx 30rpx;
		font-size: 24rpx;
	}

	.tui-guarantee-item {
		color: #999;
		padding-right: 30rpx;
		padding-top: 10rpx;
	}

	.tui-pl {
		padding-left: 4rpx;
	}

	.tui-cmt-box {
		background: #fff;
	}

	.tui-between {
		justify-content: space-between !important;
	}

	.tui-cmt-all {
		color: #ff201f;
		padding-right: 8rpx;
	}

	.tui-cmt-content {
		font-size: 26rpx;
	}

	.tui-cmt-user {
		display: flex;
		align-items: center;
	}

	.tui-acatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
		margin-right: 16rpx;
	}

	.tui-cmt {
		padding: 14rpx 0;
	}

	.tui-attr {
		font-size: 24rpx;
		color: #999;
		padding: 6rpx 0;
	}

	.tui-cmt-btn {
		padding: 50rpx 0 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-tag-cmt {
		min-width: 130rpx;
		padding: 20rpx 52rpx !important;
		font-size: 26rpx !important;
		display: inline-block;
	}

	.tui-nomore-box {
		padding-top: 10rpx;
	}

	.tui-product-img {
		transform: translateZ(0);
	}

	.tui-product-img image {
		width: 100%;
		display: block;
	}

	/*底部操作栏*/

	.tui-col-7 {
		width: 58.33333333%;
	}

	.tui-col-5 {
		width: 41.66666667%;
	}

	.tui-col-3 {
		width: 25%;
	}

	.tui-col-9 {
		width: 75%;
	}

	.tui-operation {
		width: 100%;
		height: 100rpx;
		/* box-sizing: border-box; */
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-left {
		display: flex;
		align-items: center;
	}

	.tui-operation-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	.tui-operation-text {
		font-size: 22rpx;
		color: #333;
	}

	.tui-opacity {
		opacity: 0.5;
	}

	.tui-scale-small {
		transform: scale(0.9);
		transform-origin: center center;
	}

	.tui-operation-right {
		height: 100rpx;
		/* box-sizing: border-box; */
		padding-top: 0;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-btnbox-4 .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	}

	.tui-operation .tui-badge-class {
		position: absolute;
		top: -6rpx;

	}

	.tui-flex-1 {
		flex: 1;
	}

	/*底部操作栏*/

	.coupon-list-window {
		background-color: #f5f5f5;
		border-radius: 16upx 16upx 0 0;
		z-index: 111;


		.title {
			height: 124upx;
			width: 100%;
			text-align: center;
			line-height: 124upx;
			font-size: 32upx;
			font-weight: 700;
			position: relative;
			color: #333;
		}

		.coupon-list {
			overflow: auto;
			padding: 0upx 30upx;

			.item {
				width: 100%;
				height: 170upx;
				margin-bottom: 16upx;

				.money {
					background-image: url('../../static/image/coupon.png');
					background-repeat: no-repeat;
					background-size: 100% 100%;
					width: 240upx;
					height: 100%;
					color: #fff;
					font-size: 36upx;
					font-weight: 700;
					text-align: center;
					line-height: 170upx;

					.num {
						font-size: 60upx;
					}
				}

				.text {
					box-sizing: border-box;
					// box-sizing: content-box;
					height: 100%;
					width: 450upx;
					padding: 0upx 24upx;
					background-color: #fff;

					.condition {
						font-size: 30upx;
						color: #282828;
						height: 93upx;
						line-height: 93upx;
						border-bottom: 1upx solid #f0f0f0;
					}

					.data {
						font-size: 20upx;
						color: #999;
						height: 76upx;
						align-items: center;
						justify-content: space-between;

						.bnt {
							width: 136upx;
							height: 44upx;
							border-radius: 22upx;
							font-size: 22upx;
							color: #fff;
							text-align: center;
							line-height: 44upx;
						}
					}

				}

			}

			.acea-row {
				display: flex;
				flex-wrap: wrap;
			}

			.acea-row.row-center-wrapper {
				align-items: center;
				justify-content: center;
			}
		}

	}

	.line1,
	.line2 {
		overflow: hidden;
	}

	.line1 {
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.bg-color-red {
		background-color: #e93323 !important;
	}

	.pop-t {
		position: relative;
		padding: 30upx 26upx;
		border-bottom: 2upx solid #f3f3f3;
	}

	.goods-img {
		width: 160upx;
		height: 160upx;
		position: absolute;
		top: -20upx;
		background-color: #fff;
		border-radius: 6upx;
		border: 2upx solid #fff;

	}

	.goods-img image {
		height: 100%;
		width: 100%;
	}

	.goods-information {
		width: 420upx;
		display: inline-block;
		margin-left: 180upx;
	}

	.pop-goods-name {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: block;
		font-size: 24upx;
		margin-bottom: 20upx;
	}

	.pop-goods-price {
		font-size: 30upx;
	}

	.close-btn {
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		display: inline-block;
		position: absolute;
		right: 30upx;
	}

	.close-btn image {
		width: 100%;
		height: 100%;
	}


	.pop-m {
		font-size: 28upx;
		margin-bottom: 90upx;
	}

	.goods-specs,
	.goods-number {
		padding: 26upx;
		border-top: 1px solid #f3f3f3;
	}

	.goods-specs:first-child {
		border: none;
	}

	.pop-m-title {
		margin-right: 10upx;
		color: #666;
	}

	.pop-m-bd {
		overflow: hidden;
		margin-top: 10upx;
	}

	.pop-m-item {
		display: inline-block;
		float: left;
		padding: 6upx 16upx;
		background-color: #fff;
		color: #333;
		margin-right: 16upx;
		margin-bottom: 10upx;
	}

	.pop-m-bd-in {
		display: inline-block;
	}

	.goods-bottom,
	.pop-b {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		height: 90upx;
		width: 100%;
		overflow: hidden;
		box-shadow: 0 0 20upx #ccc;

	}

	.btn-b {
		border: 2rpx solid #333;
		background-color: #333;
		color: #fff;
		box-sizing: border-box;
		border-radius: 0;
		font-size: 28rpx;
		height: 100%;
		line-height: 90rpx;
	}

	.red-price {
		color: #FF7159 !important;
	}
</style>
