<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box">
			<view class="tui-header" :style="{width:width+'px',height:height+'px'}">
				<view class="tui-back" :style="{marginTop:arrowTop+'px'}" @tap="back">
					<tui-icon name="arrowleft" color="#000"></tui-icon>
				</view>
				<view class="tui-searchbox tui-search-mr" :style="{marginTop:inputTop+'px'}" @tap="search">
					<icon type="search" :size='13' color='#999'></icon>
					<text class="tui-search-text" v-if="!searchKey">搜索商品</text>
					<template v-else>
						<block v-if="Array.isArray(searchKey)">
							<view class="tui-search-key" v-for="(searchKeyItem,searchKeyIndex) in searchKey" :key="searchKeyIndex">
								<view class="tui-key-text">{{searchKeyItem}}</view>
								<tui-icon name="shut" :size='12' color='#fff'></tui-icon>
							</view>
						</block>
						<view class="tui-search-key" v-else>
							<view class="tui-key-text">{{searchKey}}</view>
							<tui-icon name="shut" :size='12' color='#fff'></tui-icon>
						</view>
					</template>
				</view>
			</view>
		</view>
		<!--header-->

		<!--screen-->
		<view class="tui-header-screen" :style="{top:height+'px'}">
			<view class="tui-screen-top">
				<view class="tui-top-item tui-icon-ml" :class="[tabIndex==0?'tui-active tui-bold':'']" data-index="0" @tap="screen">
					<view>{{selectedName}}</view>
					<tui-icon :name="selectH>0?'arrowup':'arrowdown'" :size="14" :color="tabIndex==0?'#e41f19':'#444'" tui-icon-class="tui-ml"></tui-icon>
				</view>
				<view class="tui-top-item" :class="[tabIndex==1?'tui-active tui-bold':'']" @tap="screen" data-index="1">销量</view>
				<view class="tui-top-item" @tap="screen" data-index="2">
					<tui-icon :name="isList?'manage':'listview'" :size="isList?22:18" :bold="isList?false:true" color="#333"></tui-icon>
				</view>
				<!--下拉选择列表--综合-->
				<view class="tui-dropdownlist" :class="[selectH>0?'tui-dropdownlist-show':'']" :style="{height:selectH+'rpx'}">
					<view class="tui-dropdownlist-item tui-icon-middle" :class="[item.selected?'tui-bold':'']" v-for="(item,index) in dropdownList"
					 :key="index" @tap.stop="dropdownItem" :data-index="index">
						<text class="tui-ml tui-middle">{{item.name}}</text>
						<tui-icon name="check" :size="16" color="#e41f19" :bold="true" v-if="item.selected" tui-icon-class="tui-middle"></tui-icon>
					</view>
				</view>
				<view class="tui-dropdownlist-mask" :class="[selectH>0?'tui-mask-show':'']" @tap.stop="hideDropdownList"></view>
				<!--下拉选择列表--综合-->

			</view>
		</view>
		<!--screen-->

		<!--list-->
		<view class="tui-product-list" :style="{marginTop:px(dropScreenH)}">
			<view class="tui-product-container">
				<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2!=0 || isList">
					<!-- <template is="productItem" data="{{item,index:index,isList:isList}}" /> -->
					<!--商品列表-->
					<view class="tui-pro-item" :class="[isList?'tui-flex-list':'']" hover-class="hover" :hover-start-time="150" @tap="detail(item.goodsId)">
						<image :src="item.goodsImg" class="tui-pro-img" :class="[isList?'tui-proimg-list':'']" mode="widthFix" />
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{item.goodsName}}</view>
							<view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">￥{{item.goodsSale}}</text>
									<text class="tui-factory-price">￥{{item.goodsFactory}}</text>
								</view>
								<view class="tui-pro-pay">{{item.goodsPayNum}}人付款</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="tui-product-container" v-if="!isList">
				<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2==0">
					<!-- <template is="productItem" data="{{item,index:index}}" /> -->
					<!--商品列表-->
					<view class="tui-pro-item" :class="[isList?'tui-flex-list':'']" hover-class="hover" :hover-start-time="150" @tap="detail(item.goodsId)">
						<image :src="item.goodsImg" class="tui-pro-img" :class="[isList?'tui-proimg-list':'']" mode="widthFix" />
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{item.goodsName}}</view>
							<view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">￥{{item.goodsSale}}</text>
									<text class="tui-factory-price">￥{{item.goodsFactory}}</text>
								</view>
								<view class="tui-pro-pay">{{item.goodsPayNum}}人付款</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
		</view>

		<!--list-->


		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore :visible="!pullUpOn && isList" bgcolor="#f7f7f7"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKey: "", //搜索关键词
				width: 200, //header宽度
				height: 64, //header高度
				inputTop: 0, //搜索框距离顶部距离
				arrowTop: 0, //箭头距离顶部距离
				dropScreenH: 0, //下拉筛选框距顶部距离
				tabIndex: 0, //顶部筛选索引
				isList: false, //是否以列表展示  | 列表或大图
				selectedName: "综合",
				selectH: 0,
				dropdownList: [{
					name: "综合",
					selected: true
				}, {
					name: "价格升序",
					selected: false,
				}, {
					name: "价格降序",
					selected: false,
				}],
				pageIndex: 1,
				pageLimit: 6,
				loadding: false,
				pullUpOn: true,
				productList: []
			}
		},
		onLoad: function(options) {
			let obj = {};
			obj = wx.getMenuButtonBoundingClientRect();
			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight + 7);
					this.arrowTop = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					let searchKey = options.searchKey || "";
					if (searchKey) {
						searchKey = searchKey.split("-")
						this.searchKey = searchKey;
					} else {
						this.searchKey = "";
					}
					let type = options.type || 'category'
					this.getGoodsInfoByType(type);
					//略小，避免误差带来的影响
					this.dropScreenH = this.height * 750 / res.windowWidth + 89;
				}
			})
		},
		methods: {
			px(num) {
				return uni.upx2px(num) + "px"
			},
			showDropdownList: function() {
				this.selectH = 246;
				this.tabIndex = 0;
			},
			hideDropdownList: function() {
				this.selectH = 0
			},
			dropdownItem: function(e) {
				let index = e.currentTarget.dataset.index;
				let arr = this.dropdownList;
				for (let i = 0; i < arr.length; i++) {
					if (i === index) {
						arr[i].selected = true;
					} else {
						arr[i].selected = false;
					}
				}
				this.dropdownList = arr;
				this.selectedName = index == 0 ? '综合' : '价格';
				this.selectH = 0
			},
			screen: function(e) {
				let index = e.currentTarget.dataset.index;
				if (index == 0) {
					this.showDropdownList();
				} else if (index == 1) {
					this.tabIndex = 1
				} else if (index == 2) {
					this.isList = !this.isList
				}
			},
			search: function() {
				uni.navigateTo({
					url: '../news-search/news-search'
				})
			},
			detail: function(goodsId) {
				uni.navigateTo({
					url: '../productDetail/productDetail?goodsId=' + goodsId
				})
			},
			back: function() {
				uni.navigateBack()
			},
			getGoodsInfoByType(type) {
				this.$api.getGoodsInfoByType({
					searchKey: this.searchKey,
					type: type
				}, (res) => {
					if (res.code) {
						this.productList = res.data
					}
				})
			}
		},
		onPullDownRefresh: function() {
			let loadData = JSON.parse(JSON.stringify(this.productList));
			loadData = loadData.splice(0, 10);
			this.productList = loadData;
			this.pageIndex = 1;
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh()
		},
		onReachBottom: function() {
			// if (!this.pullUpOn) return;
			// this.loadding = true;
			// this.$api.getGoodsInfo({
			// 	page: this.pageIndex,
			// 	limit: this.pageLimit,
			// 	goodsName: this.searchKey
			// }, (res) => {
			// 	if (res.code) {
			// 		this.productList = this.productList.concat(this.$util.GetimgUrl(res.data, 'goodsImg'));
			// 		this.pageIndex = this.pageIndex + 1;
			// 		this.loadding = false
			// 	} else {
			// 		this.loadding = false;
			// 		this.pullUpOn = false
			// 	}
			// })
		}
	}
