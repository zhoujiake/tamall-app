<template>
	<view>
		<zy-search :is-focus="true" :is-block="false" :show-want="true" 
		:searchPlaceholder="searchPlaceholder" :searchAlertTitle="searchAlertTitle"
		@onConfirm="onConfirm"></zy-search>
	</view>
</template>

<script>
	import {mapState} from 'vuex';  
	import zySearch from '../../components/zy-search/zy-search.vue'
	export default {
		components: {
			zySearch
		},
		data() {
			return {
				searchPlaceholder : '',
				searchAlertTitle : '',
			}
		},
		computed: {
			...mapState([
				'lang'
			])
		},
		onLoad() {
			this.searchPlaceholder = this.lang.searchGoods;
			this.searchAlertTitle = this.lang.searchAlertTitle;
			uni.setNavigationBarTitle({
				title: this.lang.searchGoods
			})
		},
		methods: {
			onConfirm(value) {
				uni.navigateTo({
					url: `/pages/product/list?keyWord=${value}`
				})
			}
		},
	}
</script>

<style>
	
</style>
