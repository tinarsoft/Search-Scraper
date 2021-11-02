const assert = require('assert');
const sec = require('../');


describe('test-test', function () {
	this.retries(4);
	it('test-retry', function () {
		this.retries(4);
		console.log("fail for retry");
		assert.fail("fail for retry");

	});
});
