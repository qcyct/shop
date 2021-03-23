<template>
	<view class="flashshop">
		<view class="header">
			<img-slide :imgSlideData="imgSlideData"></img-slide>
		</view>
		<view class="container">
			<view class="shortTab" v-if="tabbar.length<=3">
				<view v-for="(item,index) in tabbar" :key="index" class='navTabItem' :class="index===currentTab?'active':''" @click='navClick(index)'>
					<view class="van-tab" aria-selected="true" style="flex-basis: 22%;">
						<view class="van-ellipsis">
							<view>
								<view class="timeItem">
									<view class="time">05:00</view>
									<view class="state">已结束</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<template v-if="tabbar.length>3">
				<scroll-view scroll-x scroll-with-animation class="tab-view" :scroll-left="scrollLeft">
					<view v-for="(item,index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab==index ? 'active' : '']"
					 :data-current="index" @tap.stop="swichNav">
						<view class="van-tab" aria-selected="true" style="flex-basis: 22%;">
							<view class="van-ellipsis">
								<view>
									<view class="timeItem">
										<view class="time">{{item.time}}</view>
										<view class="state">{{item.state}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
			<swiper class="tab-content" style="min-height: 90vh;" :current="currentTab" duration="300" @change="switchTab">
				<swiper-item v-for="(item,index) in tabbarDataList" :key="index">
					<scroll-view scroll-y class="scoll-y">
						<view class="scrollContent">
							<flash-head-text :item="item" :endTime="endTime"></flash-head-text>
							<flashItem :flashList="item.List"></flashItem>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>

		</view>
	</view>
</template>

<script>
	let that = null;
	import flashHeadText from '../../components/flashHeadText/flashHeadText.vue';
	import flashItem from '../../components/flashItem/flashItem.vue';
	import imgSlide from '@/components/imgSlide/imgSlide';
	export default {
		components: {
			flashHeadText,
			flashItem,
			imgSlide
		},
		data() {
			return {
				tabbar: [],
				winHeight: "", //窗口高度
				currentTab: 0, //预设当前项的值
				scrollLeft: 0, //tab标题的滚动条位置
				isWidth: 0,
				endTime: '',
				isLongWidth: 0,
				imgSlideData: {
					duration: 2500,
					listImg: []
				},
				tabbarDataList: []
			}
		},
		onLoad: function() {
			that = this;
			//  高度自适应
			uni.getSystemInfo({
				success: function(res) {
					// let calc = res.windowHeight;
					// that.winHeight = calc;
				}
			});
			that.getFlashList()
			that.getimgSlideDataFlash();
		},
		methods: {
			// 滚动切换标签样式
			switchTab: function(e) {
				let that = this;
				this.currentTab = e.detail.current;
				this.checkCor();
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				if (this.currentTab > 1) {
					//这里距离按实际计算
					this.scrollLeft = uni.upx2px(((this.currentTab - 1) * 202));
				} else {
					this.scrollLeft = 0
				}
			},
			detail(e) {
				uni.navigateTo({
					url: '../extend-view/newsDetail/newsDetail'
				})
			},
			navClick(index) {
				this.currentTab = index //设置导航点击了哪一个
			},
			getimgSlideDataFlash() {
				this.$api.getimgSlideDataFlash(res => {
					if (res.code) {
						this.imgSlideData.listImg = res.data;
					}
				})
			},
			initTabbar(tabbarData) {
				let data = that.$common.tabbarTime(tabbarData);
				that.tabbar = data.list;
				that.endTime = data.endTime;
				that.tabbarDataList = data.tabbarDataList;
				that.tabbarDataList.forEach((item,index)=>{
					if(item.state=='进行中'){
						that.currentTab=index;
					}
				})
			},
			getFlashList() {
				this.$api.getFlashList(res => {
					if (res.code) {
						that.initTabbar(res.data)
						that.checkCor()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.shortTab {
		display: flex;
		width: 100%;
		height: 90upx;
		position: relative;

		.navTabItem {
			flex: 1;
		}
	}

	.flashshop {
		position: relative;
		width: 100%;

		.header {
			width: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.van-tab {
		border-left: 1px solid #e3b06e;
	}

	.van-ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.van-tab {
		position: relative;
		flex: 1;
		box-sizing: border-box;
		min-width: 0;
		color: #7d7e80;
		font-size: 14px;
		line-height: 44px;
		text-align: center;
		cursor: pointer;
	}

	/*tabbar start*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.timeItem {
		font-size: 22upx;
		color: #282828;
		width: 100%;
		text-align: center;
		padding: 11upx 0;
		height: 96upx;
		background-color: #efc58f;

		.time {
			font-size: 32upx;
			font-weight: 700;
			height: 37upx;
			line-height: 37upx;
		}

		.state {
			height: 37upx;
			line-height: 37upx;
		}
	}

	.tab-view::before {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tab-view {
		width: 100%;
		height: 108upx;
		// overflow: hidden;
		box-sizing: border-box;
		z-index: 99;
		// background: saddlebrown;
		white-space: nowrap;
		border-bottom: transparent;
	}

	.tab-bar-item {
		width: 27vw;
		padding: 0;
		min-width: 80upx;
		line-height: 100upx;
		display: inline-block;
		text-align: center;
		box-sizing: border-box;
	}

	.tab-bar-title {
		height: 100upx;
		line-height: 100upx;
		font-size: 32upx;
		color: #999;
		font-weight: 400;
	}

	.active {

		.van-tab {
			color: #323233;
			font-weight: 500;

			.timeItem {
				background-color: #e93323;
				color: #fff;

				&::before {
					content: "";
					width: 0;
					height: 0;
					border-left: 8upx solid transparent;
					border-right: 8upx solid transparent;
					border-top: 10upx solid #e93323;
					position: absolute;
					bottom: -9upx;
					z-index: 99;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}

	}

	.active .tab-bar-title {
		color: #5677fc !important;
		font-size: 36upx;
		font-weight: bold;
	}

	/*tabbar end*/
	.scoll-y {
		max-height: 90vh;
	}

	.tab-content {
		margin-top: 10upx;
	}
</style>
