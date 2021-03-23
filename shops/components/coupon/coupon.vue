<template>
	<view class="coupon bottom-cell-group" v-if="couponData.couponList.length > 0">
		<view class="coupon-item" v-for="(item,index) in couponData.couponList" :key="index" @click="receiveCoupon(item.id)">
			<view class="item" @tap="couponHanderClick(item.url)">
				<image :src="item.imgUrl" mode="widthFix"></image>
				<view class="text">
					<view class="name">{{item.title}}</view>
					<view class="infor">{{item.content}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "coupon",
		props: {
			couponData: {
				required: true,
			}
		},
		methods: {
			// 用户领取优惠券
			receiveCoupon(couponId) {
				let data = {
					promotion_id: couponId
				}
				// this.$api.getCoupon(data, res => {
				// 	if (res.status) {
				// 		this.$common.successToShow(res.msg)
				// 	} else {
				// 		this.$common.errorToShow(res.msg)
				// 	}
				// })
			},
			couponHanderClick(url) {
				this.$common.navigateTo(url)
			}
		}
	}
</script>

<style>
	.coupon {
		padding: 0 26upx;
		background-color: #f8f8f8;
	}

	.coupon-item {
		padding: 10upx;
		background-color: #fff;
		position: relative;
	}

	.coupon-i-l {
		width: 400upx;
		display: inline-block;
	}

	.coupon-i-l-t {
		font-size: 32upx;
		position: relative;
		margin-bottom: 10upx;
	}

	.coupon-i-l-t .icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.coupon-i-l-t text {
		margin-left: 60upx;
	}

	.coupon-i-l-b {
		font-size: 24upx;
		color: #999;
	}

	.coupon-i-r {
		width: 258upx;
		display: inline-block;
		text-align: center;
	}

	.coupon-logo {
		width: 130upx;
		height: 100upx;
	}

	.item image {
		width: 100%;
		height: 100%;
	}

	.item .text {
		position: absolute;
		top: 72upx;
		left: 60upx;
	}

	.name {
		font-size: 28upx;
		color: #fff;
	}

	.infor {
		font-size: 30upx;
		color: hsla(0, 0%, 100%, .8);
		margin-top: 10upx;
	}
</style>
