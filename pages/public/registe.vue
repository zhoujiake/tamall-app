<template>
	<view class="container">
		<view class="top-sign">
			<image src="../../static/imgs/login-bg-top.png" style="width: 100%;"></image>
		</view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">{{lang.regist}}</view>
			<view class="welcome">
				{{lang.loginRegistry}}
			</view>
		    <form @submit="toRegist">
				<view class="input-content">
					<view class="input-item">
						<text class="tit">{{lang.nickName}}</text>
						<input 
						    name="nickName"
							type="text" 
							v-model="nickName"
							:placeholder="lang.inputUserName"
							maxlength="20"
						/>
					</view>
				    <view class="input-item">
				    	<text class="tit">{{lang.userNameAndPhoneNumber}}</text>
				    	<input 
				    	    name="loginName"
				    		type="number" 
				    		:placeholder="lang.inputPhoneNumber"
				    		maxlength="11"
							v-model="mobile"
				    	/>
				    </view>
					<view class="gender-radio">
						<radio-group name="gender" >
							<label style="margin-right: 20upx;">
								<radio value="1" /><text>{{lang.male}}</text>
							</label>
							<label>
								<radio value="2" /><text>{{lang.Female}}</text>
							</label>
						</radio-group>
					</view>
					<view class="input-item">
						<text class="tit">{{lang.email}}</text>
						<input
						    name="email"
							type="text" 
							:placeholder="lang.inputEmail"
							placeholder-class="input-empty"
							maxlength="30"
							v-model="email"
						/>
					</view>	
					<view class="input-item">
						<text class="tit">{{lang.loginPwd}}</text>
						<input
						    name="password"
							type="text" 
							:placeholder="lang.loginPasswordMsg"
							placeholder-class="input-empty"
							maxlength="20"
							password 
							v-model="password"
						/>
					</view>	
					<view class="input-item">
						<text class="tit">{{lang.confirmPwd}}</text>
						<input
						    name="password"
							type="text" 
							:placeholder="lang.inputPhoneNumber"
							placeholder-class="input-//empty"
							maxlength="20"
							password
							v-model="verfPassword"
						/>
					</view>
				    <button 
					   form-type="submit" 
					   class="confirm-btn" 
					   :disabled="logining">
					     {{lang.regist}}
					</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {
        mapMutations,mapState
    } from 'vuex';
	
	export default{
		data(){
			return {
				nickName: '',
				mobile: '',
				password: '',
				email: '',
				verfPassword: '',
				logining: false,
			}
		},
		onLoad(){
			
		},
		onReady() {
		},
		computed: {
			...mapState(['JIM','deviceInfo','lang'])
		},
		methods: {
			...mapMutations(['setUserInfo']),
			navBack(){
				uni.navigateBack();
			},
			async toRegist(e) {
				if(this.nickName == "") {
					this.$api.msg('请输入用户名/昵称！');
					return
				}
				if (this.nickName.length < 1) {
					this.$api.msg("用户名/昵称不能少于1个字符！")
					return
				}
				if(this.mobile == "") {
					this.$api.msg('请输入手机号码！');
					return
				}
				if(this.mobile.length < 11) {
					this.$api.msg('手机号有误！');
					return
				}
				if(this.password == "") {
					this.$api.msg('请输入密码！');
					return
				}	
				if(this.password.length < 6) {
					this.$api.msg('请输入六位以上的密码！');
					return
				}
				if(this.verfPassword == "") {
					this.$api.msg('请输入确认密码！');
					return
				}
				if(this.password != this.verfPassword) {
					this.$api.msg('密码不一致！');
					return
				}
				
				var formdata = e.detail.value	
				var userInfo = {
					'nickName': formdata.nickName,
					'loginName': formdata.loginName,
					'password': formdata.password,
					'gender': formdata.gender,
					'email': formdata.email,
					'loginType': 'normal',
					'deviceInfo': this.$store.state.deviceInfo,
					'province': '',
					'city': '',
					'countySeat': '',
				}
				uni.request({
				    url: this.$baseUrl + "registerForApp", //仅为示例，并非真实接口地址。
					data: userInfo,
				    header: {
						  'content-type': 'application/json' //自定义请求头信息
					  },
					method: "POST",
				    success: (res) => {
						if (res.data.resultCode == 200) {
							var userInfo = {
								'nickName': formdata.nickName,
								'loginName': formdata.loginName,
								'password': formdata.password
							}
							this.setUserInfo(userInfo);
							uni.showToast({
								title: '注册成功，请登录！',
								icon: 'none',
								mask: true,
								duration: 2000
							})
							uni.navigateBack();
						} else {
							this.$api.msg(res.data.message);
						}
				    }
				});
			}
		},
	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.top-sign{
		position:absolute;
		top:0upx;
		z-index: 0;
		overflow: hidden;
		height: auto;
		width: 100%;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	
	.wrapper{
		margin-top: 26upx;
		z-index: 10;
		background: #fff;
		padding-bottom: 40upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	.gender-radio {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: -20upx;
		margin-bottom: 20upx;
		margin-right: 10upx;
	}
</style>
