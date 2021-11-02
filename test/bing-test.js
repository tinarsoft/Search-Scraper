const assert = require('assert');
const sec = require('../');

describe('bing', function () {

	this.retries(4);
	this.timeout(480000);

	it('should search', async function () {

		let text = "text to search";
		let options = {
			debug: true,
			wait: 2000,
			show: false
		};

		let res = await sec.bing(text, options);

		assert.notEqual(typeof res, "undefined");
		assert.notEqual(res, null);
		if (res.error) console.log(res.msg);
		assert.equal(res.error, false);
		assert.notEqual(res.count, 0);
		assert.equal(res.msg, "");
		assert.equal(res.search, text);
		assert.notEqual(res.links.length, 0);

	});

	it('should search non-found texts', async function () {

		let text = "\"nanozemearial\" \"fertesede\"";

		let options = {
			debug: true,
			wait: 2000,
			show: false
		};

		let res = await sec.bing(text, options);

		assert.notEqual(typeof res, "undefined");
		assert.notEqual(res, null);
		if (res.error) console.log(res.msg);
		assert.equal(res.error, false);
		assert.equal(res.count, 0);
		assert.equal(res.msg, "search text not found");
		assert.equal(res.search, text);
		assert.equal(res.links.length, 0);

	});

	it('should search with options', async function () {

		let text = "text to search";

		let options = {
			count: 15,
			debug: true,
			wait: 2000,
			show: false
		};

		let res = await sec.bing(text, options);

		assert.notEqual(typeof res, "undefined");
		assert.notEqual(res, null);
		if (res.error) console.log(res.msg);
		assert.equal(res.error, false);
		assert.notEqual(res.count, 0);
		assert.equal(res.msg, "");
		assert.equal(res.search, text);
		assert.notEqual(res.links.length, 0);
		if (res.count < 15 || res.links.length < 15) assert.fail("at least 15 result should return.");

	});

	it('should search for count 30', async function () {

		let text = "text to search";

		let options = {
			count: 30,
			debug: true,
			wait: 2000,
			show: false
		};

		let res = await sec.bing(text, options);

		assert.notEqual(typeof res, "undefined");
		assert.notEqual(res, null);
		if (res.error) console.log(res.msg);
		assert.equal(res.error, false);
		assert.notEqual(res.count, 0);
		assert.equal(res.msg, "");
		assert.equal(res.search, text);
		assert.notEqual(res.links.length, 0);
		if (res.count < 30 || res.links.length < 30) assert.fail(`current_count=${res.count} current_length=${res.links.length} at least 30 result should return.`);

	});

});
