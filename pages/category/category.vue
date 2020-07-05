<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view  v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				<template v-if="userLang === 'tb'">
					{{switchLanguageForString(item.name, 0)}}
				</template>
				<template v-else>
					{{switchLanguageForString(item.name, 1)}}
				</template>
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text v-if="userLang === 'tb'" class="s-item">
					{{switchLanguageForString(item.name, 0)}}
				</text>
				<text v-else class="s-item">
					{{switchLanguageForString(item.name, 1)}}
				</text>
				<view class="t-list">
					<view @click="navToList(item.id, titem.id)" v-if="titem.pid === item.id" class="t-item" v-for="titem in tlist" :key="titem.id">
						<image :src="titem.picture"></image>
						<text v-if="userLang === 'tb'">
							{{switchLanguageForString(titem.name, 0)}}
						</text>
						<text v-else>
							{{switchLanguageForString(titem.name, 1)}}
						</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';  
	export default {
		data() {
			return {
				pageNum: 1,
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				tlist: [],
				categoryItemObject: {
					id: 0,
					pid: null,
					name: '',
					picture: ''
				},
			}
		},
		onLoad(){
			this.loadData();
			var title = this.lang.goodsType;
			setTimeout(function() {
				uni.setNavigationBarTitle({
					title: title
				});
			},300)
		},
		computed:{
			...mapState([
				'lang',
				'userLang'
			])
		},
		methods: {
			async loadData() {
				// 获取分类数据
				uni.request({
					url: this.$baseUrl + 'categories', 
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200) {
							// 处理后台返回的数据
							let list = res.data.data;
							list.forEach(item => {
								let first = {id: item.categoryId,
										     name: item.categoryName
										    };
								this.flist.push(first);
									item.secondLevelCategoryVOS.forEach(sec => {
										let second = {id: sec.categoryId,
										             pid: item.categoryId,
												     name: sec.categoryName
												    };
										this.slist.push(second);
											sec.thirdLevelCategoryVOS.forEach(thir => {
												let third = {
												 	id: thir.categoryId,
												 	pid: sec.categoryId,
												 	name: thir.categoryName,
												 	picture: thir.typeImage
												 }
											     this.tlist.push(third);
											})
									})
							})
							this.currentId = list[0].categoryId;
						} else {
						}
					}
				});
			},
			//一级分类点击
			tabtap(item) {	
				if(!this.sizeCalcState) {
					this.calcSize();
				}
				this.currentId = item.id;
				let index = this.slist.findIndex(sitem => sitem.pid === item.id);
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			},
			// 分类名称语言切换
			switchLanguageForString(str, index){
				if(str.indexOf("|") == -1) {
					return str
				} else {
					var arr = str.split('|');
					return arr[index];
				}
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}
	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;  
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
</style>
