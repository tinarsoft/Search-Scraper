const sec = require('./search-engine-client.js');
const defaults = require("./defaults.js");

async function LinkBuilder(term, options) {
	options = defaults.check_options(options);
	let ret = [];
	let result;

	result = await sec.aol(term, options).then(function (result) {
		return result;
	}).catch(function (err) {
		return {
			engine: "aol",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	result = await sec.ask(term, options).then(function (result) {
		return result;
	}).catch(function (err) {
		return {
			engine: "ask",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	result = await sec.baidu(term, options).then(function (result) {
		return result;
	}).catch(function (err) {
		return {
			engine: "baidu",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	result = await sec.bing(term, options).then(function (result) {
		return result;
	}).catch(function (err) {
		return {
			engine: "bing",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	result = await sec.duckduckgo(term, options).then(function (result) {
		return result;
	}).catch(function (err) {
		return {
			engine: "duckduckgo",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	result = await sec.google(term, options).then(function (result) {
		return result.links;
	}).catch(function (err) {
		return {
			engine: "google",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	result = await sec.yahoo(term, options).then(function (result) {
		return result.links;
	}).catch(function (err) {
		return {
			engine: "yahoo",
			error: err
		};
	});

	ret.push(result);
	if (result.links && options.callback) options.callback(result.links);

	return result;
}


module.exports = LinkBuilder;
