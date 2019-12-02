/* 
const common = {
	login: function () {...mapMutations(['login'])},
	commonLogin: function(userInfo) {
		debugger
				// 第三方用户登录
				uni.request({
					url: this.$baseUrl + "loginForAppOfOtherPlatform", //仅为示例，并非真实接口地址。
					data: userInfo,
					header: {
						  'content-type': 'application/json' //自定义请求头信息
					  },
					method: "POST",
					success: (res) => {
						debugger
						if (res.data.resultCode == 200) {
							this.login(userInfo);
						} else {
						}
					}
				});
		}
}
 */
import {mapMutations} from 'vuex'

export default {
  methods: {
  }
}

/* export default common */