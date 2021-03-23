<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="addr"></view>
			<view class="input-box">

			</view>
			<!-- <view class="icon-btn">
				<view class="icon tongzhi" @tap="toMsg"></view>
				<view class="icon setting" @tap="toSetting"></view>
			</view> -->
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 用户信息 -->
		<view class="user" v-if="isLoginShow">
			<!-- 头像 -->
			<view class="left">
				<image :src="userinfo.userUrl" @tap="toSetting" class="userImage"></image>
			</view>
			<!-- 昵称 -->
			<view class="right">
				<view class="username" @tap="toLogin">{{userinfo.userName}}</view>
			</view>
		</view>
		<view class="user" v-else>
			<view class="left">
				<view class="userImage" style="overflow: hidden;">
					<open-data type="userAvatarUrl"></open-data>
				</view>
			</view>
			<view class="right">
				<view>
					<button class="login-btn" open-type="getUserInfo" @getuserinfo="getUserInfo">授权登录</button>
				</view>
			</view>
		</view>
		<!-- 订单-余额 -->
		<view class="order">
			<!-- 订单类型 -->
			<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="tomyOrder()">
				<view class="tui-cell-header">
					<view class="tui-cell-title">我的订单</view>
					<view class="tui-cell-sub">查看全部订单</view>
				</view>
			</tui-list-cell>
			<view class="list">
				<view class="box" v-for="(row,index) in orderList" :key="index" @tap="toOrderList(index)">
					<view class="img">
						<view class="icon" :class="row.icon"></view>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="title">我的工具栏</view>
			<view class="list">
				<view class="box" v-for="(row,index) in mytoolbarList" :key="index" @tap="toPage(row.url)">
					<view class="img">
						<image :src="row.img"></image>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place-bottom"></view>
		<fab :right="30" :bottom="100" bgColor="#fff" :width="80" :height="80">
			<button open-type="contact" session-from="weapp" class="kfBtn">
				<image src="../../static/img/kf.png" mode="widthFix"></image>
			</button>
		</fab>
	</view>
