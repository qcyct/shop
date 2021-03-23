<template>
	<view>
		<template v-if="isEnd==0">
			<view class="countDown font-color-red acea-row row-center-wrapper">
				<view class="activity">活动已结束</view>
			</view>
		</template>
		<template v-else-if="isEnd==2">
			<view class="countDown font-color-red acea-row row-center-wrapper">
				<view class="activity">活动还未开始</view>
			</view>
		</template>
		<template v-else>
			<view class="tui-countdown acea-row row-center-wrapper">
				<view class="tui-countdown-content">
					<text class="tui-countdown-content-text">距结束仅剩</text>
					<tui-countdown :time="countdownData" color="#fff" bcolor="#e41f19" bgcolor="#e41f19" colonColor="#e41f19" :height="40"
					 :width="40" :size="26" :colonsize="32"></tui-countdown>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			item: Object,
			endTime: String
		},
		computed: {
			isEnd: function() {
				let flog = 1;
				// console.log(this.item.state)
				switch (this.item.state) {
					case "还未开始":
						flog = 2;
						break;
					case "已结束":
						flog = 0;
						break;
					case "进行中":
						flog = 1;
						break;
					default:
						break;
				}
				return flog;
			},
			countdownData: function() {
				return this.$common.getFlashTime(this.endTime);
			}
		}
	}
</script>

<style lang="scss">
	.countDown {
		height: 92upx;
		border-bottom: 1upx solid #f0f0f0;
		font-size: 28upx;
		color: #282828;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

		.activity {
			color: #333;
		}
	}

	.font-color-red {
		color: #fc4141 !important;
	}

	.tui-countdown {
		height: 92upx;
		border-bottom: 1upx solid #f0f0f0;
		font-size: 28upx;
		color: #282828;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.tui-countdown-text {
		font-size: 30rpx;
		line-height: 30rpx;
		color: #555;
	}

	.tui-countdown-content {
		display: flex;
		align-items: center;
	}

	.tui-countdown-content-text {
		margin-right: 10upx;
	}
</style>
