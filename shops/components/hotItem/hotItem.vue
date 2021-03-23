<template>
	<view class="hotItem">
		<view class="list">
			<view class="item acea-row row-between-wrapper" v-for="(item,index) in hotItemList" :key="item.goodsId">
				<view class="pictrue">
					<hot-ranking :index="(index+1)"></hot-ranking>
					<image :src="item.goodsImg"></image>
				</view>
				<view class="text acea-row row-column-around">
					<view class="line1">{{item.goodsName}}</view>
					<view class="money">
						售价<text class="num font-color-red">{{item.goodsSale}}</text>
					</view>
					<view class="progress cart-color">
						<view class="bg-red" :style="'width: '+SurplusNum(item.goodsNum,item.goodsPayNum).float+';'"></view>
						<view class="piece font-color-red">仅剩{{SurplusNum(item.goodsNum,item.goodsPayNum).Num}}件</view>
					</view>
				</view>
				<view class="grab bg-color-red" @click="addCard(item)">购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import hotRanking from '../../components/hotRanking/hotRanking.vue';
	export default {
		components: {
			hotRanking
		},
		data() {
			return {

			};
		},
		props: {
			hotItemList: Array
		},
		methods: {
			SurplusNum(goodsNum, goodsPayNum) {
				return {
					Num: Number(goodsNum) - Number(goodsPayNum),
					float: this.$common.GetPercent(Number(goodsNum) - Number(goodsPayNum), goodsNum)
				}
			},
			addCard(item) {
				let url = '../productDetail/productDetail?goodsId=' + item.goodsId;
				this.$common.navigateTo(url);
			}
		}
	}
</script>

<style lang="scss">
	.hotItem {
		.list {
			.item {
				padding: 30upx;
				border-bottom: 1px solid #f0f0f0;
				height: 227upx;
				position: relative;
				display: flex;

				.pictrue {
					position: relative;
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
					position: relative;
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
	}
</style>
