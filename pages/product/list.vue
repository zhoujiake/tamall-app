<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				{{lang.complexSort}}
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				{{lang.newGoodsSort}}
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>{{lang.priceSort}}</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
		</view>
		<view class="goods-list">
			<view 
				v-for="(item, index) in goodsList" :key="index"
				class="goods-item"
				@click="navToDetailPage(item)"
			>
				<view class="image-wrapper">
					<image :src="item.goodsCoverImg" mode="aspectFill"></image>
				</view>
				
				<text v-if="userLang === 'tb'" class="title clamp">
					{{switchLanguageForString(item.goodsName, 0)}}
				</text>
				<text v-else class="title clamp">
					{{switchLanguageForString(item.goodsName, 1)}}
				</text>
				
				<view class="price-box">
					<text class="price">{{lang.moneyFlag + item.sellingPrice}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<!-- 分类显示 -->
		<view v-show="false" class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.name}}</view>
						<view 
							v-for="tItem in item.child" :key="tItem.id" 
							class="cate-item b-b" 
							:class="{active: tItem.id==cateId}"
							@click="changeCate(tItem)">
							{{tItem.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {mapState} from 'vuex';  
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				orderBy: '',
				pageNum: 1,
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				cateId: '', //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				keyWord: '',
				isForCategoryGoods : "0" // 0代表否，1代表是
			};
		},
		computed:{
			...mapState([
				'lang',
				'userLang'
			])
		},
		onLoad(options) {
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			if (options.tid) {
				this.cateId = options.tid;
			}
			if(options.keyWord) {
				this.keyWord = options.keyWord
			}
			if(options.isForCategoryGoods) {
				this.isForCategoryGoods = options.isForCategoryGoods
			}
			// this.loadCateList(options.fid, options.sid);
			this.loadData();
			uni.setNavigationBarTitle({
				title: this.lang.goodsList
			})
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.pageNum = 1
			this.goodsList = []
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		methods: {
			//加载分类
			async loadCateList(fid, sid){
				let list = await this.$api.json('cateList');
				let cateList = list.filter(item=>item.pid == fid);
				
				cateList.forEach(item=> {
					let tempList = list.filter(val=>val.pid == item.id);
					item.child = tempList;
				})
				this.cateList = cateList;
			},
			//加载商品，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				let url = "";
				if (this.isForCategoryGoods === "1") { // 根据获取三级分类直接关联的商品 
					url = this.$baseUrl + 'goodsCategoryByFirstLevelId?&goodsCategoryId='
						+ this.cateId + '&orderBy=' + this.orderBy + '&page=' + this.pageNum
				} else { // 根据获取三级分类直接关联的商品
					url = this.$baseUrl + 'searchForApp?keyword=' + this.keyWord + '&goodsCategoryId='
							+ this.cateId + '&orderBy=' + this.orderBy + '&page=' + this.pageNum
				}
				// 获取分类商品列表
				uni.request({
					url: url,
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200 && res.data.data.list.length > 0) {
							let list = res.data.data.list
							list.forEach(item => {
								this.goodsList.push(item)
							})
							this.pageNum += 1
							//判断是否还有下一页，有是more  没有是nomore
							this.loadingType = res.data.data.list === 0 ? 'nomore' : 'more';
						} else {
							//没有是nomore
							this.loadingType = 'nomore';
						}
					}
				});
				if(type === 'refresh') {
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index) {
				// 选中当前的筛选条件，并且非价格筛选时执行！
				if(this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				// 选中当前的筛选条件，并且是价格筛选时执行！
				if(index === 0) {
					this.orderBy = ''
					this.priceOrder = 0;
				} else if(index === 1) {
					this.orderBy = 'new'
					this.priceOrder = 0;
				} else if(index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2: 1;
					this.orderBy = this.priceOrder === 1 ? 'price': 'price-1'; 
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.pageNum = 1
				this.goodsList = []
				this.loadData('refresh', 1);
			},
			//显示分类面板
			toggleCateMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(()=>{
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item){
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToDetailPage(item){
				//测试数据没有写id，用title代替
				let id = item.goodsId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){},
			// 分类名称语言切换
			switchLanguageForString(str, index){
				if(str.indexOf("|") == -1) {
					return str
				} else {
					var arr = str.split('|');
					return arr[index];
				}
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.content{
		padding-top: 96upx;
	}

	.navbar{
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.goods-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			&:before{
				font-size: 26upx;
			}
		}
	}
	

</style>
