<template>
	<view class="list_box">
		<view class="left">
			<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }">
				<view class="item" v-for="(item,index) in leftArray" :key="index" :class="{ 'active':index==leftIndex }"
				 :data-index="index" @tap="leftTap">{{item.categoryName}}</view>
			</scroll-view>
		</view>
		<view class="main">
			<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }" @scroll="mainScroll" :scroll-into-view="scrollInto"
			 scroll-with-animation="true" @touchstart="mainTouch" id="scroll-el">
				<view class="item" v-for="(item,index) in mainArray" :key="index" :id="'item-'+index">
					<div class="title acea-row row-center-wrapper">
						<div class="line"></div>
						<div class="name">{{item.title}}</div>
						<div class="line"></div>
					</div>
					<view class="list acea-row">
						<view class="goods" v-for="(classItem,classIndex) in item.list" :key="classIndex">
							<view @tap="toProductList" class="itemShop" :data-key="classItem.categoryinfoName" :data-onekey="item.title">
								<view class="picture">
									<image :src="classItem.categoryinfoUrl"></image>
								</view>
								<view class="name line1">{{classItem.categoryinfoName}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollHeight: '',
				leftArray: [],
				mainArray: [],
				topArr: [],
				leftIndex: 0,
				isMainScroll: false,
				scrollInto: ''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					/* 设置当前滚动容器的高，若非窗口的告诉，请自行修改 */
					this.scrollHeight = `${res.windowHeight}px`;
				}
			});
		},
		computed: {

		},
		mounted() {
			this.getListData();
		},
		methods: {
			/* 获取列表数据 */
			getListData() {
				this.$api.getCategoryList(res => {
					if (res.code) {
						this.leftArray = res.leftArray;
						this.mainArray = res.mainArray;
						this.$nextTick(() => {
							this.getElementTop();
						});
					}
				})

			},
			/* 获取元素顶部信息 */
			getElementTop() {
				/* Promise 对象数组 */
				let p_arr = [];

				/* 新建 Promise 方法 */
				let new_p = (selector) => {
					return new Promise((resolve, reject) => {
						let view = uni.createSelectorQuery().select(selector);
						view.boundingClientRect(data => {
							resolve(data.top)
						}).exec();
					})
				}

				/* 遍历数据，创建相应的 Promise 数组数据 */
				this.mainArray.forEach((item, index) => {
					p_arr.push(new_p(`#item-${index}`));
				});

				/* 主区域滚动容器的顶部距离 */
				new_p("#scroll-el").then((res) => {
					let top = res;
					/* 所有节点信息返回后调用该方法 */
					Promise.all(p_arr).then((data) => {
						this.topArr = data;
					});
				})
			},
			/* 主区域滚动监听 */
			mainScroll(e) {
				if (!this.isMainScroll) {
					return;
				}
				let top = e.detail.scrollTop;
				let index = -1;

				if (top >= this.topArr[this.topArr.length - 1]) {
					index = this.topArr.length - 1;
				} else {
					index = this.topArr.findIndex((item, index) => {
						return this.topArr[index + 1] >= top;
					});
				}
				this.leftIndex = (index < 0 ? 0 : index);
			},
			/* 主区域触摸 */
			mainTouch() {
				this.isMainScroll = true;
			},
			/* 左侧导航点击 */
			leftTap(e) {
				let index = e.currentTarget.dataset.index;
				this.isMainScroll = false;
				this.leftIndex = Number(index);
				this.scrollInto = `item-${index}`;

			},
			toProductList(e) {
				let key = e.currentTarget.dataset.key || "";
				let onekey = e.currentTarget.dataset.onekey || "";
				if (key == '所有商品') {
					uni.navigateTo({
						url: '../productList/productList'
					})
				} else {
					uni.navigateTo({
						url: '../productList/productList?searchKey=' + onekey + "-" + key
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.list_box {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		font-size: 28rpx;

		.left {
			width: 200rpx;
			background-color: #f6f6f6;
			line-height: 80rpx;
			box-sizing: border-box;
			font-size: 32rpx;
			text-align: center;

			.item {
				line-height: 100upx;
				position: relative;
				height: 100upx;

				&:not(:first-child) {
					margin-top: 1px;

					&::after {
						content: '';
						display: block;
						height: 0;
						border-top: #d6d6d6 solid 1px;
						width: 620upx;
						position: absolute;
						top: -1px;
						right: 0;
						transform: scaleY(0.5);
						/* 1px像素 */
					}
				}

				&.active,
				&:active {
					background-color: #fff;
					border-left: 4upx solid #fc4141;
					width: 100%;
					color: #fc4141;
					font-weight: 700;
				}
			}
		}

		.main {
			background-color: #fff;
			padding-left: 20rpx;
			width: 0;
			flex-grow: 1;
			box-sizing: border-box;


			.title {
				line-height: 64rpx;
				position: relative;
				font-size: 24rpx;
				font-weight: bold;
				color: #666;
				height: 64rpx;
			}

			.item {
				margin-bottom: 28rpx;
			}

			.row-middle {}

			.goods {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;
				margin-bottom: 10rpx;

				&>image {
					width: 120rpx;
					height: 120rpx;
					margin-right: 16rpx;
				}

				.describe {
					font-size: 24rpx;
					color: #999;
				}

				.money {
					font-size: 24rpx;
					color: #efba21;
				}
			}
		}
	}

	.title .line {
		width: 100upx;
		height: 2upx;
		background-color: #999;
	}

	.title .name {
		font-size: 28upx;
		color: #333;
		margin: 30upx;
		font-weight: 700;
	}

	.acea-row.row-center-wrapper {
		align-items: center;
		justify-content: center;
	}

	.acea-row {
		display: flex;
		flex-wrap: wrap;
	}

	.listw {
		padding-top: 20upx;
	}

	.list {
		min-height: 200upx;
	}

	.itemShop .picture {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}

	.itemShop .name {
		font-size: 24upx;
		color: #333;
		height: 56upx;
		line-height: 56upx;
		width: 120upx;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.itemShop {
		width: 177upx;
		margin-top: 26upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
</style>
