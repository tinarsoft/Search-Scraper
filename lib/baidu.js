const Path = require('path');
const Nightmare = require('nightmare');
const defaults = require("./defaults.js");
const unique = require('array-unique');

const SEC_DEFAULT_OPTIONS = defaults.SEC_DEFAULT_OPTIONS;

//https://github.com/thibauts/node-google-search-scraper/blob/master/index.js
const SEARCH_ENGINE_URL = "http://www.baidu.com/";
const COUNT_SELECTOR = ".head_nums_cont_outer .nums";
const LINK_SELECTOR = "div.result  a.m";
const NEXT_SELECTOR = "#page a.n";
const ENGINE = Path.basename(__filename, ".js");
const PERSIST_NAME = "sec-" + ENGINE;
const SEARCH_TEXTBOX_SELECTOR = 'form[name="f"] input[name="wd"]';
const SEARCH_SUBMIT_SELECTOR = 'form[name="f"] input[type="submit"]';
const NOT_FOUND_STR = "(没有找到与)|(No results)|(We did not find results for)|(did not match any document)|(No results found)|(hiçbir arama sonucu mevcut değil)|(hiçbir sonuç bulunamadı)|(not find results)|(No results for)";

function _decode_links(links) {
	return links;
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

	// when goto
	// message: 'navigation error',
	// code: -7,
	// details: 'Navigation timed out after 40000 ms',
	// url: 'http://www.baidu.com/'

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
		.evaluate((selector, regexStr, link_selector) => {
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
			} else {
				let linkCount = document.querySelectorAll(link_selector);
				res = linkCount.length;
			}

			var bodyText = document.querySelector('body').innerText;
			var regex = new RegExp(regexStr, "ig");

			if (regex.test(bodyText)) {
				res = 0;
			}

			return res;
		}, COUNT_SELECTOR, NOT_FOUND_STR, LINK_SELECTOR)
		.then((count) => {
			return count;
		})
		.catch(function (err) {
			if (options.debug) console.log(err);
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
					if (options.debug) console.log(err);
					result.error = true;
					result.msg = `first search=\"${text}\" search result count is ${result.count} but 0 link captured.`;
					return [];
				});

			while (true) {
				let hasMorePage = await nm.exists(NEXT_SELECTOR);
				let totalLinkCount = result.links.length;

				if (hasMorePage == false || totalLinkCount >= options.count) break;

				let next_result = await nm.click(NEXT_SELECTOR)
					.wait("body")
					.wait(options.wait)
					.evaluate((selector) => {
						var elements = [].slice.call(document.querySelectorAll(selector))
						var links = elements.map(elements => elements.href)
						return links;
					}, LINK_SELECTOR)
					.then((res) => {
						return res;
					})
					.catch((err) => {
						if (options.debug) console.log(err);
						result.error = true;
						result.msg = `next search=\"${text}\" search result count is ${result.count} but 0 link captured.`;
						return [];
					});

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

	result.links = _decode_links(result.links);

	if (result.links.length > result.count) result.count = result.links.length;

	return result;
};

module.exports = GetLinks;
