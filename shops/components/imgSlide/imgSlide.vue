<template>
	<view class='swiper bottom-cell-group' v-if="imgSlideData.listImg.length > 0">
		<swiper class="swiper-c"  :circular="swiper.circular" :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="imgSlideData.duration"
		 :duration="swiper.duration">
			<swiper-item class="have-none" v-for="(item, index) in imgSlideData.listImg" :key="index">
				<image class='' :src="item.activityimgurl" @click="showSliderInfo(item.activityimgpageurl)" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "imgSlide",
		props: {
			imgSlideData: {
				required: true,
			}
		},
		data() {
			return {
				swiper: {
					indicatorDots: true,
					autoplay: true,
					duration: 500,
					circular:true
				},
			};
		},
		methods: {
			// 广告点击查看详情
			showSliderInfo(val) {
				this.goodsDetail(val)
			},
			//跳转到商品详情页面
			goodsDetail: function(id) {
				// let url = '/pages/goods/index/index?id=' + id;
				// this.$common.navigateTo(url);
			},
		}
	}
</script>

<style>
	.swiper {
		height: 340upx;
	}
</style>
