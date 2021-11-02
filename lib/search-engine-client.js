const google = require("./google.js");
const bing = require("./bing.js");
const aol = require("./aol.js");
const ask = require("./ask.js");
const yahoo = require("./yahoo.js");
const duckduckgo = require("./duckduckgo.js");
const baidu = require("./baidu.js");

const sec = {
	google: google,
	bing: bing,
	aol: aol,
	ask: ask,
	yahoo: yahoo,
	duckduckgo: duckduckgo,
	baidu: baidu
};

module.exports = sec;
