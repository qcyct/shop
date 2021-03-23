<template>
	<view class="hotSale">
		<view class="header">
			<img-slide :imgSlideData="imgSlideData"></img-slide>
		</view>
		<hotItem :hotItemList="hotItemList"></hotItem>
	</view>
</template>

<script>
	import hotItem from '../../components/hotItem/hotItem.vue';
	import imgSlide from '@/components/imgSlide/imgSlide';
	export default {
		components: {
			hotItem,
			imgSlide
		},
		data() {
			return {
				imgSlideData: {
					duration: 2500,
					listImg: []
				},
				hotItemList: []
			};
		},
		methods: {
			getimgSlideDataHot() {
				this.$api.getimgSlideDataHot(res => {
					if (res.code) {
						this.imgSlideData.listImg = res.data;
					}
				})
			},
			gethotSaleList() {
				this.$api.gethotSaleList(res => {
					if (res.code) {
						this.hotItemList = res.data
					}
				})
			}
		},
		onLoad() {
			this.getimgSlideDataHot();
			this.gethotSaleList();
		}
	}
</script>

<style lang="scss">
	.header {
		width: 100%;

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
