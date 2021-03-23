<template>
	<view class="CouponList">
		<block v-for="(CouponListItem,index) in CouponList" :key="index">
			<CouponItme :CouponListItem="CouponListItem"></CouponItme>
		</block>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore :visible="!pullUpOn" bgcolor="#f7f7f7"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
	import CouponItme from '../../components/CouponItme/CouponItme.vue';
	export default {
		components: {
			CouponItme
		},
		data() {
			return {
				CouponList: [],
				pageIndex: 1,
				limitIndex: 8,
				loadding: false,
				pullUpOn: true
			};
		},
		methods: {
			getCouponList() {
				this.$api.getCouponList({
					page: this.pageIndex,
					limit: this.limitIndex
				}, (res) => {
					if (res.code) {
						this.pageIndex = this.pageIndex + 1;
						this.CouponList = res.data
					}
				})
			}
		},
		onLoad() {
			this.getCouponList()
		},
		onReachBottom() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			this.$api.getCouponList({
				page: this.pageIndex,
				limit: this.limitIndex
			}, (res) => {
				if (res.code) {
					this.CouponList = this.CouponList.concat(res.data);
					this.pageIndex = this.pageIndex + 1;
					this.loadding = false
				} else {
					this.loadding = false;
					this.pullUpOn = false
				}
			})
		}
	}
</script>

<style lang="scss">
	.CouponList {
		padding-top: 20upx;
	}
</style>
