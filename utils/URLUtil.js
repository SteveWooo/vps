var _url = require('url');
/*
 * 从URL(http://www.....mp4?....)中提取format
 */
function extractUrlFormat(url , defaultFormat) {
	var matchs = url.match(/\.(mp4|m3u8|flv|3gp)\??/)
	if(matchs){
		return matchs[1];
	}
	return defaultFormat || null;
}

function extractDomain(url){
	return _url.parse(url).hostname
}

exports.extractUrlFormat = extractUrlFormat;
exports.extractDomain = extractDomain;