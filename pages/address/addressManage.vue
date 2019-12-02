<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">{{lang.recipient}}</text>
			<input class="input" id="recipient" type="text" v-model="addressData.userName" 
			:placeholder="recipientUserName" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">{{lang.userMobilTilte}}</text>
			<input class="input" id="userMobil" type="number" v-model="addressData.mobile" 
			:placeholder="userMobil" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">{{lang.userAddress}}</text>
			<text @click="chooseLocation" class="input">
				{{addressData.address}}
			</text>
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b"> 
			<text class="tit">{{lang.addressDescription}}</text>
			<input class="input" id="addressDescription" type="text" v-model="addressData.description" 
			:placeholder="addressDescriptionPl" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">{{lang.addressDefault}}</text>
			<switch :checked="addressData.isDefault" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">{{lang.commit}}</button>
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex';  
	export default {
		data() {
			return {
				addressData: {
					userId: '',
					userName: '',
					mobile: '',
					address: '',
					description: '',
					isDefault: false,
				},
				recipientUserName: '',
				userMobil: '',
				addressDescriptionPl: '',
			}
		},
		onLoad(option) {
			this.recipientUserName = this.lang.recipientUserName
			this.userMobil = this.lang.userMobil
			this.addressDescriptionPl = this.lang.addressDescriptionPl
			let title = this.lang.addresAdd;
			if(option.type==='edit') {
				title = this.lang.addresEdit
				this.addressData = JSON.parse(option.data)
			} else {
				this.addressData.address = this.lang.addresName
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		computed: {
			...mapState([
				'lang'
			])
		},
		methods: {
			switchChange(e){
				this.addressData.isDefault = e.isDefault;
			},
			
			//地图选择地址
			chooseLocation() {
				uni.chooseLocation({
					success: (data)=> {
						this.addressData.address = data.address;
					}
				})
			},
			
			//提交
			confirm() {
				let data = this.addressData;
				if(!data.userName) {
					this.$api.msg(this.lang.pleaseInputTargetName);
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)){
					this.$api.msg(this.lang.pleaseInputNumber);
					return;
				}
				if(!data.address){
					this.$api.msg(this.lang.pleaseInputYourAddress);
					return;
				}
				if(!data.description){
					this.$api.msg(this.lang.pleaseInputYourDescription);
					return;
				}
				if (data.isDefault) {
					data.isDefault = 1
				} else {
					data.isDefault = 0
				}
				uni.request({
				    url: this.$baseUrl + "address/add", //仅为示例，并非真实接口地址。
					data: data,
				    header: {
						  'content-type': 'application/json' //自定义请求头信息
					  },
					method: "PUT",
				    success: (res) => {
						 if (res.data.resultCode == 200) {
							 var list = uni.getStorageSync("addressList")
							 if (list != null && list.length > 0) {
								 list.push(data)
								 //保存地址信息到本地
								 uni.setStorage({//缓存用户登陆状态
								     key: 'addressList',  
								     data: list  
								 })
							 } else {
								 var addressList = new Array;
								 addressList.push(data)
								 //保存地址信息到本地
								 uni.setStorage({//缓存用户登陆状态
								     key: 'addressList',  
								     data: addressList  
								 })
							 }
							 this.$api.msg(`${this.lang.addres}${this.manageType=='edit' ? this.lang.update : this.lang.add + this.lang.success}`);
							 //this.$api.prePage()获取上一页实例，在App.vue定义
							 this.$api.prePage().addressData = data;
							 setTimeout(() => {
							 	uni.navigateBack()
							 }, 800)
						 } else {
						 	this.$api.msg(res.data.message);
						 }
				    }
				});
				// this.$api.prePage().refreshList(data, this.manageType);
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
