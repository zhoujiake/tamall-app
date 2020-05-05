<template>
	<view class="app">
		<view class="price-box">
			<text>{{lang.payTotoal}}</text>
			<text class="price">{{amount}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view v-show="false" class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<view v-show="false" class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥198.5</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view>
		</view>
		
		<text class="mix-btn" @click="requestPayment()">{{lang.confirmPay}}</text>
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex';  
	export default {
		data() {
			return {
				payType: 1,
				orderInfo: {},
				orderNo: 0,
				amount: 0, // 钱
				payObject: {
					orderNo: '',
					totalFee: 0
				}
			};
		},
		computed: {
			...mapState([
				'lang'
			])
		},
		onLoad(options) {
			this.orderNo = options.orderNo;
			this.amount = options.amount;
			// 标题文字
			var title = this.lang.payment;
			setTimeout(() => {
				uni.setNavigationBarTitle({
					title: title
				});
			},300)
		},
		methods: {
			async requestPayment() {
			    let orderInfo = await this.getOrderInfo(this.orderNo);
			    console.log("得到订单信息", orderInfo);
			    if (orderInfo.statusCode !== 200) {
			        console.log("获得订单信息失败", orderInfo);
			        uni.showModal({
			            content: "获得订单信息失败",
			            showCancel: false
			        })
			        return;
			    }
			    uni.requestPayment({
			        provider: 'wxpay',
			        orderInfo: orderInfo.data.data,
			        success: (e) => {
						// 查询支付结果来判断，是否支付成功\
						this.payObject.orderNo = this.orderNo
						uni.request({
						    url: this.$baseUrl + '/wxOrderQuery',
							method: "POST",
							data: this.payObject,
							header: {
								  'content-type': 'application/json' //自定义请求头信息
						    },
						    success: (result) => {
								uni.showToast({
								    title: "支付成功！"
								})
								uni.redirectTo({
									url: '/pages/money/paySuccess'
								})
						    },
						    fail: (e) => {
								console.log("fail ", e);
								uni.showToast({
								    title: "支付异常！"
								})
						    }
						})
			            
			        },
			        fail: (e) => {
						console.log("fail ", e);
						uni.showToast({
						    title: "取消支付"
						})
			            console.log("fail", e);
			           /* uni.showModal({
			                content: "支付失败,原因为: " + e.errMsg,
			                showCancel: false
			            }) */
			        },
			        complete: () => {
			            // this.providerList[0].loading = false;
			        }
			    })
			},
			// 获取与支付订单信息
			getOrderInfo(e) {
				this.payObject.orderNo = this.orderNo
				this.payObject.totalFee = this.amount * 100;
			    let url = this.$baseUrl + '/wxOrderInfo';
			    return new Promise((res) => {
			        uni.request({
			            url: url,
						method: "POST",
						data: this.payObject,
						header: {
							  'content-type': 'application/json' //自定义请求头信息
					    },
			            success: (result) => {
			                res(result);
			            },
			            fail: (e) => {
			                res(e);
			            }
			        })
			    })
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
