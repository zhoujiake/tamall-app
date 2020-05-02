<template>
	<view class="container">
		<view class="list-cell">
			<text class="cell-tit">{{lang.nickName}}</text>
			<text class="cell-tit">{{userInfo.nickName}}</text>
		</view>
		<view class="list-cell" v-if="userInfo.gender === 1">
			<text class="cell-tit">{{lang.sex}}</text>
			<text class="cell-tit">{{lang.male}}</text>
		</view>
		<view class="list-cell" v-else>
			<text class="cell-tit">{{lang.sex}}</text>
			<text class="cell-tit">{{lang.Female}}</text>
		</view>
		<view class="list-cell">
			<text class="cell-tit">{{lang.userLoginName}}</text>
			<text class="cell-tit">{{userInfo.loginName}}</text>
		</view>
		<view class="list-cell">
			<text class="cell-tit">{{lang.province}}</text>
			<text class="cell-tit">{{userInfo.province}}</text>
		</view>
		<view class="list-cell">
			<text class="cell-tit">{{lang.city}}</text>
			<text class="cell-tit">{{userInfo.city}}</text>
		</view>
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
			//#ifdef APP-PLUS  
			 this.currentVersion = this.lang.currentVersionFlag + plus.runtime.version  
			//#endif
			uni.setNavigationBarTitle({
				title: this.lang.userInfo
			})
		},
		computed: {
			...mapState([
				'lang',
				'userInfo',
			])
		},
		methods:{
			navTo(url){
				this.$api.msg(``);
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
