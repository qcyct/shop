<template>
	<view>
		<!-- 收货地址 -->
		<view class="addr" @tap="selectAddress">
			<template v-if="recinfo.addressName">
				<view class="icon">
					<image src="../../static/image/addricon.png" mode=""></image>
				</view>
				<view class="right">
					<view class="tel-name">
						<view class="name">
							{{recinfo.addressName}}
						</view>
						<view class="tel">
							{{recinfo.addresstel}}
						</view>
					</view>
					<view class="addres">
						{{recinfo.region.label}}
						{{recinfo.detailed}}
					</view>
				</view>
			</template>
			<template>
				<view>
					请选择地址
				</view>
			</template>
		</view>
		<!-- 购买商品列表 -->
		<view class="buy-list">
			<view class="row" v-for="(row,index) in buylist" :key="index">
				<view class="goods-info">
					<view class="img">
						<image :src="row.goodsInfo.goodsImg"></image>
					</view>
					<view class="info">
						<view class="title">{{row.goodsInfo.goodsName}}</view>
						<view class="spec">数量:{{row.count}}</view>
						<view class="spec">码数:{{row.goodsNumber}}</view>
						<view class="price-number">
							<view class="price">￥{{Number(row.goodsInfo.goodsSale)*row.count}}</view>
							<view class="number">

							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提示-备注 -->
		<view class="order">
			<view class="row" @click="showCoupon">
				<view class="left">
					优惠卷 :
				</view>
				<view class="right">
					已扣除用户卷抵扣{{deduction|toFixed}}元
				</view>
			</view>
		</view>
		<!-- 明细 -->
		<view class="detail">
			<view class="row">
				<view class="nominal">
					商品金额
				</view>
				<view class="content">
					￥{{goodsPrice|toFixed}}
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					优惠卷抵扣
				</view>
				<view class="content">
					￥-{{deduction|toFixed}}
				</view>
			</view>
		</view>
		<view class="blck">

		</view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice|toFixed}}</view>
				</view>
				<view class="btn" @tap="toPay">提交订单</view>
			</view>
		</view>
		<!-- 优惠劵 -->
		<tui-bottom-popup tui-top-dropdown="tui-top-dropdown" bgcolor="rgba(76, 76, 76, 0.95)" :show="couponShow" :height="0"
		 @close="closeCoupon">
			<view class="coupon-list-window">
				<view class="title">
					优惠券<text class="iconfont icon-guanbi"></text>
				</view>
				<view>
					<block v-for="(GoodsCoupon,index) in buylist" :key="index">
						<block v-for="(CouponItem) in GoodsCoupon.goodsInfo.coupon" :key="CouponItem.couponId">
							<CouponItme :CouponListItem="CouponItem" :stateType="3"></CouponItme>
						</block>
					</block>
				</view>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	import CouponItme from '../../components/CouponItme/CouponItme.vue';
	import {
		mapActions,
		mapGetters
	} from "vuex";
	export default {
		components: {
			CouponItme
		},
		data() {
			return {
				buylist: [], //订单列表
				userinfo: {},
				recinfo: {},
				couponShow: false,
				content: '',
				couponListInfo: []
			};
		},
		async onLoad(option) {
			this.getAddressBydefault()
			this.userinfo = this.getUserInfos;
			if(option.isOne){
				this.buylist=this.$db.get('buylist')
			}else{
				this.buylist = this.$store.getters.getGoodsList.filter(item => item.selected);
			}
			// console.log(this.$store.getters.getGoodsList)
			this.content = this.buylist
			await Promise.all((this.buylist.map((item, index) => {
				return new Promise(async (resolve, reject) => {
					this.$api.getGoodsInfoCardById({
						goodsId: item.goodsId,
						isflash: item.isflash
					}, (res) => {
						if (res.code) {
							this.$set(this.buylist[index], 'goodsInfo', res.data)
							resolve()
						}
					})
				})
			})))
			this.buylist.forEach(goodsItem => {
				let couponList = goodsItem.goodsInfo.coupon
				for (let i = 0; i < couponList.length; i++) {
					if (couponList[i].couponMin > this.goodsPrice) {
						couponList.splice(i, 1)
							--i;
					} else {
						this.couponListInfo.push(couponList[i].couponId)
					}
				}
			})
		},
		onShow() {
			uni.getStorage({
				key: 'selectAddress',
				success: (e) => {
					this.recinfo = e.data;
					uni.removeStorage({
						key: 'selectAddress'
					})
				}
			})
		},
		onHide() {

		},
		filters: {
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		computed: {
			...mapGetters({
				getGoodsList: "getGoodsList",
				getNameGoodListNum: 'getNameGoodListNum',
				getUserInfos: 'getUserInfos',
				getisLogin: 'getisLogin'
			})
		},
		methods: {
			closeCoupon: function() {
				this.couponShow = false;
			},
			showCoupon() {
				this.couponShow = true;
			},
			toPay() {
				if(!this.recinfo.region){
					this.$common.errorToShow('请先完善收货地址')
					return;
				}
				//商品列表
				let paymentOrder = [];
				let goodsIdList = [];
				let len = this.buylist.length;
				for (let i = 0; i < len; i++) {
					paymentOrder.push(this.buylist[i]);
					goodsIdList.push(this.buylist[i].goodsId);
				}
				if (paymentOrder.length == 0) {
					uni.showToast({
						title: '订单信息有误，请重新购买',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '正在提交订单...'
				})

				this.$api.shopping({
					goodsMoney: this.sumPrice,
					address: this.recinfo.region.label + "" + this.recinfo.detailed,
					content: this.content,
					couponListInfo: this.couponListInfo
				}, (res) => {
					if (res.code) {
						this.$common.successToShow("购买成功", () => {
							this.$store.dispatch('emptyAllCardAction');
							uni.switchTab({
								url: '../../pages/index/index'
							})
						})
					} else {
						this.$common.errorToShow("你的余额不足")
					}
				})

				// uni.hideLoading();
				// uni.redirectTo({
				// 	url: "../pay/payment/payment?amount=" + this.sumPrice
				// })

			},
			//选择收货地址
			selectAddress() {
				uni.navigateTo({
					url: '../address/address?type=select'
				})
			},
			getAddressBydefault() {
				this.$api.getAddressBydefault({}, res => {
					if (res.code) {
						this.recinfo = res.data
					}
				})
			},
			...mapActions({
				addCardAction: 'addCardAction',
				setUserInfoAction: 'setUserInfoAction'
			})
		},
		computed: {
			deduction() {
				let sum = 0;
				try {
					this.buylist.forEach(goodsItem => {
						if (goodsItem.goodsInfo.coupon) {
							sum += goodsItem.goodsInfo.coupon.reduce((a, b) => {
								return a + b.couponMon
							}, 0)
						} else {

						}
					})
				} catch (e) {

				}
				return sum;
			},
			goodsPrice() {
				let sum = 0;
				try {
					this.buylist.forEach(goodsItem => {
						sum += Number(goodsItem.goodsInfo.goodsSale) * goodsItem.count
					})
				} catch (e) {

				}
				return sum;
			},
			sumPrice() {
				return this.goodsPrice - this.deduction
			}
		}
	}
</script>

<style lang="scss">
	.coupon-list-window {
		background-color: #f5f5f5;
		border-radius: 16upx 16upx 0 0;
		z-index: 111;
		padding-bottom: 20upx;

		.title {
			height: 124upx;
			width: 100%;
			text-align: center;
			line-height: 124upx;
			font-size: 32upx;
			font-weight: 700;
			position: relative;
			color: #333;
		}
	}

	.addr {
		width: 86%;
		padding: 20upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;
		display: flex;

		.icon {
			width: 80upx;
			height: 80upx;
			display: flex;
			align-items: center;

			image {
				width: 60upx;
				height: 60upx;
			}
		}

		.tel-name {
			width: 100%;
			display: flex;
			font-size: 32upx;

			.tel {
				margin-left: 40upx;
			}
		}

		.addres {
			width: 100%;
			font-size: 26upx;
			color: #999;
		}
	}

	.buy-list {
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			margin: 30upx 0;

			.goods-info {
				width: 100%;
				display: flex;

				.img {
					width: 22vw;
					height: 22vw;
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 10upx;

					image {
						width: 22vw;
						height: 22vw;
					}
				}

				.info {
					width: 100%;
					height: 22vw;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;

					.title {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						overflow: hidden;
					}

					.spec {
						font-size: 22upx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						height: 40upx;
						display: flex;
						align-items: center;
						padding: 0 10upx;
						border-radius: 20upx;
						margin-bottom: 20vw;
					}

					.price-number {
						position: absolute;
						width: 100%;
						bottom: 0upx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 28upx;
						height: 40upx;

						.price {
							color: #f06c7a;
						}

						.number {
							display: flex;
							justify-content: center;
							align-items: center;

						}
					}
				}
			}
		}
	}

	.order {
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			margin: 20upx 0;
			height: 40upx;
			display: flex;

			.left {
				font-size: 28upx;
			}

			.right {
				margin-left: 40upx;
				font-size: 26upx;
				color: #999;

				input {
					font-size: 26upx;
					color: #999;
				}
			}
		}
	}

	.blck {
		width: 100%;
		height: 100upx;
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.settlement {
			width: 80%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 60upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}

	.detail {
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			height: 60upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.nominal {
				font-size: 28upx;
			}

			.content {
				font-size: 26upx;
				color: #f06c7a;
			}
		}
	}
</style>
