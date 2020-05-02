<template>
	<view class="container">
		
	</view>
</template>

<script>
	import {  
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.lang.myFavorite
			})
		},
		computed: {
			...mapState([
				'lang',
				'userInfo',
			])
		},
		methods:{
			
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	
</style>
