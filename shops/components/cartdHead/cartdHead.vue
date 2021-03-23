<template>
	<view class="cartdHead">
		<div class="labelNav">
			<div class="item">
				<tui-icon name="circle-selected" :size="25" color="#555"></tui-icon>正品保证
			</div>
			<div class="item">
				<tui-icon name="circle-selected" :size="25" color="#555"></tui-icon>所有商品精挑细选
			</div>
			<div class="item">
				<tui-icon name="circle-selected" :size="25" color="#555"></tui-icon>售后无忧
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style>
	.labelNav {
		height: 76upx;
		padding: 3upx;
		font-size: 22upx;
		color: #8c8c8c;
		position: fixed;
		left: 0;
		width: 100%;
		background-color: #f5f5f5;
		z-index: 5;
		top: 0;
	}

	.cartdHead .labelNav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content:space-around;
	}
	.cartdHead{
		background-color: #FFFFFF;
	}
</style>
