
const commonUtil = {
	switchLanguageForString : function(str, index) {
		debugger
		if(str.indexOf("|") === -1) {
			return str
		} else {
			var arr = str.split('|');
			return arr[index];
		}
	}
}

export default commonUtil