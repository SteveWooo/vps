var _ = require('underscore'),
    request = require('request'),
    
    conf = require('../server/conf');

function proxiedRequest() {
    var proxy = conf.freegateProxy;
    if(proxy && proxy.indexOf('http') != -1){
        return request.defaults({proxy: proxy});
    }
    return request;
}
exports.proxiedRequest = proxiedRequest;