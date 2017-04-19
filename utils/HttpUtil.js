var _ = require('underscore'),
    os = require('os'),
    conf = require('../server/conf'),
    androidUA = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JSS15Q) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.72 Safari/537.36",
    iphoneUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4",
    chromeUA = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36";
    localAddresses = [],
    randomLocalAddressDomains = (conf.randomLocalAddressDomains || '').split(',');

function getRandomLocalAddress(){
    if(localAddresses.length == 0){
        var networks = os.networkInterfaces();
         _.keys(networks).forEach(function(network){
            if(network.indexOf('eth') == 0){
                networks[network].forEach(function(info){
                    if(info.family === 'IPv4'){
                        localAddresses.push(info.address);
                    }
                });
            }
         })
    }
    var ipCount = localAddresses.length;
    if(ipCount > 0){
        var rand = Math.floor(Math.random()*ipCount);
        return localAddresses[rand];
    }
}

var defaultOption = {
    "method": "GET",
    "timeout": 15000,
    "headers": {
        "User-Agent": androidUA
    },
    "gzip" : true
};


function createRequestOption(url){
    return create(url);
}

function createRequestOptionWitchAndroid(url) {
   return create(url , androidUA);
}

function createRequestOptionWitchChrome(url) {
   return create(url , chromeUA);
}


function create(url , ua){
     var opts = {};
     if(ua){
        opts["headers"] = {};
        opts["headers"]["User-Agent"] = ua;
     }
     if (_.isObject(url)) {
        opts = _.extend(opts , url);
     }else{
        opts.url = url;
     }
    return _.extend({}, defaultOption , opts);
}

function createRequestOptionWitchIphone(url){
    return create(url , iphoneUA);
}

function randomLocalAddress(options,domain){
    if(domain && randomLocalAddressDomains && randomLocalAddressDomains.indexOf(domain) != -1){
        var localAddresses = getRandomLocalAddress();
        if(localAddresses){
            options.localAddresses = localAddresses;
        }
    }
}
exports.createRequestOption = createRequestOption;
exports.createRequestOptionWitchIphone = createRequestOptionWitchIphone;
exports.createRequestOptionWitchAndroid = createRequestOptionWitchAndroid;
exports.createRequestOptionWitchChrome = createRequestOptionWitchChrome;
exports.randomLocalAddress = randomLocalAddress;