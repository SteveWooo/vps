var async = require('async'),
    request = require('request');
    HtmlExtractUtil = require('../../../utils/HtmlExtractUtil'),
    QQLib = require('./qqlib');

var UA = "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19";


//提取视频id
function extractId(pageUrl) {
    //cover/后面必须有2串加密字符串，最后一串才是真正的VID。如果没有，vid在正文。
	var result = /vid=(\w+)/i.exec(pageUrl);
	if(!result) {
		result = /\/(\w+)\.html/.exec(pageUrl);
	}
    //vid 不能出现 '_0'：
    if( result[1].indexOf('_0') > -1){
        result[1] = result[1].substring(0,result[1].indexOf('_0'));
    }
    
    return result[1];
}

/**
* 从url提取视频id，然后通过QQLib.getApiUrl获取视频信息
* https://v.qq.com/x/cover/jzmbeitvo9jyi74/h0022wh5c39.html
* https://m.v.qq.com/cover/u/upc9wogilbw38cp.html?ptag=v_qq_com%23v.play.adaptor%233&vid=h0022f0f4ul
* https://v.qq.com/x/page/j0347akjoqh.html?ref_vid=m0326gn0kkk
* https://v.qq.com/x/cover/1s7cgqm19znxmao.html?vid=w0022ojj6u9
*/
function parse(reqOptions, callback) {
    var pageUrl = reqOptions.pageUrl;
    //换种方式获取vid,从页面中抓取
    // var vid = extractId(pageUrl);
    request(reqOptions.pageUrl, function(err, res, body){
        var urlDebris = reqOptions.pageUrl.split('/');
        var vid;
        
/*  这里提取到的是相关视频的 vid ！
        if(urlDebris.length <= 6){
            vid = HtmlExtractUtil.extractCode(body,'var LIST_INFO = {"vid":["','"');
            if(!vid){
                vid = HtmlExtractUtil.extractCode(body, 'vid: "','",');
            }
        }else {
            vid = extractId(reqOptions.pageUrl);
        }
*/        
        vid = extractId(reqOptions.pageUrl);
        if (!vid) {
            callback('PARSE_ERROR','Vid not found');
            return ;
        }

        try{
            var qqVid = vid;
            if(!qqVid){
                callback('PARSE_ERROR','id not found');
                return;
            }
            var n = {
                fmt: 'auto',
                vid: qqVid
            };
            var ehost = "http://v.qq.com";
            var pageObj = {
                ehost:ehost,
                vid:qqVid
            };
            var poster = "http://shp.qpic.cn/qqvideo_ori/0/" + qqVid + "_496_280/0";
            //请求api
            var apiUrl = QQLib.getApiUrl(pageObj);

            var options = {
                "method": "GET",
                "url" : apiUrl,
                "headers": {
                    "User-Agent": UA
                },
                "timeout" : 10000
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
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
                        var videoUrl = QQLib.getUrl(json,n);
                        var videoInfo = json.vl.vi[0];
                        var video = {
                            pageUrl : pageUrl,
                            source : 'qq.com',
                            video : [{
                                src : videoUrl
                            }],
                            poster : [{
                                src : poster
                            }]
                        }

                        callback(video);
                    }catch(e){
                        callback("PARSE_ERROR","get json api fault");
                        return;
                    }
                }else{
                    callback("SERVER_ERROR",""+error);
                    return;
                }
            });
        }catch(e){
            callback("PARSE_ERROR");
            return;
        }

    })

    


}

exports.parse = parse;