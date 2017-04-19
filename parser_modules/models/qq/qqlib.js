var _ = require('underscore');
var request = require('request'),
	HtmlExtractUtil = require('../../../utils/HtmlExtractUtil');

var sdtfrom = "v5010";

/**
*@param[e] 视频json数据
*@param[e]  {
*        fmt: 'auto',
*       vid: qqVid
*  }
*/
var A = function(e, n) {
	var l = e.vl.vi[0];
	if (l.fvkey) return m = g({
		path: l.ul.ui[0].url,
		fn: l.fn,
		vkey: l.fvkey,
		br: l.br,
		platform: 2,
		fmt: n.fmt,
		level: l.level,
		sdtfrom: sdtfrom,
		sha: l.fsha,
		vid: n.vid,
		alias: l.alias
	})
}


function g(a) {
	var a = a || {};
	var d, e = !1;
	var l = "";
	return a.alias && "string" == typeof a.fn && a.vid && (a.fn = a.fn.replace(a.vid, a.alias), e = !0), l && "string" == typeof a.path && (a.path = a.path.replace(/\/\/(.+?)(\/|#|$|\?)/, function() {
		return arguments.length > 1 ? arguments[0].replace(arguments[1], l) : arguments[0]
	})), d = a.path.indexOf("?") > -1 ? a.path + "&" + a.fn + "&vkey=" + a.vkey + "&br=" + a.br + "&platform=2&fmt=" + a.fmt + "&level=" + a.level + "&sdtfrom=" + sdtfrom : a.path + a.fn + "?vkey=" + a.vkey + "&br=" + a.br + "&platform=2&fmt=" + a.fmt + "&level=" + a.level + "&sdtfrom=" + sdtfrom, _.isString(a.sha) && a.sha.length > 0 && (d += "&sha=" + a.sha), e && (d += "&vidalias=1"), d
}

var u = "http://h5vv.video.qq.com/getinfo?&";

/**
*pageObj = {
*        ehost:ehost,
*        vid:qqVid 
* };
*return 视频信息api
*/
function getApiUrl(pageObj) {
	var n = {
		platform: 11001,
		isPay: 0,
	};

	var r = {
		platform: n.platform,
		charge: n.isPay ? 1 : 0,
		otype: "json",
		sphls: 0,
		sb: 1,
		nocache: 0,
		ehost: pageObj.ehost,
		_rnd: (new Date).valueOf(),
		vids:pageObj.vid
	}
	return u + param(r)+"&callback=tvp_request_getinfo_callback_"+ parseInt(1e6 * Math.random());
}

var C = encodeURIComponent;
var param = function(e) {
	var i = [];
	for(var key in e){
		i.push(C(key) + "=" + C(e[key]))
	}
	return i.join("&").replace(/%20/g, "+");
}


var fetchApi = function(apiUrl, vid, global_, callback, myCallback){
	var option = {
		url : apiUrl,
		timeout : 5000
	}
    var n = {
        fmt: 'auto',
        vid: vid
    };

	request (option, function(err, res, body){
		if(err || res.statusCode != 200){
			callback('SERVER_ERROR');
			return ;
		}
		try{
			var endStr = "",
                appendStr = "";
            if(body.indexOf('}})') > -1){
                endStr = "}})";
                appendStr = "}}"
            }else {
                endStr = "})";
                appendStr = "}";
            }
            var jsonStr = HtmlExtractUtil.extractCode(body,'(',endStr,false,false)+appendStr;
            var json = JSON.parse(jsonStr);
            var videoUrl = A(json, n);
           	if(videoUrl.indexOf('.mp4') > -1){
           		global_.formate = 'mp4';
           	}else if (videoUrl.indexOf('m3u8') > -1){
           		global_.formate = 'm3u8';
           	}
            var videoInfo = json.vl.vi[0];
            var title = videoInfo.ti;
            var posterUrl = "http://shp.qpic.cn/qqvideo_ori/0/" + vid + "_496_280/0";
            var result = {
            	mediaUrls : [{src : videoUrl}],
            	poster : [{src : posterUrl}],
            	title : title,
            	g : global_
            }
            myCallback(result);
		}catch(e){
			callback('PARSE_ERROR', 'json error');
			return ;
		}
	})
}
var getVideoById = function(g, myCallback){
	var apiUrl = getApiUrl({ehost:'http://v.qq.com', vid:g.vid});
	var callback = g.callback;
	fetchApi(apiUrl, g.vid, g, callback, myCallback);
}
/*
g = {
	vid,
	title,
	resource,
	callback
}
返回数据：
result = {
	mediaUrls : [],
	poster : [],
	title : string,
	g : g//传入的参数
}
*/

exports.getUrl = A;
exports.getApiUrl = getApiUrl;
exports.getVideoById = getVideoById;