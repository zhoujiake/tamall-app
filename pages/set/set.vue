<template>
	<view class="container">
	<!--<view class="list-cell b-b m-t" @click="navTo('')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{lang.userInfo}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
	<!--<view class="list-cell b-b" @click="navTo('收货地址')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
	<!--<view class="list-cell" @click="navTo('实名认证')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">实名认证</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
	<!--<view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
	<!--<view class="list-cell m-t b-b" @click="navTo('清除缓存')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="list-cell b-b" @click="navTo('/pages/set/aboutUs')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{lang.abaotUs}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @click="checkAppVersion">
			<text class="cell-tit">{{lang.checkVersion}}</text>
			<text class="cell-tip">{{currentVersion}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">{{lang.loginOut}}</text>
		</view>
		<uni-popup ref="tip" :type="type" :custom="true" :mask-click="false">
			<view class="uni-tip">
				<view class="uni-tip-title">{{lang.versionUpdate}}</view>
				<view class="uni-tip-content">{{appNote}}</view>
				<view class="uni-tip-group-button">
					<view class="uni-tip-button" @click="updateApp(false)">{{lang.cancelUpdate}}</view>
					<view class="uni-tip-button-confirm" @click="updateApp(true)">{{lang.confirmUpdate}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {  
		mapState,
	    mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				currentVersion: '',
				type: 'center',
				appNote: '',
				appUrl: '',
			};
		},
		onLoad() {
			//#ifdef APP-PLUS  
			 this.currentVersion = this.lang.currentVersionFlag + plus.runtime.version  
			//#endif
			uni.setNavigationBarTitle({
				title: this.lang.setting
			})
		},
		computed: {
			...mapState([
				'lang',
				'deviceInfo',
			])
		},
		methods:{
			...mapMutations(['logout']),
			navTo(url){
				uni.navigateTo({
					url: url
				})
			},
			//退出登录
			toLogout(){
				uni.showModal({
					confirmText: this.lang.ok,
					cancelText: this.lang.no,
					content: this.lang.loginOutMessage,
					success: (e)=>{
						if(e.confirm){
							this.logout();
							setTimeout(()=>{
								uni.navigateBack();
							}, 200)
						}
					}
				})
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			checkAppVersion() {
				//#ifdef APP-PLUS  
				var server = this.$baseUrl + "app-update"; //检查更新地址  
				var req = { //升级检测数据  
					"appid": plus.runtime.appid,  
					"version": plus.runtime.versionCode  
				};  
				uni.request({  
					url: server,  
					data: req,  
					success: (res) => {
						if (res.statusCode == 200 && res.data.data.status === 1) {  
							// this.show = true//提醒用户更新  
							this.$refs['tip'].open()
							this.appNote = res.data.data.note
							this.appUrl = res.data.data.url
						} else {
							this.$api.msg(this.lang.ltestVersion)
						}
					}  
				})
				//#endif  
			},
			updateApp(type) {
				if (type) {
					plus.runtime.openURL(this.appUrl);
					this.$refs['tip'].close()
				}else{
					this.$refs['tip'].close()
				}
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
	/* 提示窗口 */
	.uni-tip {
		padding: 15px;
		width: 300px;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10px;
	}
	
	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}
	
	.uni-tip-content {
		padding: 15px;
		font-size: 14px;
		color: #666;
	}
	
	.uni-tip-group-button {
		margin-top: 10px;
		display: flex;
	}
	
	.uni-tip-button {
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
	
	.uni-tip-button-confirm {
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #ffaa00;
	}
	
</style>
