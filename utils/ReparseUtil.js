function base64Encode(str) {
	return new Buffer(str).toString('base64');
}

function base64Decode(str) {
	return new Buffer(str, 'base64').toString();
}

function getPage(reqOptions, id) {
	if (!reqOptions || !reqOptions.pageInfoList) {
		return;
	}
	if (!reqOptions.pageInfoListDecoded) {
		var pageInfoListDecoded = {};
		var json = JSON.parse(reqOptions.pageInfoList);
		for (var i = 0; i < json.length; i++) {
			var pageInfo = json[i];
			if (pageInfo.content) {
				pageInfo.content = base64Decode(pageInfo.content);
				pageInfoListDecoded[pageInfo.id] = pageInfo;
			} else {
				var error = "contnet_empty";
				if (pageInfo.erroMsg) {
					error = pageInfo.erroMsg;
				}
				throw error;
			}
		}
		reqOptions.pageInfoListDecoded = pageInfoListDecoded;
	}
	return reqOptions.pageInfoListDecoded[id];
}

exports.getPage = getPage;