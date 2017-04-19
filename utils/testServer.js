/**
*二次解析测试客户端模拟
*
*/

var express = require('express'),
	request = require('request');

var app = express();


var UA = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36";
var androidUA = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36';

var arguments = process.argv.splice(2);
var pageUrl = arguments[0];
pageUrl="http://localhost:5000/video/video_url?page_url=http://m.toutiao.com/i6273635366641598977/"
//从服务端获取要解析的url
function handleGetUrl() {
	
	var options = {
        "method": "GET",
        "url" : pageUrl,
        "timeout":10000,
        "headers": {
            "User-Agent": UA
        }
    };

    request(options, function(err, res, body) {
    	if(err || res.statusCode != 200) {
    		console.log('30SERVER_ERROR');
    		return;
    	}
    	var gJson = JSON.parse(body).pageInfoList;
    	handleGetHtml(gJson)
    })
}

//获取静态页面
function handleGetHtml(data) {
	var url = data[0].url;

	var options = {
        "method": "GET",
        "url" : url,
        "timeout":10000,
        "gzip" : true,
        "headers": {
            "User-Agent": UA,
            "Referer":url
        }
    };

    request(options, function(err, res, body) {
    	if(err || res.statusCode != 200) {
    		console.log('55SERVER_ERROR', err);
    		return;
    	}
    	data[0]["content"] = new Buffer(body).toString('base64');
    	handlePost(data)
    })
}

//把数据传给服务端
function handlePost(data) {
	var data = {
        "pageInfoList": JSON.stringify(data)
    };

	var options = {
        "method": "POST",
        "url" : pageUrl,
        "timeout":12000,
        "json": true,  //注意一定要加
        "body": data,
        "headers": {
            "User-Agent": UA
        }
    };
    //request.post(pageUrl, {form:{body: data}},function (error, response, body) {if (!error && response.statusCode == 200) {console.log(body)}})


    request(options, function(err, res, json) {
    	if(err || res.statusCode != 200) {
    		console.log('84SERVER_ERROR', err)
            return;
    	}
        
        var gJson = json.pageInfoList;
        getPosterHtml(gJson);
        return;
    });
}

//获取封面静态页面
function getPosterHtml(data) {
    var resUA = data[0].headers[0].value;
    var resUrl = data[0].url;
    var options = {
        "method": "GET",
        "url" : resUrl,
        "timeout":10000,
        "headers": {
            "User-Agent": resUA
        }
    };
    console.log(options)
    //获取封面静态页面
    request(options, function(err, res, body) {
        if(err || res.statusCode != 200) {
            console.log('101SERVER_ERROR', err)
            return;
        }
        // var data = [{id: 'toutiao_page1',url: 'http://m.toutiao.com/i6273635366641598977/info/'}];

        data[0]["content"] = new Buffer(body).toString('base64');
        //console.log(data)
        handlePosterPost(data);
        return;
    })
}

//把数据返回到客户端
function handlePosterPost(data) {

    var data = {
        "pageInfoList": JSON.stringify(data)
    };

    var options = {
        "method": "POST",
        "url" : pageUrl, //pageUrl
        "timeout":12000, 
        "json": true,  //注意一定要加
        "body": data,
        "headers": {
            "User-Agent": UA
        }
    };
    //request.post(pageUrl, {form:{body: data}},function (error, response, body) {if (!error && response.statusCode == 200) {console.log(body)}})


    request(options, function(err, res, json) {
        if(err || res.statusCode != 200) {
            console.log('143SERVER_ERROR', err)
            return;
        }
        var gJson = json.pageInfoList;
       getUrlData(gJson);
        return;
    });
}

function getUrlData(data) {console.log(1+data)
    var resUA = data[0].headers[0].value;
    var resUrl = data[0].url;
    var options = {
        "method": "GET",
        "url" : resUrl,
        "timeout":10000,
        "headers": {
            "User-Agent": resUA
        }
    };
    //console.log(options)
    
    request(options, function(err, res, body) {
        if(err || res.statusCode != 200) {
            console.log('171SERVER_ERROR', err)
            return;
        }
        // var data = [{id: 'toutiao_page1',url: 'http://m.toutiao.com/i6273635366641598977/info/'}];
        data[0]["content"] = new Buffer(body).toString('base64');
        postUrlData(data)
        return;
    })
}

function postUrlData(data) {
    var data = {
        "pageInfoList": JSON.stringify(data)
    };

    var options = {
        "method": "POST",
        "url" : pageUrl, //pageUrl
        "timeout":12000, 
        "json": true,  //注意一定要加
        "body": data,
        "headers": {
            "User-Agent": UA
        }
    };
    //request.post(pageUrl, {form:{body: data}},function (error, response, body) {if (!error && response.statusCode == 200) {console.log(body)}})


    request(options, function(err, res, json) {
        if(err || res.statusCode != 200) {
            console.log('143SERVER_ERROR', err)
            return;
        }
        console.log(JSON.stringify(json))
        
        return;
    });
}
//getPoster()
//handlePost("jch")
handleGetUrl()
// app.listen(3000);
// console.log('client is listening on port 3000')