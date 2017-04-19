var request = require('request'),
    xml2js = require('xml2js'),
    URLUtil = require("./URLUtil"),
    iconv = require('iconv-lite'),
    Video = require('../model/Video'),
    VideoFile = require('../model/VideoFile'),
    VideoFileFragment = require('../model/VideoFileFragment'),
    default_format = "normal",
    default_os = "android",
    conf = require('../server/conf');

/**
 * option : {url : 解析的URL ， format : "normal" or "hight" or "super" , os : "android" or "ios"}
 **/
function parse(option , video , callback){
    if(option && option.url){
        var format = option.format ? option.format : default_format;
        var os = option.os ? option.os : default_os;
        var flvcdUrl = conf.flvcdUrl || 'http://vprome-shct.5233game.com/api/tongmo.php';
        request(flvcdUrl+"?url="+ encodeURIComponent(option.url) +"&os="+ default_os +"&format="+ format).pipe(iconv.decodeStream('GBK')).pipe(iconv.encodeStream('UTF-8').collect(function (error,html) {
            if (!error) {
                var xml = html.toString();
                var xmlParser = new xml2js.Parser();
                xmlParser.parseString(xml, function (err, result) {
                    if(!err){
                        if(result.R.V && result.R.V.length){
                            if(!video){
                                video = Video.create({
                                        pageUrl: option.url,
                                        playUrl: '',
                                        source: result.R.$.source,
                                        duration: 0,
                                        title: result.R.title[0]
                                    });
                            }
                            for(var i = 0 ; i < result.R.V.length ; i ++){
                                var v = result.R.V[i];
                                var videoFile = video.addFile({
                                            format: URLUtil.extractUrlFormat(v.U[0]),
                                            multipart: false,
                                            resolutionCode: format,
                                            fileSize: 0
                                        });
                                videoFile.addFragment({
                                    index: i,
                                    url: v.U[0],
                                    fileSize: 0,
                                    duration: 0
                                });
                            }
                            callback(video);
                            return;
                        }else{
                            callback("PARSE_ERROR");
                            return;
                        }
                    }else{
                        callback("PARSE_ERROR");
                        return;
                    }
                });
            }else{
                callback("PARSE_ERROR");
                return;
            }
        }));
    }else{
        callback("PARSE_ERROR");
        return;
    }
}

exports.parse = parse;