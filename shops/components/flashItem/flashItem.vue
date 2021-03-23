<template>
	<view class="flashItem">
		<view class="list">
			<view class="item acea-row row-between-wrapper" v-for="(item,index) in flashList" :key="index" @click="addCard(item)">
				<view class="pictrue">
					<image :src="item.goodsImg"></image>
				</view>
				<view class="text acea-row row-column-around">
					<view class="line1">{{item.goodsName}}</view>
					<view class="money">
						限时价<text class="num font-color-red">￥${{item.flashMon}}</text>
					</view>
					<view class="progress cart-color">
						<view class="bg-red" :style="'width: '+SurplusNum(item.flashNum,item.flashPayNum).float+';'"></view>
						<view class="piece font-color-red">仅剩{{SurplusNum(item.flashNum,item.flashPayNum).Num}}件</view>
					</view>
				</view>
				<view class="grab bg-color-red">{{item.state}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cmdProgress from "@/components/cmd-progress/cmd-progress.vue"
	export default {
		components: {
			cmdProgress
		},
		data() {
			return {

			};
		},
		props: {
			flashList: Array
		},
		methods: {
			SurplusNum(flashNum, flashPayNum) {
				return {
					Num: Number(flashNum) - Number(flashPayNum),
					float: this.$common.GetPercent(Number(flashNum) - Number(flashPayNum), flashNum)
				}
			},
			addCard(item) {
				if (item.state == '进行中') {
					uni.showModal({
						content: `是否参加${item.goodsName}商品秒杀`,
						success: (res) => {
							if (res.confirm) {
								let url = '../productDetail/productDetail?goodsId=' + item.goodsId + '&isflash=1';
								this.$common.navigateTo(url);
							}
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.flashItem {
		.list {
			.item {
				padding: 30upx;
				border-bottom: 1px solid #f0f0f0;
				height: 227upx;
				position: relative;
				display: flex;

				.pictrue {
					width: 166upx;
					height: 166upx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 6upx;
						border: 0;
					}
				}

				.text {
					width: 500upx;
					font-size: 30upx;
					color: #333;
					height: 166upx;
					flex-flow: column;
					justify-content: space-around;

					.progress {
						overflow: hidden;
						background-color: #fff;
						width: 260upx;
						border-radius: 20upx;
						height: 34upx;
						position: relative;

						.bg-red {
							width: 0;
							height: 100%;
							transition: width .6s ease;
							background-color: #ffe3e1;
						}

						.piece {
							position: absolute;
							left: 50%;
							transform: translate(-50%, -50%);
							top: 49%;
							font-size: 22upx;
						}
					}
				}

				.money {
					font-size: 24upx;
					color: #282828;
					margin-top: -13upx;

					.num {
						font-size: 34upx;
						font-weight: 700;
					}
				}

				.grab {
					font-size: 28upx;
					color: #fff;
					width: 140upx;
					height: 54upx;
					border-radius: 4upx;
					text-align: center;
					line-height: 54upx;
					position: absolute;
					right: 30upx;
					bottom: 30upx;
				}
			}
		}
	}

	.acea-row.row-between-wrapper {
		justify-content: space-between;
	}

	.acea-row.row-between-wrapper,
	.acea-row.row-center-wrapper {
		align-items: center;
	}

	.acea-row {
		display: flex;
		flex-wrap: wrap;
	}

	.line1 {
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.line1,
	.line2 {
		overflow: hidden;
	}

	.font-color-red {
		color: #fc4141 !important;
	}

	.bg-color-red {
		background-color: #e93323 !important;
	}

	.cart-color {
		color: #ff3700 !important;
		border: 1upx solid #ff3700 !important;
	}
</style>
