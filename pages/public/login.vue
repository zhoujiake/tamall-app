<template>
	<view class="container">
		<view class="top-sign">
			<image src="../../static/imgs/login-bg-top.png" style="width: 100%;"></image>
		</view>
		<view class="right-close-button" @click="navBack">
			<image src="../../static/imgs/close.png" style="width: 40upx; height: 40upx;"></image>
		</view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">{{lang.welcomeLogin}}</view>
			<view class="welcome">
				{{lang.welcome}}
			</view>
		    <form @submit="toLogin" >
				<view class="input-content">
					<view class="input-item">
						<text class="tit">{{lang.phoneNumber}}</text>
						<input
						    name="loginName"
							type="number" 
							:value="mobile"
							:placeholder="lang.inputPhoneNumber"
							maxlength="11"
							data-key="mobile"
							@input="inputChange"
						/>
					</view>
					<view class="input-item">
						<text class="tit">{{lang.loginPwd}}</text>
						<input
						    name="password"
							type="mobile" 
							value="" 
							:placeholder="lang.loginPasswordMsg"
							placeholder-class="input-empty"
							maxlength="20"
							password 
							data-key="password"
							@input="inputChange"
						/>
					</view>
				</view>
				<button form-type="submit" class="confirm-btn" :disabled="logining">{{lang.login}}</button>
			</form>
			<!-- <view class="forget-section">
				{{lang.forgetPassword}}
			</view> -->
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
		    <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
		        <image :src="provider.image" @tap="oauth(provider.value)"></image>
		    </view>
		</view>
		<view class="register-section">
			{{lang.noAccountYet}}<text @tap="toRegist()">{{lang.registryNow}}</text>
		</view>
		<view class="bottom-sign">
			<image src="../../static/imgs/login-bg-bottom.png" style="width: 100%;height: 120upx;"></image>
		</view>
	</view>
</template>

<script>
	import {
        mapMutations,mapState 
    } from 'vuex';
	
	export default{
		data() {
			return {
				mobile: '',
				password: '',
				providerList: [],
				hasProvider: false,
				logining: false,
				positionTop: 0
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.mobile = this.$store.state.userInfo.loginName
		},
		onReady() {
			this.initPosition()
			this.initProvider()
		},
		computed: {
			...mapState(['JIM','deviceInfo','jimUserName','lang'])
		},
		methods: {
			...mapMutations(['login']),
			...mapMutations(['setUserInfo']),
			...mapMutations(['getJPushData']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist() {
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
							 let provider = res.data.data;
							 var userInfo = {
							 	'nickName': provider.nickName,
							 	'loginName': provider.loginName,
							 	'password': this.password,
							 	'gender': provider.gender,
							 	'email': provider.email,
							 	'openId': provider.openId,
							 	'loginType': provider.loginType,
							 	'deviceInfo': this.deviceInfo,
							 	'province': provider.province,
							 	'city': provider.city,
							 	'countySeat': provider.countySeat,
							 }
							 this.login(userInfo)
							 this.$api.msg('登录成功');
							 // 登录JIM
							 if (!this.JIM.isLogin()) {
								 this.getJPushData()
							 }
							 uni.navigateBack();
						 } else {
						 	this.$api.msg(res.data.message);
						 }
				    }
				});
			},
			initProvider() { // 获取第三方登录服务
			    const filters = ['weixin'];
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
						uni.login({ // 第三方授权登录
						  provider: value,
						  success: loginRes => {
						    console.log(loginRes.authResult);
							uni.getUserInfo({
							    provider: value,
							    success: (infoRes) => {
									console.log("wechat user info" + infoRes)
									var userInfo = {}
									// 微信登录
									if (value == 'weixin') {
										 userInfo = {
											'nickName': infoRes.userInfo.nickName,
											'loginName': '',
											'avatar': infoRes.userInfo.avatarUrl,
											'openId': infoRes.userInfo.openId,
											'gender': infoRes.userInfo.gender,
											'loginType': value,
											'deviceInfo': this.deviceInfo,
											'province': infoRes.userInfo.province,
											'city': infoRes.userInfo.city,
											'countySeat': '',
										}
										var d = this.jimUserName
										if (this.JIM.isLogin()) {
											 this.getJPushData()
										}
									}
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
												debugger
												this.login(res.data.data);
												this.$api.msg('登录成功');
												uni.navigateBack();
											} else {
												this.$api.msg(res.data.message);
											}
									    }
									});
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
			randomString(len) {
			　　len = len || 32;
			　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789';    
			   /**** 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1 ****/
			　　var maxPos = $chars.length;
			　　var pwd = '';
			　　for (let i = 0; i < len; i++) {
			　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			　　}
			　　return pwd;
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
	.right-close-button{
		position:absolute;
		right: 40upx;
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
	.bottom-sign{
		position:absolute;
		bottom:10upx;
		z-index: -0;
		overflow: hidden;
		height: 120upx;
		width: 100%;
		margin-bottom: 120upx;
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
	
	.left-bottom-sign{
		position: absolute;
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
		z-index: 10;
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
		background: #3d738a;
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
	    border: 1px solid #FFF;
	    border-radius: 50px;
	    margin: 0 20px;
	    background-color: #ffffff;
	}
	
	.oauth-image image {
	    width: 50px;
	    height: 50px;
	    margin: 0px;
	}
</style>
