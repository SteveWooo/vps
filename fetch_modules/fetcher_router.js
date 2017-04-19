var _110ff = require('./models/110ff/fetcher');

let fetcher = (options, callback)=>{
	var domain = options.domain;

	if(domain.indexOf('110ff.com') > -1){
		_110ff.fetch(options, callback);
	}else {
		callback('NO_SUPPORT_DOMAIN');
	}
}

exports.fetcher = fetcher;