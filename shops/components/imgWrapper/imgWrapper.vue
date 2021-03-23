<template>
	<view>
		<view class="wrapper">
			<view class="title acea-row row-between-wrapper">
				<view class="text">
					<view class="name line1">快速选择</view>
					<view class="line1">上百种商品分类任您选择</view>
				</view>
				<view class="more"><text>更多</text>
					<tui-icon name="arrowright" :size="26" color="#555"></tui-icon>
				</view>
			</view>
			<view class="scroll-product">
				<scroll-view class="swiper-wrapper" scroll-x scroll-with-animation show-scrollbar>
					<view class="swiper-wrapper-content">
						<view class="swiper-slide swiper-slide-active" v-for="(item) in imgWrapperData.imgWrapperList" :key="item.categoryinfoId">
							<view>
								<view class="img-box">
									<image :src="item.categoryinfoUrl"></image>
								</view>
								<view class="pro-info line1">{{item.categoryinfoName}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
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
			imgWrapperData: {
				required: true,
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		background-color: #fff;
		box-sizing: border-box;
		outline: 0;
	}

	.wrapper .title {
		border-top: 1upx solid #eee;
		padding-top: 34upx;
		margin: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		outline: 0;
	}

	.wrapper .title .text {
		font-size: 24upx;
		color: #999;
		width: 530upx;
		text-align: left;
	}

	.wrapper .title .text .name {
		color: #282828;
		font-size: 30upx;
		font-weight: 700;
		margin-bottom: 5upx;
		position: relative;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		overflow: hidden;
	}

	.line1 {
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.wrapper .title .more {
		font-size: 26upx;
		color: #333;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.wrapper .scroll-product {
		white-space: nowrap;
		margin-top: 38upx;
		padding: 0 3upx 37upx 3upx;
		overflow: hidden;
	}

	.swiper-wrapper {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: flex;
		padding: 0upx 20upx;
	}

	.wrapper .scroll-product .swiper-slide {
		width: 180upx;
		flex-shrink: 0;
		margin-right: 19upx;
		border-bottom: 4upx solid #47b479;
		box-shadow: 0 15upx 15upx -1upx #eee;
		height: 100%;
		position: relative;
	}

	.wrapper .scroll-product .swiper-slide .img-box {
		width: 100%;
		height: 180upx;
	}

	.wrapper .scroll-product .swiper-slide .pro-info {
		font-size: 24upx;
		color: #282828;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
		border: 1upx solid #f5f5f5;
		border-bottom: 0;
		border-top: 0;
		padding: 10upx;
	}

	.wrapper .scroll-product .swiper-slide .img-box image {
		width: 100%;
		height: 100%;
		border-radius: 6upx 6upx 0 0;
	}

	.wrapper .scroll-product .swiper-slide:nth-of-type(3n) {
		border-bottom: 4upx solid #ff6960;
	}

	.wrapper .scroll-product .swiper-slide:nth-of-type(3n-1) {
		border-bottom: 4upx solid #579afe;
	}

	.swiper-wrapper-content {
		display: flex;
		width: auto;
	}
</style>
