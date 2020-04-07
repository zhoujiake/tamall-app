import Vue from 'vue'
import Vuex from 'vuex'

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

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		lang : lang,
		deviceInfo: ''
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			})
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
					uni
				}
			})
		},
		setDeviceInfo(state, info){
			state.deviceInfo = info
		}
	},
	actions: {
	    
	}
})

export default store
