<template>
	<view class="ali">
		<view class="ali_top borders" v-if="state != 3">
			<text class="ali_top_icon">收</text>
			<text class="a14">{{userAddress}}</text>
		</view>
		<!-- ======="state": 0 ,1 ,2====== -->
		<view class="ali_state">
			<block v-for="(item,i) in datas" :key="i">
				<view class="State_Four">
					<view class="FourBox">
						<text class="ali_top_icon" :class="[item.AcceptStation.includes('签收') ? 'isOk' : '']" 
						style="margin: 0 0;">
						</text>
						<text class="line" :class="[i == datas.length -1?'noline':'']"></text>
					</view>
					<view class="remark">
						<text class="a14"  v-if="i == datas.length-1">已发货</text>
						<text class="a14"  v-else>{{item.AcceptStation}}</text>
						<text class="a12" style="padding-top: 10upx;">{{item.AcceptTime}}</text>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		props:["datas","state","ways","userAddress"],
		data(){
			return{
				
			}
		},
		//过滤返回关键字
		filters:{
			Type(item){
				let Info;
				let Phone = /\d{11}/;
				if(Phone.test(item) && item.includes('正在派')){
					Info = "派";
				}else if(item.includes('已收取快件')){
					Info = "揽";
				}else if(item.includes('营业')){
					Info = "运";
				}else if(item.includes('丰巢智能快递柜')){
					Info = "待";
				}else if(item.includes('签收')){
					Info = "收";
				}else{
					Info = "";
				}
				return Info
			}
		},
		onLoad() {
			debugger
			let title = this.getShipperName(this.ways.ShipperCode)
			setTimeout(() => {
				uni.setNavigationBarTitle({
					title: title + "——物流信息"
				})
			}, 100);
		},
		methods: {
			//判断哪个该展示关键字--还是默认
			Type(item){
				
				let Info;
				let Phone = /\d{11}/;
				if(Phone.test(item) && item.includes('正在派')){
					Info = true;
				}else if(item.includes('已收取快件')){
					Info = true;
				}else if(item.includes('营业')){
					Info = true;
				}else if(item.includes('丰巢智能快递柜')){
					Info = true;
				}else if(item.includes('签收')){
					Info = true;
				}else{
					Info = false;
				}
				return Info
			},
			getShipperName(code){
				if ('ZTO' === code) {
					return '中通快递';
				}
				if ('STO' === code) {
					return '申通快递';
				}
				if ('YTO' === code) {
					return '圆通速递';
				}
				if ('YD' === code) {
					return '韵达速递';
				}
				if ('YZPY' === code) {
					return '邮政快递包裹';
				}
				if ('EMS' === code) {
					return 'EMS';
				}
				if ('HHTT' === code) {
					return '天天快递';
				}
				if ('JD' === code) {
					return '京东快递';
				}
				if ('UC' === code) {
					return '优速快递';
				}
				if ('DBL' === code) {
					return '德邦快递';
				}
				if ('ZJS' === code) {
					return '宅急送';
				}
				if ('SF' === code) {
					return '顺丰速运';
				}
			}
		},
	}
</script>

<style>
	.isOk{
		background-color: #F0AD4E !important;
	}
	.ali_top_iconss{
		width: 12upx;
		height: 12upx;
		display: block;
		background-color: #999;
		padding-right: 2upx;
		border-radius: 50%;
	}
	.noline{
		background-color: #fff !important;
	}
	.State_Four{
		display: flex;
		/* border: 1upx solid red; */
	}
	.FourBox{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-right: 24upx;
	}
	.line{
		width: 2upx;
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: #999;
	}
	/* ============= */
	.remark{
		display: flex;
		flex-direction: column;
		width: 90%;
		padding: 24upx 0;
	}
	.borders{
		border-bottom: 1upx solid #F2F2F2;
		padding: 24upx 0;
	}
	.ali_top_icons{
		width: 46upx;
		height: 46upx;
		display: block;
		background-color: #FFF;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		align-content: center;
	}
	.ali_top_icon{
		width: 46upx;
		height: 46upx;
		display: block;
		background-color: #83AECF;
		color: #fff;
		font-size: 28upx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20upx;
	}
	.ali_top{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	/* ========公共========= */
	.a14{
		font-size: 28upx;
		color: #000000;
	}
	.a12{
		font-size: 24upx;
		color: #999;
	}
	.ali{
		/* width: 100%; */
		/* border: 1upx solid #F76260; */
		background-color: #FFFFFF;
		margin: 24upx;
		border-radius:18upx;
		padding: 0 24upx;
		display: flex;
		flex: 1;
		flex-direction: column;
	}
</style>
