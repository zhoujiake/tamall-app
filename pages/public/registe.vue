<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				用户注册
			</view>
		    <form @submit="toRegist">
				<view class="input-content">
					<view class="input-item">
						<text class="tit">昵称</text>
						<input 
						    name="nickName"
							type="text" 
							v-model="nickName"
							placeholder="请输入用户名/昵称"
							maxlength="20"
						/>
					</view>
				    <view class="input-item">
				    	<text class="tit">用户名/手机号码</text>
				    	<input 
				    	    name="loginName"
				    		type="number" 
				    		placeholder="请输入手机号码"
				    		maxlength="11"
							v-model="mobile"
				    	/>
				    </view>
					<view class="gender-radio">
						<radio-group name="gender" >
							<label>
								<radio value="1" /><text>男</text>
							</label>
							<label>
								<radio value="2" /><text>女</text>
							</label>
						</radio-group>
					</view>
					<view class="input-item">
						<text class="tit">邮箱</text>
						<input
						    name="email"
							type="text" 
							placeholder="请输入邮箱号"
							placeholder-class="input-empty"
							maxlength="30"
							v-model="email"
						/>
					</view>	
					<view class="input-item">
						<text class="tit">密码</text>
						<input
						    name="password"
							type="text" 
							placeholder="8-18位不含特殊字符的数字、字母组合"
							placeholder-class="input-empty"
							maxlength="20"
							password 
							v-model="password"
						/>
					</view>	
					<view class="input-item">
						<text class="tit">确认密码</text>
						<input
						    name="password"
							type="text" 
							placeholder="请输入确认密码"
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
					     注册
					</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {
        mapMutations  
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
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
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
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
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
		align-items: flex-end;
	}
</style>
