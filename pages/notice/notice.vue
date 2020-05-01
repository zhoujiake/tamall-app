<template>
	<view class="content">
		<view
			v-for="(item, index) in conversations" :key="index"
			class="conversations-item" @click="toRoom(item)">
			<image class="avatar-img" src="/static/app-icon.png" mode="aspectFill"></image>
			<view class="conversations-conten">
				<text class="nickname">{{item.nickName}}</text>
				<text class="date">{{parsingDate(item.mtime)}}</text>
				<text class="unread" v-show="item.extras.unreadCount > 0">{{item.extras.unreadCount}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex';  
		export default {
			data() {
				return {
				};
			},
			onReady() {
			},
			onLoad() {
				uni.setNavigationBarTitle({
					title: this.lang.notice
				})
			},
			onShow() {
				if (this.JIM.isLogin()) {
					this.updateConversation()
				}
			},
			onBackPress() {
			},
			computed: {
				...mapState([
					'lang',
					'userInfo',
					'jimUserName',
					'jimNickName',
					'conversations',
					'JIM'])
			},
			methods: {
				...mapMutations(['login','updateConversation','getJPushData']),
				parsingDate(timeLong) {
					return this.$formatDate.timestampToTime(timeLong);
				},
				toRoom(item) {
					try{
						this.JIM.resetUnreadCount({'username' : this.jimUserName}); // 该用户的消息未读数设置为空
						this.JIM.updateConversation({
						 'username' : this.jimUserName,
						 'extras' : {'unreadCount' : 0}
						});
						uni.navigateTo({ // 进入聊天界面
							url:`/pages/chat/chat?username=${this.jimUserName}&avatar=${''}&nickName=${this.jimNickName}`
						})
					}catch(e){
						this.getJPushData()
					}
				}
			}
		}
</script>

<style lang="scss">
	.content {
		width: 100%;
		height: 100%;
		
		.conversations-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			height: 160upx;
			background-color: #F1F1F1;
			margin-top: 8upx;
			
			.avatar-img {
				margin-left: 10upx;
				margin-right: 10upx;
				width: 140upx;
				height: 120upx;
				background-color: #FFFFFF;
				border-radius: 10upx;
				padding: 8upx;
			}
			
			.conversations-conten {
				height: 160upx;
				width: 100%;
				margin-left: 10upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				
				.nickname {
					font-size: 18px;
				}
				.date {
					font-size: 12px;
					color: #808080;
				}
				.unread {
					width: 50upx;
					height: 30upx;
					font-size: 10px;
					background-color: #ff0000;
					border-radius: 30%;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
	}
</style>
