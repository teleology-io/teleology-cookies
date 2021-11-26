"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.header = exports.clear = exports.set = exports.get = exports.SameSite = void 0;
var CLEAR_SUFFIX = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
exports.SameSite = {
    STRICT: 'Strict',
    LAX: 'Lax',
    NONE: 'None',
};
var SAME_SITE_VALUES = Object.values(exports.SameSite);
// @ts-ignore
var FILTER_INVALID = function (_a) {
    var _ = _a[0], v = _a[1];
    return !!v;
};
var Expiry;
(function (Expiry) {
    Expiry["SESSION"] = "Session";
})(Expiry || (Expiry = {}));
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
// @ts-ignore
var sanitizeValue = function (_a) {
    var _b = _a.urlEncode, urlEncode = _b === void 0 ? false : _b, value = _a.value;
    var v = "".concat(urlEncode ? encodeURIComponent(value) : value);
    var invalid = [
        /\(/g,
        /\)/g,
        /</g,
        />/g,
        /@/g,
        /,/g,
        /:/g,
        /;/g,
        /\\/g,
        /\"/g,
        /\//g,
        /\[/g,
        /\]/g,
        /\?/g,
        /=/g,
        /{/g,
        /}/g,
        /\s/g,
        /\c/g,
    ];
    for (var _i = 0, invalid_1 = invalid; _i < invalid_1.length; _i++) {
        var i = invalid_1[_i];
        console.log('test', i);
        if (i.test(v)) {
            throw new Error("Invalid character failed with RegExp ".concat(i));
        }
    }
    return v;
};
var get = function (key) {
    var cookie = document.cookie
        .split('; ')
        .find(function (it) { return it.indexOf("".concat(key, "=")) === 0; });
    if (cookie) {
        return cookie.split('=')[1];
    }
};
exports.get = get;
var set = function (_a) {
    var _b;
    var key = _a.key, value = _a.value, maxAge = _a.maxAge, expires = _a.expires, path = _a.path, secure = _a.secure, _c = _a.urlEncode, urlEncode = _c === void 0 ? false : _c;
    var args = (_b = {},
        _b[key] = sanitizeValue({ value: value, urlEncode: urlEncode }),
        _b['max-age'] = maxAge,
        _b.expires = expires,
        _b.path = path,
        _b.secure = secure,
        _b);
    var valid = Object.entries(args).filter(FILTER_INVALID);
    document.cookie = valid.map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, "=").concat(v, ";");
    }).join(' ');
};
exports.set = set;
var clear = function (key) {
    document.cookie = "".concat(key).concat(CLEAR_SUFFIX);
};
exports.clear = clear;
var header = function (_a) {
    var _b;
    var key = _a.key, value = _a.value, maxAge = _a.maxAge, expires = _a.expires, domain = _a.domain, path = _a.path, secure = _a.secure, httpOnly = _a.httpOnly, sameSite = _a.sameSite, _c = _a.urlEncode, urlEncode = _c === void 0 ? false : _c;
    var args = (_b = {},
        _b[key] = sanitizeValue({ value: value, urlEncode: urlEncode }),
        _b['Max-Age'] = maxAge,
        _b.Expires = expires,
        _b.Domain = domain,
        _b.Path = path,
        _b.SameSite = sameSite,
        _b);
    if (sameSite && SAME_SITE_VALUES.indexOf(sameSite) === -1) {
        throw new Error("Invalid SameSite value ".concat(sameSite, "\nExpected: ").concat(SAME_SITE_VALUES.join(' ')));
    }
    var valid = Object.entries(args).filter(FILTER_INVALID);
    // Map to key-value
    var keys = valid.map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, "=").concat(v);
    });
    if (secure) {
        keys.push('Secure');
    }
    if (httpOnly) {
        keys.push('HttpOnly');
    }
    if (sameSite === exports.SameSite.NONE && !secure) {
        throw new Error("When SameSite value is 'None', Secure must be set");
    }
    return keys.join('; ');
};
exports.header = header;
