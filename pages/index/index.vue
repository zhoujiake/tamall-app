<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled />
		</view>
		<!-- #endif -->
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" :autoplay="true" :interval="3500" circular 
			    @change="swiperChange" :duration="duration">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item"
				 @click="navToList(item.redirectUrl)">
					<image :src="item.carouselUrl" />
				</swiper-item>
			</swiper>
			
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" @click="navToList(121)">
				<image src="/static/temp/c3.png"></image>
				<text>{{lang.household}}</text>
			</view>
			<view class="cate-item" @click="navToList(116)">
				<image src="/static/temp/c5.png"></image>
				<text>{{lang.monkSupplies}}</text>
			</view>
			<view class="cate-item" @click="navToList(126)">
				<image src="/static/temp/c6.png"></image>
				<text>{{lang.accessories}}</text>
			</view>
			<view class="cate-item" @click="navToList(116)">
				<image src="/static/temp/c7.png"></image>
				<text>{{lang.thangka}}</text>
			</view> 
			<view class="cate-item" @click="navToList(143)">
				<image src="/static/temp/c8.png"></image>
				<text>{{lang.buddhaSupplies}}</text>
			</view>
		</view>
		
		<view class="ad-1"><!-- 广告图 -->
			<image class="top-image" :src="topImageUrl" mode="scaleToFill"></image>
		</view>
		
		<!-- 热销商品 -->
		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">{{lang.hotGoods}}</text>
				<text class="tit2">{{lang.hotGoodsTextContent}}</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		<view class="group-section">
			<swiper class="g-swiper" :duration="500">
				<swiper-item
					class="g-swiper-item"
					v-for="(item, index) in hotGoodsList" :key="index"
					v-if="index%2 === 0"
				>
					<view class="g-item left" @click="navToHotGoodsDetailPage(index)">
						<image :src="item.goodsCoverImg" mode="aspectFill"></image>
						<view class="t-box">
							<text class="title clamp">{{item.goodsName}}</text>
							<view class="price-box">
								<text class="price">{{lang.moneyFlag + item.sellingPrice}}</text> 
								<text class="m-price">{{lang.moneyFlag + item.originalPrice}}</text> 
							</view>
					    </view>
					</view>
					
					<view class="g-item right" @click="navToHotGoodsDetailPage(index+1)">
						<image :src="hotGoodsList[index+1].goodsCoverImg" mode="aspectFill"></image>
						<view class="t-box">
							<text class="title clamp">{{hotGoodsList[index+1].goodsName}}</text>
							<view class="price-box">
								<text class="price">{{lang.moneyFlag + hotGoodsList[index+1].sellingPrice}}</text> 
								<text class="m-price">{{lang.moneyFlag + hotGoodsList[index+1].originalPrice}}</text> 
							</view>
						</view>
					</view>
					
				</swiper-item>
			</swiper>
		</view>
	
		<!-- 分类推荐楼层 -->
		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box"> <!-- 新品上线 -->
				<text class="tit">{{lang.newGoodsOnline}}</text>
				<text class="tit2">{{lang.newGoodsOnlineTextContent}}</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		<view class="hot-floor">
			<view class="floor-img-box">
				<image class="floor-img" :src="newGoodsImg1" mode="scaleToFill"></image>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						v-for="(item, index) in newGoodsList1" :key="index"
						class="floor-item"
						@click="navToDetailPage(item)"
					>
						<image :src="item.goodsCoverImg" mode="aspectFill"></image>
						<text class="title clamp">{{item.goodsName}}</text>
						<text class="price">{{lang.moneyFlag + item.sellingPrice}}</text>
					</view>
					<view class="more">
						<text>{{lang.more}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="hot-floor">
			<view class="floor-img-box">
				<image class="floor-img" :src="newGoodsImg2" mode="scaleToFill"></image>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						v-for="(item, index) in newGoodsList2" :key="index"
						class="floor-item"
						@click="navToDetailPage(item)"
						>
						<image :src="item.goodsCoverImg" mode="aspectFill"></image>
						<text class="title clamp">{{item.goodsName}}</text>
						<text class="price">{{lang.moneyFlag + item.sellingPrice}}</text>
					</view>
					<view class="more">
						<text>{{lang.more}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="hot-floor">
			<view class="floor-img-box">
				<image class="floor-img" :src="newGoodsImg3" mode="scaleToFill"></image>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view 
						v-for="(item, index) in newGoodsList3" :key="index"
						class="floor-item"
						@click="navToDetailPage(item)"
					>
						<image :src="item.goodsCoverImg" mode="aspectFill"></image>
						<text class="title clamp">{{item.goodsName}}</text>
						<text class="price">{{lang.moneyFlag + item.sellingPrice}}</text>
					</view>
					<view class="more">
						<text>{{lang.more}}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 猜你喜欢 -->
		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">{{lang.recommend}}</text>
				<text class="tit2">{{lang.recommendTextContent}}</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		
		<view class="guess-section">
			<view 
				v-for="(item, index) in recommendGoodsList" :key="index"
				class="guess-item"
				@click="navToDetailPage(item)"
			>
				<view class="image-wrapper">
					<image :src="item.goodsCoverImg" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.goodsName}}</text>
				<text class="price">{{lang.moneyFlag + item.sellingPrice}}</text>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex';  
	export default {
		data() {
			return {
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				hotGoodsList: [],
				recommendGoodsList: [],
				loadingType: 'more', //加载更多状态
				newGoodsList1: [],
				newGoodsList2: [],
				newGoodsList3: [],
				newGoodsImg1: "",
				newGoodsImg2: "",
				newGoodsImg3: "",
				duration: 1000,
				pageNum : 1,
				cids : "108",
				topImageUrl : '',
			};
		},
		onLoad() {
		  this.loadCarouselList();// 加载轮播图数据
		  this.loadHotGoodsesList(); // 加载热销商品数据
		  this.newGoodsesList(); // 加载新品数据
		  this.loadRecommendGoodsesList(); // 加载推荐商品数据
		  this.topImageUrl = 'http://39.107.231.238:8080/upload/indexImage/212221212.jpg'
		},
		onUnload() {
			console.log("JIM loginOut ----->>")
			this.JIM.loginOut()
		},
		onReady() {
			// 获取地理位置信息
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
			    }
			});
			var info = ''
			// 获取设备信息
			uni.getSystemInfo({
			    success: function (res) {
					// 手机平台类别 如Android ios
			        info = res.platform
			    }
			});
			this.setDeviceInfo(info)
			
			// 检查用户是否已经登录过
			var userinfo = uni.getStorageSync("userInfo")
			if (userinfo) { // 默认登录
				this.userLogin(userinfo)
				this.getJPushData()
			}
		},
		//加载更多
		onReachBottom(){
			this.loadRecommendGoodsesList();
		},
		computed: {
			...mapState([
				'lang',
				'deviceInfo',
				'JIM'
			])
		},
		methods: {
			...mapMutations(['login','setDeviceInfo','getJPushData']),
			// 登录
			userLogin(userInfo) {
				var httpUrl = '';
				var contentType = '';
				if (userInfo.loginType == "weixin" || userInfo.loginType == "qq") {
					httpUrl = this.$baseUrl + "loginForAppOfOtherPlatform";
					contentType = 'application/json'
				} else if (userInfo.loginType == "normal") {
					httpUrl = this.$baseUrl + "loginForApp";
					contentType = 'application/x-www-form-urlencoded'
				}
				// 第三方用户登录
				uni.request({
					url: httpUrl, //仅为示例，并非真实接口地址。
					data: userInfo,
					header: {
						  'content-type': contentType //自定义请求头信息
					},
					method: "POST",
					success: (res) => {
						if (res.data.resultCode == 200) {
							// debugger
							this.login(userInfo);
						} else {
						}
					}
				});
			},
			/**
			 * 获取轮播图信息
			 */
			async loadCarouselList() {
				uni.request({
					url: this.$baseUrl + "carousels", //仅为示例，并非真实接口地址。
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200) {
							this.titleNViewBackground = res.data.data[0].background;
							this.swiperLength = res.data.data.length;
							this.carouselList = res.data.data;
						} else {
						}
					}
				});
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			//热销详情页
			navToHotGoodsDetailPage(index) {
				//测试数据没有写id，用title代替
				let id = this.hotGoodsList[index].goodsId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			//列表详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.goodsId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			/**
			 * 热销商品
			 */
			async loadHotGoodsesList() {
				uni.request({
					url: this.$baseUrl + "hotGoodses", //仅为示例，并非真实接口地址。
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200) {
							this.hotGoodsList = res.data.data;
						} else {
						}
					}
				});
			},
			/**
			 * 新品上线
			 */
			async newGoodsesList() {
				uni.request({
					url: this.$baseUrl + "newGoodsForApp", //仅为示例，并非真实接口地址。
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200) {
							if (res.data.data.bgImages.length > 0) {
								this.newGoodsImg1 = res.data.data.bgImages[0];
								this.newGoodsImg2 = res.data.data.bgImages[1];
								this.newGoodsImg3 = res.data.data.bgImages[2];
							}
							if (res.data.data.data.length > 0) {
								this.newGoodsList1 = res.data.data.data[0];
								this.newGoodsList2 = res.data.data.data[1];
								this.newGoodsList3 = res.data.data.data[2];
							}
						} else {
						}
					}
				});
			},
			/**
			 * 推荐商品
			 */
			async loadRecommendGoodsesList(type='add', loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				uni.request({
					url: this.$baseUrl + "recommendGoodses?page="+ this.pageNum
					     + "&limit=10&crids="+ this.cids,
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200) {
							for (var i = 0; i < res.data.data.list.length; i ++) {
								this.recommendGoodsList.push(res.data.data.list[i]);
							}
							this.pageNum += 1
							//判断是否还有下一页，有是more  没有是nomore(测试数据=0就没有了)
							this.loadingType = res.data.data.list.length === 0 ? 'nomore' : 'more';
						} else {
						}
					}
				});
				
			},
			navToList(tid) {
				uni.navigateTo({
					url: `/pages/product/list?tid=${tid}`
				})
			}
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: `/pages/search/search`
			})
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		}
		// #endif
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:$font-color-base;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}
	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	// 头部广告图片
	.top-image {
		width: 80%;
		padding: 0upx 20upx 20upx;
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.ad-1{
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;
		image{
			width:100%;
			height: 100%; 
		}
	}
	
	.f-header{
		display:flex;
		align-items:center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		image{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit{
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
		.icon-you{
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}
	/* 团购楼层 */
	.group-section{
		background: #fff;
		.g-swiper{
			height: 300upx;
			padding-bottom: 30upx;
		}
		.g-swiper-item{
			width: 33%;
			padding: 0 30upx;
			display:flex;
		}
		image{
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}
		.g-item{
			width: 33%;
			display:flex;
			flex-direction: column;
			overflow:hidden;
		}
		.left{
			flex: 1;
			margin-right: 24upx;
			.t-box{
				padding-top: 20upx;
			}
		}
		.right{
			flex: 1;
			flex-direction: column-reverse;
			.t-box{
				padding-bottom: 20upx;
			}
		}
		.t-box{
			height: 100upx;
			font-size: $font-base+2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}
		.price{
			color:$uni-color-primary;
		}
		.m-price{
			font-size: $font-sm+2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}
		.progress-box{
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}
	/* 分类推荐楼层 */
	.hot-floor{
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;
		.floor-img-box{
			width: 100%;
			height:320upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255,255,255,.06) 30%, #f8f8f8);
			}
		}
		.floor-img{
			width: 100%;
			height: 100%;
		}
		.floor-list{
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top:-140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0,0,0,.2);
			position: relative;
			z-index: 1;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
		.more{
			display:flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;
			text:first-child{
				margin-bottom: 4upx;
			}
		}
	}
	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
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
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>
