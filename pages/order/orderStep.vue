<template>
	<view class="container">
		<ali :state="orderTracesData.State" :datas="orderTracesData.Traces" 
				:ways="orderTracesData.ShipperCode" :userAddress="userAddress"></ali>
	</view>
</template>

<script>
import ali from '@/components/WuLiu-step.vue';
export default {
	components: {
		ali
	},
	data() {
		return {
				orderTracesData: {
					State: 0,
					ShipperCode: '',
					Reason: '',
					Traces: [],
				},
				candidates: {
					ZTO:'中通快递',
					STO:'申通快递',
					YTO:'圆通速递',
					YD:'韵达速递',
					YZPY:'邮政快递包裹',
					EMS:'EMS',
					HHTT:'天天快递',
					JD:'京东快递',
					UC:'优速快递',
					DBL:'德邦快递',
					ZJS:'宅急送',
					SF:'顺丰速运'
				},
				formdata : {
					orderId : 0,
				},
				userAddress : ""
		};
	},
	async onLoad(options) {
		let orderId = options.orderId;
		this.formdata.orderId = orderId; 
		let userAddress = options.userAddress;
		this.userAddress = userAddress; 
		this.orderStaces()
	},
	methods: {
		orderStaces() {
			uni.request({
			    url: this.$baseUrl + "admin/orders/orderTraces", //仅为示例，并非真实接口地址。
				data: this.formdata,
			    header: {
					  'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				},
				method: "POST",
			    success: (res) => {
					 if (res.data.resultCode == 200) {
						 this.orderTracesData =  JSON.parse(res.data.message);
						 const compare = (key) => {
						   return (obj1, obj2) => {
						     let value1 = obj1[key]
						     let value2 = obj2[key]
						     if (value1 < value2) {
						       return 1;
						     } else if (value1 > value2) {
						       return -1;
						     } else {
						       return 0
						     }
						   }
						 }
						 // 按时间降序
						 this.orderTracesData.Traces.sort(compare(`AcceptTime`))
						 debugger
					 } else {
					 	// this.$api.msg(res.data.message);
					 }
			    }
			});
		}
	}
};
</script>

<style lang="scss">
	page {
			background-color: #f7f7f7;
			padding-bottom: 30upx;
		}
</style>

