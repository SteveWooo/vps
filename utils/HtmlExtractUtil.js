function extractTitle(html) {
    var reg = /<title>(.*)<\/title>/i;
    var arr = reg.exec(html);
    if (arr != null && arr.length > 1) {
        if (arr[1] != null) {
            return arr[1];
        }
    }
    return null;
}

function extractCode(html, start, end, includeStart, includeEnd) {
    try {
        var startIndex = html.indexOf(start);
        if (startIndex > -1) {
            var endIndex = html.indexOf(end, startIndex+start.length);
            if (endIndex > -1) {
                // console.log(startIndex + " " + endIndex);
                if (!includeStart) {
                    startIndex += start.length;
                }
                if (includeEnd) {
                    endIndex += end.length;
                }
                var code = html.substring(startIndex, endIndex);
                return code;
            }
        }
    } catch (e) {
        // console.log(e);
    }
    return '';
}

exports.extractTitle = extractTitle;
exports.extractCode = extractCode;