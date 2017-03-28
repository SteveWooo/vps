let express = require('express'),
	app = express(),
	parser = require('../parser_modules/parser_router').parser;

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

app.listen(5000, ()=>{
	console.log('process was started at 5000')
})