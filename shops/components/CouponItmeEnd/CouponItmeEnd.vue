<template>
	<view class="productDetail">
		<view class="coupon-list">
			<view class="item acea-row row-center-wrapper">
				<view class="money">
					￥<text class="num">{{CouponListItem.couponMon}}</text></view>
				<view class="text">
					<view class="condition line1">
						{{CouponListItem.goodsName}}购物满{{CouponListItem.couponMin}}元可用
					</view>
					<view class="data acea-row row-between-wrapper">
						<view>
							{{CouponListItem.startTime}}--{{CouponListItem.endTime}}
						</view>
						<view class="bnt acea-row row-center-wrapper bg-color-red" @click="addCoupon(CouponListItem.couponId,CouponListItem.goodsName)">
							已失效
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			CouponListItem: Object
		},
		methods: {
			addCoupon(couponId, goodsName) {
				uni.showModal({
					content: `是否领取${goodsName}商品优惠卷`,
					success: (res) => {
						if (res.confirm) {
							this.$api.addCouponByUser({
								couponId: couponId
							}, (res) => {
								if (res.code) {
									this.$common.successToShow("领取优惠卷成功")
								} else {
									this.$common.errorToShow(res.data)
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-list {
		.item {
			width: 100%;
			height: 170upx;
			margin-bottom: 16upx;

			.money {
				background-image: url('../../static/image/couponend.png');
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
					width: 100%;
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
		background-color: #ccc !important;
	}
</style>
