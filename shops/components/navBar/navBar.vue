<template>
	<view class="imgnavbar bottom-cell-group">
		<view class="imgnavbar-list" v-bind:class="'row'+navBarListStyleNum">
			<view class="imgnavbar-item" ref="imgwitem" v-for="(item, index) in navBarData.navBarList" :key="index">
				<image class="imgnavbar-item-img" :src="item.image" mode="aspectFill" @click="showSliderInfo(item.url)"></image>
				<view class="imgnavbar-item-text">{{item.text}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "navBar",
		props: {
			navBarData: {
				required: true,
			}
		},
		data() {
			return {

			}
		},
		methods: {
			showSliderInfo(val) {
				if (val == '/pages/classify/classify' || val == '/pages/cart/cart' || val == '/pages/member/member') {
					uni.switchTab({
						url: val
					});
					return;
				} else {
					this.$common.navigateTo(val);
					return;
				}
			}
		},
		computed: {
			navBarListStyleNum() {
				let len = this.navBarData.navBarList.length;
				let lenNum = Math.ceil(len / 2);
				if (len <= 5) {
					if (len <= 3) {
						return 3;
					} else {
						return len;
					}
				} else {
					return lenNum;
				}
			}
		}
	}
</script>

<style lang="scss">
	.imgnavbar {
		width: 100%;
		background-color: #fff;
	}

	.imgnavbar-list {
		overflow: hidden;
		padding: 24upx 0 0;
	}

	/* 堆积两列 */
	.imgnavbar-list .imgnavbar-item {
		height: auto;
		float: left;
		padding: 0upx 10upx;
		margin-bottom: 20upx;
		text-align: center;
	}

	.imgnavbar-list .imgnavbar-item image {
		width: 90upx;
		height: 90upx;
		margin-bottom: 6upx;
	}

	.imgnavbar-item-text {
		font-size: 26upx;
		color: #666;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.imgnavbar-list.row3 .imgnavbar-item {
		width: 33.3%;
	}

	.imgnavbar-list.row4 .imgnavbar-item {
		width: 25%;
	}

	.imgnavbar-list.row5 .imgnavbar-item {
		width: 20%;
	}

	.imgnavbar-list.row5 .imgnavbar-item .imgnavbar-item-text {
		font-size: 24upx;
	}
</style>
