var ByteCode = function(uppod) {
    this.uppod = uppod;
}
ByteCode.prototype.Client = function() {
    return (this.uppod.client);
}
ByteCode.prototype.V = function() {
    return (this.uppod.mc);
}
ByteCode.prototype.I = function() {
    return (this.uppod.mc2);
}

ByteCode.prototype.tr = function(_arg1, _arg2, _arg3) {
    var _local4;
    var _local5;
    var _local6;
    if ((((_arg1.charCodeAt((_arg1.length - 2)) == _arg2)) && ((_arg1.charCodeAt(2) == _arg3)))) {
        _local5 = "";
        _local4 = (_arg1.length - 1);
        while (_local4 >= 0) {
            _local5 = (_local5 + _arg1.charAt(_local4));
            _local4--;
        };
        _arg1 = _local5;
        _local6 = _arg1.substr(Math.max(0, _arg1.length - 2));
        _arg1 = _arg1.substr(2);
        _arg1 = _arg1.substr(0, Math.max(0, _arg1.length - 3));
        _local6 = (_local6 / 2);
        if (_local6 < _arg1.length) {
            _local4 = _local6;
            while (_local4 < _arg1.length) {
                _arg1 = (_arg1.substring(0, _local4) + _arg1.substring((_local4 + 1)));
                _local4 = (_local4 + (_local6 * 1));
            };
        };
        _arg1 = (_arg1 + "!");
    };
    return (_arg1);
}
ByteCode.prototype.indexof = function(_arg1, _arg2) {
    return (((_arg2) ? _arg1.toUpperCase() : _arg1.toLowerCase()));
}

var ISObj = {
    _lg27: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    version: "1.0.0",
    /*
    *uppod 传入值
    *_arg1 为需要解密字符串
    *_arg2 boolean值
    *_arg3 为 d 或者 e
    */
    _foo: function(uppod , _arg1, _arg2 , _arg3) {
        _arg1 = _arg1.split("\n").join("");
        _arg1 = _arg1.replace(/ /g, "+");
        _arg1 = this.K12K(uppod , _arg1, _arg3 || "d", _arg2);
        var _local4 = this._xc13(_arg1);
        return (this.bin2String(_local4));
    },
    bin2String: function(array) {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i]);
        }
        return result;
    },
    K12K: function(uppod , _arg1, _arg2, _arg3) {
        var _local5;
        var _local7;
        var _local8;
        var _local4 = new ByteCode(uppod);
        _local5 = [];
        _local5 = _local4.V[0];
        var _local6 = _local4.V[1];
        _arg1 = _local4.tr(_arg1, 114, 65);
        if (_arg1.substr(Math.max(0, _arg1.length - 1)) == "!") {
            _arg1 = _arg1.substr(0, Math.max(0, _arg1.length - 1));
            _local5 = _local4.I[0];
            _local6 = _local4.I[1];
        };
        if (((! ((_local4.Client() == null))) && (!(_arg3)))) {
            if (_local4.Client().codec_a != null) {
                _local5 = _local4.Client().codec_a;
                _local6 = _local4.Client().codec_b;
            };
        };
        if (_arg2 == "e") {
            _local7 = _local5;
            _local8 = _local6;
        };
        if (_arg2 == "d") {
            _local7 = _local6;
            _local8 = _local5;
        };
        var _local9 = 0;
        while (_local9 < _local7.length) {
            _arg1 = this._pr62(_local7[_local9], _local8[_local9], _arg1);
            _local9++;
        };
        return (_arg1);
    },
    _pr62: function(_arg1, _arg2, _arg3) {
        var _local4 = new RegExp(_arg1, "g");
        var _local5 = new RegExp(_arg2, "g");
        _arg3 = _arg3.replace(_local4, "___");
        _arg3 = _arg3.replace(_local5, _arg1);
        _arg3 = _arg3.replace(/___/g, _arg2);
        return (_arg3);
    },
    _xc13: function(_arg1) {
        var _local6;
        var _local7;
        var _local2 = [];
        var _local3 = new Array(4);
        var _local4 = new Array(3);
        var _local5 = 0;
        while (_local5 < _arg1.length) {
            _local6 = 0;
            while ((((_local6 < 4)) && (((_local5 + _local6) < _arg1.length)))) {
                _local3[_local6] = this._lg27.indexOf(_arg1.charAt((_local5 + _local6)));
                _local6++;
            };
            _local4[0] = ((_local3[0] << 2) + ((_local3[1] & 48) >> 4));
            _local4[1] = (((_local3[1] & 15) << 4) + ((_local3[2] & 60) >> 2));
            _local4[2] = (((_local3[2] & 3) << 6) + _local3[3]);
            _local7 = 0;
            while (_local7 < _local4.length) {
                if (_local3[(_local7 + 1)] == 64) {
                    break;
                };
                _local2.push(_local4[_local7]);
                _local7++;
            };
            _local5 = (_local5 + 4);
        };
        _local2.position = 0;
        return (_local2);
    }
}


function foo(uppod , _arg1, _arg2 , _arg3) {
    return  ISObj._foo(uppod , _arg1, _arg2 , _arg3);
}


exports.foo = foo;