</script>

<style scoped>
	page {
		background: #f7f7f7;
	}

	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tui-header-box {
		width: 100%;
		background: #fff;
		position: fixed;
		z-index: 99998;
		left: 0;
		top: 0;
	}

	.tui-header {
		display: flex;
		align-items: flex-start;
	}

	.tui-back {
		margin-left: 8rpx;
		height: 32px !important;
		width: 32px !important;
	}

	.tui-searchbox {
		width: 100%;
		height: 30px;
		margin-right: 30rpx;
		border-radius: 15px;
		font-size: 12px;
		background: #f7f7f7;
		padding: 3px 10px;
		box-sizing: border-box;
		color: #999;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.tui-search-mr {
		margin-right: 20rpx !important;
	}



	.tui-search-text {
		padding-left: 16rpx;
		width: 100%;
	}

	.tui-search-key {
		max-width: 80%;
		height: 100%;
		padding: 0 16rpx;
		margin-left: 12rpx;
		display: flex;
		align-items: center;
		border-radius: 15px;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
	}

	.tui-key-text {
		box-sizing: border-box;
		padding-right: 12rpx;
		font-size: 12px;
		line-height: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/*screen*/

	.tui-header-screen {
		width: 100%;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		z-index: 1000;
	}

	.tui-screen-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	}

	.tui-screen-top {
		height: 88rpx;
		position: relative;
		background: #fff;
	}

	.tui-top-item {
		height: 28rpx;
		line-height: 28rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-topitem-active {
		color: #e41f19;
	}



	.tui-btmItem-active {
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-btmItem-active::after {
		content: "";
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-active {
		color: #e41f19;
	}

	.tui-icon-ml .tui-icon-class {
		margin-left: 6rpx;
	}

	.tui-ml {
		margin-left: 6rpx;
	}

	.tui-seizeaseat-20 {
		height: 20rpx;
	}

	.tui-seizeaseat-30 {
		height: 30rpx;
	}

	.tui-icon-middle .tui-icon-class {
		vertical-align: middle;
	}

	.tui-middle {
		vertical-align: middle;
	}

	/*screen*/

	/*顶部下拉选择 属性*/

	.tui-red-hover {
		background: #c51a15 !important;
		color: #e5e5e5;
	}


	.tui-white-hover {
		background: #e5e5e5;
		color: #2e2e2e;
	}

	/*顶部下拉选择 属性*/

	/*顶部下拉选择 综合*/

	.tui-dropdownlist {
		width: 100%;
		position: absolute;
		background: #fff;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 10rpx;
		padding-bottom: 26rpx;
		left: 0;
		top: 88rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 999;
	}

	.tui-dropdownlist-show {
		visibility: visible;
	}

	.tui-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}

	.tui-dropdownlist-item {
		color: #333;
		height: 70rpx;
		font-size: 28rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/*顶部下拉选择 综合*/


	/* 商品列表*/

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 10rpx;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 10rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
	}

	.tui-flex-list {
		display: flex;
		margin-bottom: 1rpx !important;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-proimg-list {
		width: 260rpx;
		height: 260rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}

	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}

	/* 商品列表*/
</style>
