const sec = require("./lib/search-engine-client.js");
const builder = require("./lib/link-builder.js");

sec['builder'] = builder;

//for debugging purpose
const debug = require('debug');
debug.log = console.log.bind(console);
var info = debug('autokent:log');
var error = debug('autokent:error');
info("package initialized.");


module.exports = sec;


//for testing purpose
if (!module.parent) {
	//sec_test();
	builder_test();
}

function sec_test() {
	let options = {
		count: 50,
		debug: true,
		wait: 50
	};
	let text = "atomic force";
	return sec.aol(text, options)
		.then(function (res) {
			debugger;
			console.log(typeof res);
			console.log(res);
			console.log(res.msg);
			console.log(res.error);
			console.log(res.count);
			console.log(res.msg);
			console.log(res.search);
			console.log(res.links.length);
		});

}

function builder_test() {

	function builder_callback(links) {
		debugger;
	}

	let options = {
		count: 0,
		offset: 0,
		agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
		lang: "en-US,en;q=0.9",
		debug: false,
		show: false,
		screenshot: false,
		wait: 1000,
		callback: builder_callback
	};

	sec.builder("atomic force microscopy", options).then(function (result) {
		debugger;
	});
}
