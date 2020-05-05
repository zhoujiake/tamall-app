import Vue from 'vue'
import Vuex from 'vuex'
import jimSdk from '@/lib/jmessage-wxapplet-sdk-1.4.2.min.js'// 引入JMessage

Vue.use(Vuex)

// 国际化相关代码
try {
	// 1. 分析用户已经选择的语言 
	var userLang = uni.getStorageSync("userLang");
	// 2. 如果用户没有选择过获取用户手机的语言
	if(!userLang) {
		const sys = uni.getSystemInfoSync();
		//userLang = sys.language;
		userLang = "tb"; // 默认显示藏文
		//userLang = "en"; // 默认显示藏文
	}
	console.log(userLang);
	// 以中英文切换为例, 其他语言请使用 getSystemInfoSync 获取语言对应的字符串
	// 然后扩展语言包即可
	if(userLang.substring(0,2) == 'zh') {
		var lang = require('../language/zh.js');
	}else if(userLang.substring(0,2) == 'tb') {
		var lang = require('../language/tb.js');
	}else{
		var lang = require('../language/en.js');
	}
} catch (e) {
    // error
}

// 初始化JMI
const store = new Vuex.Store({
	state: {
		hasLogin: false,
		authPayload: {},
		userInfo: {},
		lang : lang,
		deviceInfo: '',
	    JIM : new jimSdk(),
		conversations: [],
		//播放语音相关参数
		AUDIO : uni.createInnerAudioContext(),
		vue : Vue,
		jimUserName : 'nhkj-manager',
		jimNickName : 'ཨ་ཁྲོམ།',
		chatVueObject : null
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			});
		},
		setUserInfo(state, userInfo){
			state.userInfo = userInfo;
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
                key: 'userInfo'  
            })
			// JIM登出
			state.JIM.loginOut();
		},
		changeLang: function(state) {
			uni.showActionSheet({
				itemList:['བོད་ཡིག','简体中文'],
				success: function(e) {
					var langStr = ""
					if(e.tapIndex == 0) {
						lang = require('../language/tb.js');
						langStr = "tb"
					} else if (e.tapIndex == 1) {
						lang = require('../language/zh.js');
						langStr = "zh"
					} else {
						lang = require('../language/en.js');
						langStr = "en"
					}
					//缓存用户登陆状态
					uni.setStorage({
					    key: 'userLang',  
					    data: langStr  
					})
					// 改变资源js
					state.lang = lang;
					// 底部导航栏语言切换
					var home = state.lang.homePage
					var goodsType = state.lang.goodsType
					var cart = state.lang.cart
					var mine = state.lang.mine
					setTimeout(function() {
						// 重新设置tabbar的文字资源
						uni.setTabBarItem({ // 首页
						  index: 0,
						  text: state.lang.homePage,
						  iconPath: 'static/ic_home0.png',
						  selectedIconPath: 'static/ic_home1.png'
						})
						uni.setTabBarItem({ // 分类
						  index: 1,
						  text: goodsType,
						  iconPath: 'static/ic_category0.png',
						  selectedIconPath: 'static/ic_category1.png'
						})
						uni.setTabBarItem({ // 购物车
						  index: 2,
						  text: cart,
						  iconPath: 'static/ic_carte0.png',
						  selectedIconPath: 'static/ic_carte1.png'
						})
						uni.setTabBarItem({ // 我的
						  index: 3,
						  text: mine,
						  iconPath: 'static/ic_mine0.png',
						  selectedIconPath: 'static/ic_mine1.png'
						})
					},500)
				}
			})
		},
		setDeviceInfo(state, info){
			state.deviceInfo = info
		},
		// jpush的相关信息
		getJPushData(state) {
			/* state.JIM = null
			state.JIM = new jimSdk() */
			// 判断是否初始化
			if (!state.JIM.isInit()) {
				uni.request({
					url: state.vue.prototype.$baseUrl + "jpush-app-Kay", // 调用后台接口，获取初始化相关信息。
					method: "GET",
					success: (res) => {
						if (res.data.resultCode == 200) {
							state.authPayload = JSON.parse(res.data.message);
							// 初始化state.JIM
							state.JIM.init(state.authPayload)
						    .onSuccess(data => {
								this.commit('JMIlogin')
								console.log("JIM init --> "+data)
							}).onFail(function(data) {
								console.log("JIM init --> onFail "+data)
							});
						} else {
						}
					}
				});
			} else {
				this.commit('JMIlogin')
			}
		},
		// JMI注册
		JMIregister(state) {
			state.JIM.register({
					'username' : state.userInfo.loginName,
					'password' : "123456",
					'nickname' : state.userInfo.nickName
				}).onSuccess(data => {
					this.commit('JMIlogin')
					console.log('success:' + JSON.stringify(data));
			    }).onFail(function(data) {
					console.log('error:' + JSON.stringify(data));
			});
		},
		// JMI登录
		JMIlogin(state) {
			uni.setStorageSync(state.userInfo.loginName, '[]')
			state.JIM.login({
			            'username' : state.userInfo.loginName,
						'password' : "123456" // 默认密码
			        }).onSuccess(data => {
						console.log('JIM login success');
						// uni.setStorageSync(state.jimUserName, '')
						// 获取会话记录
						this.commit('updateConversation')
					    state.JIM.onMsgReceive(data => {// 监听消息接收
							for (let i = 0; i < data.messages.length; i++) {
								if (data.messages[i].content.msg_type === 'image') {
									state.JIM.getResource({
									  'media_id' : data.messages[i].content.msg_body.media_id
									}).onSuccess( data2 => {
										// 下载文件
										uni.downloadFile({
										  url: data2.url, //仅为示例，并非真实的资源
										  success: res => {
											  if (res.statusCode === 200) {
												uni.saveFile({
													tempFilePath: res.tempFilePath,
													success: (res) => {
														data.messages[i].content.msg_body.media_id = res.savedFilePath
														var records = uni.getStorageSync(data.messages[i].from_username)
														if (records) { // 如果有这个买家的消息记录，则执行。
															records.push(data.messages[i])
															// 原保存回去
															uni.setStorageSync(data.messages[i].from_username, records)
														} else {
															let newRecord = []
															newRecord.push(data.messages[i])
															// 保存
															uni.setStorageSync(data.messages[i].from_username, newRecord)
														}
														if (state.chatVueObject) { // 正在聊天界面时不执行未读数添加和向铃声代码
															state.chatVueObject.screenMsg(data.messages[i])
														} else {
															state.conversations.forEach( item => {
																 if (item.username === data.messages[i].from_username) {
																	 let c = item.unread_msg_count + 1
																	 state.JIM.updateConversation({
																	 	 'username' : data.messages[i].from_username,
																	 	 'extras' : {'unreadCount': c}
																	 	});
																 }
															})
															setTimeout(() => {
																// 更新会话记录
																this.commit('updateConversation')
																// 播放提示音
																this.commit('playVoice')
															},2000)
														}
													}
												  });
											  }
										  }
										});
									}).onFail(function(data) {
									  data.code // 返回码
									  //data.message 描述
									});
								} else {
									var records = uni.getStorageSync(data.messages[i].from_username)
									if (records) { // 如果有这个买家的消息记录，则执行。
										records.push(data.messages[i])
										// 原保存回去
										uni.setStorageSync(data.messages[i].from_username, records)
									} else {
										let newRecord = []
										data.messages.forEach((item) => {
											newRecord.push(item)
										})
										// 保存
										uni.setStorageSync(data.messages[i].from_username, newRecord)
									}
									if (state.chatVueObject) { // 正在聊天界面时不执行未读数添加和向铃声代码
										state.chatVueObject.screenMsg(data.messages[i])
									} else {
										state.conversations.forEach( item => {
											 if (item.username === data.messages[i].from_username) {
												 let c = item.unread_msg_count + 1
												 state.JIM.updateConversation({
												 	 'username' : data.messages[i].from_username,
												 	 'extras' : {'unreadCount': c}
												 	});
											 }
										})
										setTimeout(() => {
											// 更新会话记录
											this.commit('updateConversation')
											// 播放提示音
											this.commit('playVoice')
										},2000)
									}
								}
							}
					    });
			            state.JIM.onEventNotification(function(data) {
			                console.log('event_receive: ' + JSON.stringify(data));
			            });
						
						state.JIM.onSyncConversation(function(data) { //离线消息同步监听
							try {
								// 首先判断该聊天记录是否被保存过
								for (let i = 0; i < data.length; i++) {
									var records = uni.getStorageSync(data[i].from_username)
									if (records) { // 如果有这个买家的消息记录，则执行。
										// 获取已有的消息记录
										data[i].msgs.forEach((item) => {
											let flag = false
											let length = records.length
											for (let i = 0; i < length; i++) {
												// 如果有重复的消息，则替换数据并跳出改for循环
												if (records[i].msg_id === item.msg_id) {
													flag = true
												}
											}
											debugger
											// 如果没有重复的则执行添加操作 （不包括当前用户的）
											if (!flag & item.content.from_id !== state.userInfo.loginName) {
												// 图片类型
												if (item.content.msg_type === "image") {
														state.JIM.getResource({
														  'media_id' : item.content.msg_body.media_id
														}).onSuccess(data2 => {
															// 下载文件
															uni.downloadFile({
															  url: data2.url, //仅为示例，并非真实的资源
															  success: res => {
																  if (res.statusCode === 200) {
																	uni.saveFile({
																		tempFilePath: res.tempFilePath,
																		success: (res) => {
																			item.content.msg_body.media_id = res.savedFilePath
																			var records = uni.getStorageSync(data[i].from_username)
																			if (records) { // 如果有这个买家的消息记录，则执行。
																				records.push(item)
																				// 原保存回去
																				uni.setStorageSync(data[i].from_username, records)
																			} else {
																				let newRecord = []
																					newRecord.push(item)
																				// 保存
																				uni.setStorageSync(data[i].from_username, newRecord)
																			}
																			state.conversations.forEach( item => {
																				 if (item.username === data[i].from_username) {
																					 let c = item.unread_msg_count + 1
																					 state.JIM.updateConversation({
																						 'username' : data[i].from_username,
																						 'extras' : {'unreadCount': c}
																						});
																				 }
																			})
																			setTimeout(() => {
																				// 更新会话记录
																				this.commit('updateConversation')
																			},2000)
																	}
																	  });
																  }
															  }
															});
														}).onFail(function(data) {
														  data.code // 返回码
														  //data.message 描述
														});
												} else {
													records.push(item)
												}
											}
										})
										// 原保存回去
										uni.setStorageSync(data[i].from_username, records)
									} else {
										var newRecord = []
										data[i].msgs.forEach((item) => {
											newRecord.push(item)
										})
										uni.setStorageSync(data[i].from_username, newRecord)
									}
									// 重置当前消息的未读数到extras中（自定义）
									state.JIM.getConversation().onSuccess(data2 => {
										data2.conversations.forEach( item => {
											if (item.username === data[i].from_username) {
												 let c = item.unread_msg_count + 1
												 state.JIM.updateConversation({
													 'username' : data[i].from_username,
													 'extras' : {'unreadCount': c}
												 });
											}
										})
									}).onFail(function(data) {
									})
								}
							} catch (e) {
								console.log("聊天记录处理异常")
							}
						});
			           state.JIM.onUserInfUpdate(function(data) {
			                console.log('onUserInfUpdate : ' + JSON.stringify(data));
			            });
				 
				        state.JIM.onSyncEvent(function(data) {
			                console.log('onSyncEvent : ' + JSON.stringify(data));
			            });
						
						state.JIM.onMsgReceiptChange(function(data){
						    console.log('onMsgReceiptChange : ' + JSON.stringify(data));
						});
						
						state.JIM.onSyncMsgReceipt(function(data){
						    console.log('onSyncMsgReceipt : ' + JSON.stringify(data));
						});
						
						state.JIM.onMutiUnreadMsgUpdate(function(data){
						    console.log('onConversationUpdate : ' + JSON.stringify(data));
						});
						
					    state.JIM.onTransMsgRec(function(data){
						    console.log('onTransMsgRec : ' + JSON.stringify(data));
						});
						
						state.JIM.onRoomMsg (function(data){
						    console.log('onRoomMsg  : ' + JSON.stringify(data));
						});
			        }).onFail(data => {
						this.commit('JMIregister')
			            console.log('error:' + JSON.stringify(data));
			            console.log('timeout:' + JSON.stringify(data));
			        });
		},
		// 未读数更新
		updateConversation(state) {
			state.JIM.getConversation().onSuccess(data => {
				  state.conversations = []
				  data.conversations.forEach(item=>{ // 会话列表，属性如下示例
					if (state.jimUserName === item.username) { // 处理卖家的会话记录以为，其他都过滤
					  // 单聊会话, 调用则成功，无回调函数
						  state.JIM.updateConversation({
							 'username' : item.username,
							 'extras' : {'unreadCount':item.unread_msg_count}
							});
						state.conversations.push(item);
					}
				  })
			 }).onFail(function(data) {
		     })
		},
		// 播放语音
		playVoice(state){
			state.AUDIO.src = '/static/voice/838412.mp3';
			state.AUDIO.play();
		},
		setChatVueObject(state, object) {
			state.chatVueObject = object
		}
	},
	actions: {
	    
	}
})

export default store
