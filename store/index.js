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
		// userLang = sys.language;
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
				itemList:['藏文','简体中文', 'English'],
				success: function(e) {
					if(e.tapIndex == 0) {
						lang = require('../language/tb.js');
					} else if (e.tapIndex == 1) {
						lang = require('../language/zh.js');
					} else {
						lang = require('../language/en.js');
					}
					state.lang = lang;
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
