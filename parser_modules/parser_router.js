var _110ff = require('./models/110ff/parser');

let parser = (options, callback)=>{
	var pageUrl = options.pageUrl;

	if(pageUrl.indexOf('110ff.com') > -1){
		_110ff.parse(options, callback);
	}else {
		callback('NO_SUPPORT_URL');
	}
}

exports.parser = parser;