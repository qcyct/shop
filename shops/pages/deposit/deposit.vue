<template>
	<view>
		<view class="block">
			<view class="title">
				我的账户
			</view>
			<view class="content">
				<view class="my">
					我的账户余额：{{beginMoney}} 元
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				充值金额
			</view>
			<view class="content">
				<view class="amount">
					<view class="list">
						<view class="box" v-for="(amount,index) in amountList" :key="index" @tap="select(amount)" :class="{'on':amount == inputAmount}">
							{{amount}}元
						</view>
					</view>
					<view class="num">
						<view class="text">
							自定义充值金额
						</view>
						<view class="input">
							<input type="number" v-model="inputAmount" @input="onKeyInput" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="paytype='wxpay'">
						<view class="left">
							<image src="/static/image/wxpay.png"></image>
						</view>
						<view class="center">
							微信支付
						</view>
						<view class="right">
							<radio :checked="paytype=='wxpay'" color="#f06c7a" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即充值</view>
			<view class="tis">
				点击立即充值，即代表您同意<view class="terms">
					《条款协议》
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputAmount: '', //金额
				amountList: [10, 50, 100], //预设3个可选快捷金额
				paytype: 'wxpay', //支付类型,
				beginMoney: 0
			};
		},
		methods: {
			onKeyInput(event) {
				this.$nextTick(() => {
					this.inputAmount = this.$common.filterNum(event.target.value)
				})
			},
			select(amount) {
				this.inputAmount = amount;
			},
			doDeposit() {
				if (parseFloat(this.inputAmount).toString() == "NaN") {
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					});
					return;
				}
				if (this.inputAmount <= 0) {
					uni.showToast({
						title: '请输入大于0的金额',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '支付中...'
				});
				this.$api.userRecharge({
					Money: this.inputAmount
				}, (res) => {
					if (res.code) {
						uni.hideLoading();
						this.$common.successToShow("充值成功");
						uni.redirectTo({
							url: '../success/success?amount=' + this.inputAmount
						});
					}
				})
			},
			getbeginMoneyUser() {
				this.$api.getbeginMoneyUser({}, res => {
					if (res.code) {
						this.beginMoney = res.data.beginMoney
					}
				})
			}
		},
		onLoad() {
			//获取账户余额
			this.getbeginMoneyUser();
		},
	}
</script>

<style lang="scss">
	.block {
		width: 94%;
		padding: 20upx 3%;

		.title {
			width: 100%;
			font-size: 34upx;
		}

		.content {
			.my {
				width: 100%;
				height: 120upx;
				display: flex;
				align-items: center;
				font-size: 30upx;
				border-bottom: solid 1upx #eee;
			}

			.amount {
				width: 100%;

				.list {
					display: flex;
					justify-content: space-between;
					padding: 20upx 0;

					.box {
						width: 30%;
						height: 120upx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 10upx;
						box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.05);
						font-size: 36upx;
						background-color: #f1f1f1;
						color: 333;

						&.on {
							background-color: #f06c7a;
							color: #fff;
						}
					}
				}

				.num {
					margin: 20upx auto;
					display: flex;
					justify-content: center;
					align-items: center;

					.text {
						padding-right: 10upx;
						font-size: 30upx;
					}

					.input {
						width: 28.2vw;
						border-bottom: solid 2upx #999;

						justify-content: flex-end;
						align-items: center;

						input {
							margin: 0 20upx;
							height: 60upx;
							font-size: 40upx;
							color: red;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}

			.pay-list {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;

					.left {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;

						image {
							width: 80upx;
							height: 80upx;
						}
					}

					.center {
						width: 100%;
						font-size: 30upx;
					}

					.right {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.pay {
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.btn {
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #f06c7a;
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
		}

		.tis {
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;

			.terms {
				color: #5a9ef7;
			}
		}
	}
</style>
