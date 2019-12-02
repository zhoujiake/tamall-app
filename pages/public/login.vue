<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
		    <form @submit="toLogin">
				<view class="input-content">
					<view class="input-item">
						<text class="tit">手机号码</text>
						<input 
						    name="loginName"
							type="number" 
							:value="mobile"
							placeholder="请输入手机号码"
							maxlength="11"
							data-key="mobile"
							@input="inputChange"
						/>
					</view>
					<view class="input-item">
						<text class="tit">密码</text>
						<input
						    name="password"
							type="mobile" 
							value="" 
							placeholder="8-18位不含特殊字符的数字、字母组合"
							placeholder-class="input-empty"
							maxlength="20"
							password 
							data-key="password"
							@input="inputChange"
						/>
					</view>
				</view>
				<button form-type="submit" class="confirm-btn" :disabled="logining">登录</button>
			</form>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
		    <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
		        <image :src="provider.image" @tap="oauth(provider.value)"></image>
		    </view>
		</view>
		<view class="register-section">
			还没有账号? <text @tap="toRegist()">马上注册</text>
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
				mobile: '',
				password: '',
				providerList: [],
				hasProvider: false,
				logining: false,
				positionTop: 0
			}
		},
		onLoad(){
			
		},
		onShow() {
			this.mobile = this.$store.state.userInfo.loginName
		},
		onReady() {
			this.initPosition()
			this.initProvider()
		},
		methods: {
			...mapMutations(['login']),
			...mapMutations(['setUserInfo']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				uni.navigateTo({
					url: '/pages/public/registe'
					})  
			},
			// 登录接口
			async toLogin(e) {	
				if(this.mobile == "") {
					this.$api.msg('请输入手机号码');
					return
				}
				if(this.mobile.length < 11) {
					this.$api.msg('手机号有误');
					return
				}
				if(this.password == "") {
					this.$api.msg('请输入密码');
					return
				}	
				if(this.password.length < 6) {
					this.$api.msg('请输入六位以上的密码');
					return
				}
				var formdata = e.detail.value
				// 登录请求				
				uni.request({
				    url: this.$baseUrl + "loginForApp", //仅为示例，并非真实接口地址。
					data: formdata,
				    header: {
						  'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					  },
					method: "POST",
				    success: (res) => {
						 if (res.data.resultCode == 200) {
							 this.login(res.data)
							 console.log(res.data)
							 this.$api.msg('登录成功');
							 uni.navigateBack();
						 } else {
						 	this.$api.msg(res.data.message);
						 }
				    }
				});
			},
			initProvider() { // 获取第三方登录服务
			    const filters = ['weixin', 'qq'];
			    uni.getProvider({
			        service: 'oauth',
			        success: (res) => {
			            if (res.provider && res.provider.length) {
			                for (let i = 0; i < res.provider.length; i++) {
			                    if (~filters.indexOf(res.provider[i])) {
			                        this.providerList.push({
			                            value: res.provider[i],
			                            image: '../../static/' + res.provider[i] + '.png'
			                        });
			                    }
			                }
			                this.hasProvider = true;
			            }
			        },
			        fail: (err) => {
			            console.error('获取服务供应商失败：' + JSON.stringify(err));
			        }
			    });
			},
			initPosition() {
			    /**
			     * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			     * 反向使用 top 进行定位，可以避免此问题。
			     */
			    this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			oauth(value) {
			    uni.login({
			        provider: value,
			        success: (res) => {
			            uni.getUserInfo({
			                provider: value,
			                success: (infoRes) => {
								console.log("wechat user info" + infoRes)
								var userInfo = {}
								if (value == 'weixin') { // 微信登录
									 userInfo = {
										'nickName': infoRes.userInfo.nickName,
										'loginName': '',
										'avatar': infoRes.userInfo.avatarUrl,
										'openId': infoRes.userInfo.openId,
										'gender': infoRes.userInfo.gender,
										'loginType': value,
										'deviceInfo': this.$store.state.deviceInfo,
										'province': infoRes.userInfo.province,
										'city': infoRes.userInfo.city,
										'countySeat': '',
									}
								} else if(value == 'qq') {// QQ登录
									 userInfo = {
										'nickName': infoRes.userInfo.nickName,
										'loginName': '',
										'avatar': infoRes.userInfo.avatarUrl,
										'openId': infoRes.userInfo.openId,
										'gender': infoRes.userInfo.gender_type,
										'loginType': value,
										'deviceInfo': this.$store.state.deviceInfo,
										'province': infoRes.userInfo.province,
										'city': infoRes.userInfo.city,
										'countySeat': '',
									}
								}
								this.setUserInfo(userInfo);
								// 第三方用户登录 
								uni.request({
								    url: this.$baseUrl + "loginForAppOfOtherPlatform", //仅为示例，并非真实接口地址。
									data: userInfo,
								    header: {
										  'content-type': 'application/json' //自定义请求头信息
									  },
									method: "POST",
								    success: (res) => {
										if (res.data.resultCode == 200) {
											this.login(userInfo);
											this.$api.msg('登录成功');
											uni.navigateBack();
										} else {
											this.$api.msg(res.data.message);
										}
								    }
								});
			                }
			            });
			        },
			        fail: (err) => {
			            console.error('授权登录失败：' + JSON.stringify(err));
			        }
			    });
			},
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
	
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
	
	.action-row navigator {
	    color: #007aff;
	    padding: 0 10px;
	}
	
	.oauth-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	    top: 0;
	    left: 0;
	    width: 100%;
	}
	
	.oauth-image {
	    width: 50px;
	    height: 50px;
	    border: 1px solid #dddddd;
	    border-radius: 50px;
	    margin: 0 20px;
	    background-color: #ffffff;
	}
	
	.oauth-image image {
	    width: 30px;
	    height: 30px;
	    margin: 10px;
	}
</style>