</template>
<script>
	import fab from '../../components/fab/fab.vue';
	let that = null;
	export default {
		components:{
			fab
		},
		data() {
			return {
				isfirst: true,
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				isLoginShow: false,
				Token: "",
				//个人信息,
				userinfo: {},
				// 订单类型
				orderList: [
					{
						text: '待发货',
						icon: "fahuo"
					},
					{
						text: '待收货',
						icon: "shouhuo"
					},
					{
						text: '待评价',
						icon: "pingjia"
					}
				],
				// 工具栏列表
				mytoolbarList: [{
						url: '../coupon/coupon',
						text: '优惠券',
						img: '/static/img/user/quan.png'
					}, 
					{
						url: '../address/address',
						text: '收货地址',
						img: '/static/img/user/addr.png'
					},
					{
						url: '../deposit/deposit',
						text: '账户数额',
						img: '/static/img/user/bank.png'
					}
				]
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onPageScroll(e) {
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		onLoad() {
			that = this;
			this.statusHeight = 0;
			console.log(that.isLoginShow)
			if (that.isLoginShow) {
				that.initUserInfo()
			} else {
				uni.login({
					success(res) {
						if (res.code) {
							that.wxLoginStep(res.code)
						} else {
							that.$common.errorToShow('未取得code')
						}
					},
					fail() {
						that.$common.errorToShow('获取code失败')
					}
				})
			}
		},
		onShow() {

		},
		methods: {
			wxLoginStep(code) {
				this.$api.login({
					code
				}, (res) => {
					if (res.code) {
						that.Token = res.data.Token;
					} else {
						this.$common.errorToShow("获取openID异常", function() {
							uni.navigateBack({
								delta: 1
							})
						})
					}
				})
			},
			getUserInfo(res) {
				if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
					that.$common.errorToShow('授权失败')
				} else {
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							infoRes.userInfo.Token = that.Token;
							that.toWxLogin(infoRes.userInfo)
						},
						fail(res) {

						}
					});
				}
			},
			toWxLogin(data) {
				let _this = this
				_this.$api.upinfoLogin(data, function(res) {
					if (res.code) {
						_this.isLoginShow = true;
						_this.userinfo = res.data[0];
						_this.$common.successToShow("登录成功")
						_this.$store.dispatch('setUserInfoAction', res.data[0])
						_this.$store.dispatch('saveUserTokenAction', _this.Token)
					} else {
						_this.$common.errorToShow('登录失败，请重试')
					}
				})
			},
			initUserInfo() {
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						that.$api.userInfoInit(infoRes.userInfo, res => {
							if (res.code) {
								that.userinfo = res.data[0];
								that.isLoginShow = true;
								that.$common.successToShow("更新信息成功")
								that.$store.dispatch('setUserInfoAction', that.userInfo)
							} else {
								that.$common.errorToShow('更新信息失败，请重试')
							}
						})
					},
					fail(res) {

					}
				});
			},
			//-----------------------
			toMsg() {
				uni.navigateTo({
					url: '../../msg/msg'
				})
			},
			toOrderList(index) {
				uni.setStorageSync('tbIndex', index);
				uni.navigateTo({
					url: '../order/order?tbIndex=' + index
				})
			},
			toLogin() {
				uni.showToast({
					title: '请登录',
					icon: "none"
				});
				uni.navigateTo({
					url: '../../login/login'
				})
				this.isfirst = false;
			},
			isLogin() {
				const value = uni.getStorageSync('UserInfo');
				if (value) {
					return true;
				}
				return false
			},
			toDeposit() {
				uni.navigateTo({
					url: '../../user/deposit/deposit'
				})
			},
			toPage(url) {
				if (!url) {
					uni.showToast({
						title: '模板未包含此页面',
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: url
				})
			},
			tomyOrder() {
				this.$common.navigateTo('/pages/order/order');
			}
		}
	}
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #f06c7a;
		top: 0;

	}

	.header {
		width: 100%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #f06c7a;

		.icon-btn {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				color: #fff;
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {
		background-color: #f06c7a;
		height: 100upx;
	}

	.place-bottom {
		height: 300upx;
	}

	.user {
		box-sizing: content-box;
		padding: 0 4%;
		display: flex;
		flex-flow: column;
		align-items: center;
		// position: relative;
		background-color: #f06c7a;
		padding-bottom: 120upx;

		.left {
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			// border: solid 1upx #fff;
			border-radius: 100%;


		}

		.userImage {
			width: 20vw;
			height: 20vw;
			border-radius: 100%;
		}

		.right {
			padding-top: 20upx;

			.username {
				font-size: 36upx;
				color: #fff;
			}

		}

		.erweima {
			flex-shrink: 0;
			width: 10vw;
			height: 10vw;
			margin-left: 5vw;
			border-radius: 100%;

			display: flex;
			justify-content: center;
			align-items: center;
			background: linear-gradient(to left, #fbbb37 0%, #fcf0d0 105%);

			.icon {
				color: #7b6335;
				font-size: 42upx;
			}
		}
	}

	.order {
		width: 92%;
		margin: 30upx auto;
		padding: 30upx 4% 20upx 4%;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;

		.list {
			display: flex;
			padding-bottom: 10upx;

			.box {
				width: 20%;

				.img {
					width: 100%;
					display: flex;
					justify-content: center;

					.icon {
						font-size: 50upx;
						color: #464646;
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #3d3d3d;
				}
			}
		}

		.balance-info {
			display: flex;
			padding: 10upx 0;

			.left {
				width: 75%;
				display: flex;

				.box {
					width: 50%;
					font-size: 28upx;

					.num {
						width: 100%;
						height: 50upx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						color: #f9a453;
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						color: #3d3d3d;
						font-size: 28upx;
					}
				}
			}

			.right {
				border-left: solid 1upx #17e6a1;
				width: 25%;

				.box {

					.img {
						width: 100%;
						height: 50upx;
						display: flex;
						justify-content: center;
						align-items: flex-end;

						.icon {
							font-size: 45upx;
							color: #e78901;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 28upx;
						color: #3d3d3d;
					}
				}
			}
		}
	}

	.VIP {
		width: 84%;
		margin: -65upx auto 20upx auto;
		padding: 30upx 4%;
		background: linear-gradient(to left, #dea96d 0%, #f6d59b 100%);
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.2);
		border-radius: 15upx;
		display: flex;
		align-items: center;

		.img {
			flex-shrink: 0;
			width: 60upx;
			height: 60upx;

			image {
				width: 60upx;
				height: 60upx;
			}
		}

		.title {
			width: 100%;
			color: #796335;
			font-size: 30upx;
		}

		.tis {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			color: #fcf0d0;
			font-size: 26upx;
		}
	}

	.toolbar {
		width: 92%;
		margin: 0 4% 0 4%;
		padding: 0 0 20upx 0;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;

		.title {
			padding-top: 10upx;
			margin: 0 0 10upx 3%;
			font-size: 30upx;
			height: 80upx;
			display: flex;
			align-items: center;
		}

		.list {
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 25%;
				margin-bottom: 30upx;

				.img {
					width: 23vw;
					height: 10.5vw;
					display: flex;
					justify-content: center;

					image {
						width: 9vw;
						height: 9vw;
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
					color: #3d3d3d;
				}
			}
		}
	}

	.tui-cell-header {
		width: 100%;
		height: 74rpx;
		padding: 20upx 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-cell-sub {
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}

	.login-btn {
		color: #fff;
		width: 180upx;
		height: 50upx;
		line-height: 50upx;
		border-radius: 25upx;
		background: #ff7159;
		font-size: 12px;
	}
	.kfBtn {
		background-color: transparent;
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 0px;
		margin: 0px;
	
		image {
			width: 100%;
			height: 100%;
		}
	
		&::after {
			width: 0upx;
			height: 0upx;
		}
	}
</style>
