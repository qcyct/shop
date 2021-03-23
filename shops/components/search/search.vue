<template>
	<view class="">
		<!-- 搜索框 -->
		<view class="search" ref="searchBar" id="search">
			<view class='search-c'>
				<view class='search-input search-input-p' v-bind:class="searchData.style">
					<input class="search-input-p-c" @confirm="goSearch" v-model="keyword"></input>
				</view>
				<image class='icon search-icon' src='../../static/image/zoom.png'></image>
			</view>
		</view>
		<!-- 搜索框 -->
		<view class="search search-fixed" v-show="searchFixed">
			<view class='search-c'>
				<view class='search-input search-input-p' v-bind:class="searchData.style">
					<input class="search-input-p-c" @confirm="goSearch" v-model="keyword"></input>
				</view>
				<image class='icon search-icon' src='../../static/image/zoom.png'></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "search",
		props: {

		},
		data() {
			return {
				keyword: '',
				searchTop: 0,
				scrollTop: 0,
				searchFixed: false
			};
		},
		methods: {
			goSearch() {
				uni.navigateTo({
					url: '../productList/productList?searchKey=' + this.keyword + '&type=bygoodsName'
				})
				this.keyword = ''
			},
			pageScrollp() {
				var _this = this;
				const query = uni.createSelectorQuery().in(this)
				query.select('.search').boundingClientRect(function(res) {
					if (res.top < 0) {
						_this.searchFixed = true;
					} else {
						_this.searchFixed = false;
					}
				}).exec()
			}
		}
	}
</script>

<style>
	.search-input-p {
		color: #888;
	}

	.square {
		border-radius: 0;
	}

	.radius {
		border-radius: 12upx;
	}

	.search-fixed {
		position: fixed;
		top: 0;
		transition: all .5s;
	}
</style>
