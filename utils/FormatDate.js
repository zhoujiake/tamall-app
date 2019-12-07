/**
 * 封装日期函数
 * @param d
 * @returns {string}
 */

const formatDate = {
	dateFormat : function(date) {
			      var time = new Date(Date.parse(this.myTime(date)));
			        time.setTime(time.setHours(time.getHours() + 8));
			        var Y = time.getFullYear() + '-';
			        var  M = this.addZero(time.getMonth() + 1) + '-';
			        var D = this.addZero(time.getDate()) + ' ';
			        var h = this.addZero(time.getHours()) + ':';
			        var m = this.addZero(time.getMinutes()) + ':';
			        var  s = this.addZero(time.getSeconds());
			        return Y + M + D + h + m + s;
	},
	myTime: function(date) {
		   var arr=date.split("T");
		   var d=arr[0];
		   var darr = d.split('-');
	
		   var t=arr[1];
		   var tarr = t.split('.000');
		   var marr = tarr[0].split(':');
	
		   var dd = parseInt(darr[0])+"/"+parseInt(darr[1])+"/"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
		 return dd;
	},
	// 数字补0操作
	addZero: function(num) {
		    return num < 10 ? '0' + num : num;
	}
}

export default formatDate