const os = require('os');
const Path = require('path');

const SEC_DEFAULT_OPTIONS = {
	count: 0,
	offset: 0,
	agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
	lang: "en-US,en;q=0.9",
	debug: false,
	show: false,
	screenshot: false,
	wait: 1000,
	callback: null
};

function check_options(options) {
	if (typeof options == "undefined") options = SEC_DEFAULT_OPTIONS;
	if (typeof options.count != "number") options.count = SEC_DEFAULT_OPTIONS.count;
	if (typeof options.offset != "number") options.offset = SEC_DEFAULT_OPTIONS.offset;
	if (typeof options.agent != "string") options.agent = SEC_DEFAULT_OPTIONS.agent;
	if (typeof options.lang != "string") options.lang = SEC_DEFAULT_OPTIONS.lang;
	if (typeof options.debug != "boolean") options.debug = SEC_DEFAULT_OPTIONS.debug;
	if (typeof options.show != "boolean") options.show = SEC_DEFAULT_OPTIONS.show;
	if (typeof options.screenshot != "boolean") options.screenshot = SEC_DEFAULT_OPTIONS.screenshot;
	if (typeof options.wait != "number") options.wait = SEC_DEFAULT_OPTIONS.wait;
	if (typeof options.callback != "function") options.callback = SEC_DEFAULT_OPTIONS.callback;
	return options;
}

function get_nm_options(sec_options, name) {
	return {
		show: sec_options.show,
		ignoreDownloads: true,
		typeInterval: 100, //100ms
		pollInterval: 350, //250
		gotoTimeout: 40000, // 30s
		loadTimeout: 60000, //infinite
		executionTimeout: 40000, //30s
		waitTimeout: 40000, //30s

		switches: {
			'ignore-certificate-errors': true
		},

		paths: {
			userData: Path.resolve(os.tmpdir(), `autokent-${name}`),
		},

		webPreferences: {
			partition: 'persist:' + name,
		},

		headers: {
			'Accept-Language': sec_options.lang
		}
	};
}

module.exports.SEC_DEFAULT_OPTIONS = SEC_DEFAULT_OPTIONS;
module.exports.check_options = check_options;
module.exports.get_nm_options = get_nm_options;
