<template>
	<view class="content" style="padding-top: 0upx;">
		<search :searchData="searchData" ref="search"></search>
		<img-slide :imgSlideData="imgSlideData"></img-slide>
		<nav-bar :navBarData="navBarData"></nav-bar>
		<notice :noticeData="noticeData"></notice>
		<coupon :couponData="couponData"></coupon>
		<imgWrapper :imgWrapperData="imgWrapperData"></imgWrapper>
		<goods v-if="goodsData.goodsList.length" :goodsData="goodsData"></goods>
		<copyright></copyright>
	</view>
</template>
<script>
	import search from '../../components/search/search';
	import copyright from '@/components/copyright/copyright'
	import imgSlide from '@/components/imgSlide/imgSlide';
	import notice from '@/components/notice/notice';
	import navBar from '@/components/navBar/navBar';
	import coupon from '@/components/coupon/coupon';
	import imgWrapper from '@/components/imgWrapper/imgWrapper';
	import goods from '@/components/goods/goods';
	export default {
		components: {
			search,
			copyright,
			imgSlide,
			notice,
			navBar,
			coupon,
			imgWrapper,
			goods
		},
		data() {
			return {
				searchData: {
					keywords: "请输入关键字搜索",
					style: "round"
				},
				imgSlideData: {
					duration: 2500,
					listImg: []
				},
				noticeData: {
					noticeList: []
				},
				navBarData: {
					navBarList: [{
							image: '/static/image/classifyIco.png',
							text: "商品分类",
							url: "/pages/classify/classify"
						},
						{
							image: '/static/image/couponIco.png',
							text: "领优惠卷",
							url: "/pages/CouponList/CouponList"
						},
						{
							image: '/static/image/flashIco.png',
							text: "秒杀活动",
							url: "/pages/flashshop/flashshop"
						}, {
							image: '/static/image/memberIco.png',
							text: "全部商品",
							url: "/pages/productList/productList"
						}
					]
				},
				couponData: {
					couponList: [{
							title: "秒杀专区",
							content: "今日爆款火热销售",
							imgUrl: "http://datong.crmeb.net/public/uploads/attach/2019/03/28/5c9ccf7e97660.jpg",
							url: "/pages/flashshop/flashshop"
						},
						{
							title: "今日热销",
							content: "买到就是赚到~~~",
							imgUrl: "http://datong.crmeb.net/public/uploads/attach/2019/03/28/5c9ccf7e97660.jpg",
							url: "/pages/hotSale/hotSale"
						}
					]
				},
				imgWrapperData: {
					imgWrapperList: []
				},
				goodsData: {
					column: 3,
					display: "list",
					goodsList: [],
					lookMore: "true",
					title: "热门商品"
				}
			}
		},
		onPageScroll() {
			this.$refs.search.pageScrollp();
		},
		onLoad() {
			//获取首页轮播图
			this.$api.GetimgSlideIndex((res) => {
				if (res.code) {
					this.imgSlideData.listImg = res.data;
				}
			})
			//获取首页通知信息
			this.$api.getNoticeListIndex((res) => {
				if (res.code) {
					this.noticeData.noticeList = res.data;
				}
			})
			//获取首页商品分类
			this.$api.getCategoryinfoIndex((res) => {
				if (res.code) {
					this.imgWrapperData.imgWrapperList = res.data;
				}
			})
			//获取热门商品
			this.$api.getGoodsDataIndex((res) => {
				if (res.code) {
					this.goodsData.goodsList = res.data;
				}
			})
		}
	}
</script>

<style>
	.cell-item {
		border: none;
	}

	.cell-ft-text {
		font-size: 22upx;
		color: #999;
	}
</style>
