//从pageUrl提取季度和集数
var  extractSeasonEpisode = function(pageUrl){
    var s = extractIntByRe(pageUrl,/_season=(\d+)/,1);
    var e = extractIntByRe(pageUrl,/_episode=(\d+)/,1);
    return {s:s,e:e};
};

function extractIntByRe(src,re,defaultValue){
    var result;
    try{
        var r = re.exec(src);
        if(r && r.length == 2){
            result = parseInt(r[1]);
        }
    }catch(e){
        // console.log(e.stack);
    }
    return result || defaultValue;
}

function extractUppodSerialInfo(pageUrl,html,video,callback){
    var se = extractSeasonEpisode(pageUrl);
    var playlist;
    try{
        playlist = JSON.parse(html).playlist;
    }catch(e){
        eval("var json = "+html+";playlist=json.playlist;");
    }
    if(!playlist || !playlist.length || playlist.length <= 0 ){
    	callback("PARSE_ERROR");
        return;
    }
    //所要查询的季度。
    var season = playlist;
    //收集季度信息（季度:集数）
    //不止一季度
    if(playlist[0].playlist){
        for(var i=0;i<playlist.length;i++){
            video.addSeason(i+1,playlist[i].playlist.length);
        }
        //如果大于季度数，则取最后一季
        if(se.s >= playlist.length){
            se.s = playlist.length;
        }
        season = playlist[se.s-1].playlist;
    }else{
        video.addSeason(1,playlist.length);
        se.s = 1;
    }
    //如果大于该季度的集数，则取最后一集
    if(se.e >= season.length){
        se.e = season.length;
    }
    var episode = season[se.e-1];
    if(episode.comment){
    	video.title = episode.comment;    	
    }
    var url = episode.file;
    var videoFile = video.addFile({
        format: URLUtil.extractUrlFormat(url),
        resolutionCode: "normal",
        fileSize: 0,
        multipart: false
    });
    videoFile.addFragment({
        index: 1,
        url: url,
        fileSize: 0,
        duration: 0
    });
    callback(video);
    return;
}
exports.extractSeasonEpisode = extractSeasonEpisode;
exports.extractUppodSerialInfo = extractUppodSerialInfo;