<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/ic_carte0.png" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				{{lang.empty}}
				<navigator class="navigator" v-if="hasLogin" url="../index/index" 
				open-type="switchTab">{{lang.shopping}}></navigator>
			</view>
			<view v-else class="empty-tips">
				{{lang.empty}}
				<view class="navigator" @click="navToLogin">{{lang.goToLogin}}</view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.cartItemId">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					    >
						<view class="image-wrapper">
							<image :src="item.goodsCoverImg" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)"
							></view>
						</view>
						<view class="item-right" @click="navToDetailPage(item)">
							
							<text v-if="userLang === 'tb'" class="title clamp">
								{{switchLanguageForString(item.goodsName, 0)}}
							</text>
							<text v-else class="title clamp">
								{{switchLanguageForString(item.goodsName, 1)}}
							</text>
							
							<!-- <text class="attr">{{}}</text> -->
							<text class="price" style="margin-top: 20upx;">{{lang.moneyFlag + item.sellingPrice}}</text>
							<uni-number-box 
								class="step"
								:min="1" 
								:max="item.stockNum"
								:value="item.goodsCount > item.goodsCount ? item.goodsCount : item.goodsCount"
								:isMax="item.goodsCount >= item.goodsCount ? true : false"
								:isMin="item.goodsCount === 1"
								:index="index"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index, item)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						{{lang.clear}}
					</view>
				</view>
				<view class="total-box">
					<text class="price">{{lang.moneyFlag + total}}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">{{lang.settlement}}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
			};
		},
		onLoad(option) {
			var title = this.lang.cart;
			setTimeout(function() {
				uni.setNavigationBarTitle({
					title: title
				})
			},300)
			var d = option;
		},
		onShow() {
			this.cartList = [];
			this.total = 0;
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['hasLogin', 'lang','userLang'])
		},
		methods: {
			//请求数据
			async loadData() {
				uni.request({
				    url: this.$baseUrl + "shop-cart-app",
					method: "GET",
				    success: (res) => {
						if (res.data.resultCode == 200) {
							let list = res.data.data.myShoppingCartItems;
							let tempCartList = list.map(item => {
								item.checked = true;
								return item;
							});
							this.cartList = tempCartList;
							this.total = res.data.data.priceTotal;
						} else {
						}
				    }
				});
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index) {
				if(type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data){
				this.cartList[data.index].goodsCount += 1;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index, item) {
				uni.request({
				    url: this.$baseUrl + "shop-cart/" + item.cartItemId,
					method: "DELETE",
				    success: (res) => {
						if (res.data.resultCode == 200) {
							let list = this.cartList;
							let row = list[index];
							let id = row.id;
							
							this.cartList.splice(index, 1);
							this.calcTotal();
							uni.hideLoading();
						} else {
						}
				    }
				});
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=> {
						if(e.confirm) {
							var itemIds = '';
							let list = this.cartList;
							list.forEach(item => {
								itemIds += item.cartItemId + ","
							})
							itemIds = itemIds.substring(0, itemIds.length - 1)
							//debugger
							uni.request({
							    url: this.$baseUrl + "shop-cart-delete-all/" + itemIds,
								method: "DELETE",
							    success: (res) => {
									if (res.data.resultCode == 200) {
										this.cartList = [];
									} else {
									}
							    }
							});
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += item.sellingPrice * item.goodsCount;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item=> {
					if(item.checked) {
						goodsData.push({
							goodsId: item.goodsId,
							goodsName: item.goodsName,
							goodsCount: item.goodsCount,
							goodsCoverImg: item.goodsCoverImg,
							sellingPrice: item.sellingPrice,
						})
					}
				})
				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify({
						goodsData: goodsData
					})}`
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
			// 分类名称语言切换
			switchLanguageForString(str, index){
				if(str.indexOf("|") == -1) {
					return str
				} else {
					var arr = str.split('|');
					return arr[index];
				}
			},
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
