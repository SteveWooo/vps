let express = require('express'),
	app = express(),
	parser = require('../parser_modules/parser_router').parser,
	fetcher = require('../fetch_modules/fetcher_router').fetcher,
	writer = require('../ums/writer').writer;

app.use('/vps', (req, res)=>{
	let pageUrl = req.query.page_url,
		options = {
			pageUrl : pageUrl
		}
	parser(options, (data)=>{
		let result = {};
		if(typeof data === "string"){
			result.error = {
				errorCode : data
			};
		}else {
			result.data = data;
		}

		res.send(result);
	})
})

app.use('/fetch', (req, res)=>{
	let options = {
		domain : req.query.domain
	}
	fetcher(options, (data)=>{
		let result = {};
		if(typeof data === "string"){
			result.error = {
				errorCode : data
			};
			res.send(result);
		}else {
			writer(data);
			result.data = "writing";
			res.send(result);
		}
		
	})
})

app.listen(5000, ()=>{
	console.log('process was started at 5000')
})