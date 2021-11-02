const Path = require('path');
const Nightmare = require('nightmare');
const defaults = require("./defaults.js");
const unique = require('array-unique');
const debug = require('debug');
debug.log = console.log.bind(console);
var info = debug('autokent:log');
var error = debug('autokent:error');
info("package initialized.");

const SEC_DEFAULT_OPTIONS = defaults.SEC_DEFAULT_OPTIONS;

//https://github.com/thibauts/node-google-search-scraper/blob/master/index.js
const SEARCH_ENGINE_URL = "https://search.aol.com/aol/webhome";
const COUNT_SELECTOR = ".searchTop .title span";
const LINK_SELECTOR = ".title a";
const NEXT_SELECTOR = ".searchBottom a.next";
const ENGINE = Path.basename(__filename, ".js");
const PERSIST_NAME = "sec-" + ENGINE;
const SEARCH_TEXTBOX_SELECTOR = 'form[action^="/aol/search"] input[type="text"]';
const SEARCH_SUBMIT_SELECTOR = 'form[action^="/aol/search"] button[type="submit"]';
const NOT_FOUND_STR = "(We did not find results for)|(Check spelling or type a new query)|(did not match any document)|(No results found)|(hiçbir arama sonucu mevcut değil)|(hiçbir sonuç bulunamadı)|(not find results)";

function _decode_links(links) {
	let decoded_links = [];
	let url_regex = /RU=[^\/]+/g;
	for (let link of links) {
		try {
			let linkStr = link.match(url_regex);
			linkStr = linkStr[0].replace("RU=", "");
			let decoded_link = decodeURIComponent(linkStr);
			decoded_links.push(decoded_link);
		} catch (err) {
			//video & image links
		}
	}
	return decoded_links;
}

async function GetLinks(text, options) {

	options = defaults.check_options(options);
	const NIGHTMARE_OPTIONS = defaults.get_nm_options(options, PERSIST_NAME);
	let nm = Nightmare(NIGHTMARE_OPTIONS);

	var result = {
		engine: ENGINE,
		search: text,
		count: -1,
		links: [],
		error: false,
		msg: ""
	};

	//search text
	result.count = await nm.useragent(options.agent)
		.viewport(1024, 768)
		.goto(SEARCH_ENGINE_URL, NIGHTMARE_OPTIONS.headers)
		.wait("body")
		.wait(SEARCH_TEXTBOX_SELECTOR)
		.wait(options.wait)
		.type(SEARCH_TEXTBOX_SELECTOR, text)
		.click(SEARCH_SUBMIT_SELECTOR)
		.wait("body")
		.wait(options.wait)
		.evaluate((selector, regexStr) => {
			var res = 0;
			var el = document.querySelector(selector);
			if (el != null) {
				try {
					let match = el.textContent.match(/[0-9.,]+/g);
					let matchStr = match[0];
					matchStr = matchStr.replace(/[,.]+/g, "");
					res = parseInt(matchStr);
				} catch (err) {
					res = 0;
					result.msg = err.toString();
				}
			}

			var bodyText = document.querySelector('body').innerText;
			var regex = new RegExp(regexStr, "ig");

			if (regex.test(bodyText)) {
				res = 0;
			}

			return res;
		}, COUNT_SELECTOR, NOT_FOUND_STR)
		.then((count) => {
			return count;
		})
		.catch(function (err) {
			error(err);
			result.error = true;
			result.msg = "After-Search-" + err.toString();
			return -1;
		});

	if (options.screenshot) await nm.screenshot(`${PERSIST_NAME}-after-search.png`);

	if (result.count > 0) {
		var searchResultExists = await nm.exists(LINK_SELECTOR);

		if (searchResultExists) {
			result.links = await nm.evaluate((selector) => {
					var elements = [].slice.call(document.querySelectorAll(selector))
					var links = elements.map(elements => elements.href)
					return links;
				}, LINK_SELECTOR)
				.then((res) => {
					return res;
				})
				.catch((err) => {
					error(err);
					result.error = true;
					result.msg = `first search=\"${text}\" search result count is ${result.count} but 0 link captured.`;
					return [];
				});

			result.links = _decode_links(result.links);

			while (true) {
				let hasMorePage = await nm.exists(NEXT_SELECTOR);
				let totalLinkCount = result.links.length;

				if (totalLinkCount < options.count) {
					if (!hasMorePage) {
						info(`no more page, text:${text} totalLinkCount:${totalLinkCount}  options.count:${options.count}`);
						break;
					}

				} else {
					break;
				}

				//goto next page
				let next_result = await nm.click(NEXT_SELECTOR)
					.wait(options.wait)
					.evaluate((selector) => {
						let els = document.querySelectorAll(selector);
						if (els != null) {
							var elements = [].slice.call(document.querySelectorAll(selector))
							var links = elements.map(elements => elements.href)
							return links;
						} else {
							return [];
						}
					}, LINK_SELECTOR)
					.then((res) => {
						return res;
					})
					.catch((err) => {
						error(err);
						result.error = true;
						result.msg = `next search=\"${text}\" search result count is ${result.count} but 0 link captured.`;
						return [];
					});

				next_result = _decode_links(next_result);
				result.links = unique(result.links.concat(next_result));
			}
		} else {
			result.links = [];
			result.error = true;
			result.count = -1;
			result.msg = `search=\"${text}\" search result count is ${result.count} but search result not exists.`;
		}
	} else if (result.count == 0) {
		result.links = [];
		result.error = false;
		result.count = 0;
		result.msg = "search text not found";
	} else if (result.count < 0) {
		result.links = [];
		result.error = true;
		result.count = 0;
		if (result.msg == "") {
			result.msg = "undefined error net connection is broken or capcha fired.";
		}
	}

	if (options.screenshot) await nm.screenshot(`${PERSIST_NAME}-before-end.png`);
	await nm.end();

	//result.links = _decode_links(result.links);

	return result;
};

module.exports = GetLinks;
