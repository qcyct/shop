<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import './static/css/style.css';
	@import './static/iconfont/font.scss';

	/*每个页面公共css */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: red;
	}
</style>
