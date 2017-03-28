let request = require('request');

let g = {};
let UA = "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36";

let fetchMain = (callback)=>{
	let option = {
		url : g.pageUrl,
		headers : {
			'User-Agent' : UA
		},
		timeout : 5000
	}

	request(option, (err, res, body)=>{
		if(err || res.statusCode !== 200){
			callback('SERVER_ERROR');
			return ;
		}

		let temp = body.substring(body.indexOf('flashvars={'));
		let videoUrl = temp.substring(temp.indexOf("f:'") + 3, temp.indexOf("',"));

		let posterTemp = temp.substring(temp.indexOf("i:'") + 3)
		let poster = posterTemp.substring(0, posterTemp.indexOf("',"));

		let title = body.substring(body.indexOf('<title>' + 7), body.indexOf('</title>'))

		var video = {
			pageUrl : g.pageUrl,
			source : g.source,
			video : [{
				src : videoUrl
			}],
			poster : [{
				src : poster
			}]
		}

		callback(video);
		return ;
	})
}

let parse = (options, callback)=>{
	g.pageUrl = options.pageUrl;
	g.source = "110ff.com";
	fetchMain(callback);
}

exports.parse = parse;