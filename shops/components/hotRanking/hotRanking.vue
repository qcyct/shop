<template>
	<view class="hotRanking">
		<div class="react-view">
			<div class="react-view-content">
				<div :class="['react-view-img-'+index,'react-view-img']">
				</div>
			</div>
			<span class="react-view-Num">{{index}}</span>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		props:{
			index:Number
		}
	}
</script>

<style lang="scss">
	.hotRanking {
		.react-view {
			position: absolute;
			top: 0upx;
			left: 6upx;
			width: 50upx;
			height: 62upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			z-index: 10;

			.react-view-content {
				position: absolute;
				top: 0upx;
				left: 0upx;
				width: 100%;
				height: 100%;

				.react-view-img {
					position: absolute;
					top: 0upx;
					left: 0upx;
					width: 100%;
					height: 100%;
					background-image: url('../../static/image/hot_all.png');
					background-size: cover;
					background-repeat: no-repeat;
					background-position: 50% center;

					&.react-view-img-1 {
						background-image: url('../../static/image/hot_one.png');
					}

					&.react-view-img-2 {
						background-image: url('../../static/image/hot_two.png');
					}

					&.react-view-img-3 {
						background-image: url('../../static/image/hot_three.png');
					}
				}
			}

			.react-view-Num {
				display: inline-block;
				margin: 24upx 0upx 0upx;
				padding: 0px;
				font-size: 26upx;
				color: rgb(36, 38, 53);
				max-width: 50upx;
				z-index: 2;
				line-height: 30upx;
			}
		}
	}
</style>
