# search-engine-client

**A nodejs module to extract links from Google, Bing etc..**

[![version](https://img.shields.io/npm/v/search-engine-client.svg)](https://www.npmjs.org/package/search-engine-client)
[![downloads](https://img.shields.io/npm/dt/search-engine-client.svg)](https://www.npmjs.org/package/search-engine-client)
[![node](https://img.shields.io/node/v/search-engine-client.svg)](https://nodejs.org/)
[![status](https://gitlab.com/autokent/search-engine-client/badges/master/pipeline.svg)](https://gitlab.com/autokent/search-engine-client/pipelines)

## Installation
`npm install search-engine-client`

## Usage

### Google
```js
const sec = require('search-engine-client');

sec.google("text to search").then(function(result){
    console.log(result);
});
```

### Bing
```js
const sec = require('search-engine-client');

sec.bing("text to search").then(function(result){
    console.log(result);
});
```

### AOL
```js
const sec = require('search-engine-client');

sec.aol("text to search").then(function(result){
    console.log(result);
});
```

### ASK
```js
const sec = require('search-engine-client');

sec.ask("text to search").then(function(result){
    console.log(result);
});
```

### Yahoo
```js
const sec = require('search-engine-client');

sec.yahoo("text to search").then(function(result){
    console.log(result);
});
```

### DuckDuckGo
```js
const sec = require('search-engine-client');

sec.duckduckgo("text to search").then(function(result){
    console.log(result);
});
```

### Baidu
```js
const sec = require('search-engine-client');

sec.baidu("text to search").then(function(result){
    console.log(result);
});
```

## Options

### defaults
```js
let default_options={
	count: 0,
	offset: 0,
	agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
	lang: "en-US,en;q=0.9",
	debug: false,
	show: false,
	screenshot: false,
	wait: 1000
};
```

### count (number)
The minimum link count to extract, higher return count takes more time.

```js
const sec = require('search-engine-client');

const options = {
    agent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
    count:15
};

sec.aol("text to search",options).then(function(result){
    console.log(result);
});
```

### offset (number)
Offset to skip links, not implemented check the [issue.](https://gitlab.com/autokent/search-engine-client/issues/1)

### agent (string)
The User-Agent request header.

```js
const sec = require('search-engine-client');

const options = {
    agent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36"
};

sec.aol("text to search",options).then(function(result){
    console.log(result);
});
```

### lang (string)
The Accept-Language request HTTP header.

### debug (boolean)
Prints debug logs.

### show (boolean)
Show browser screen.

```js
const sec = require('search-engine-client');

const options = {
    agent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
    count:15,
    show:true
};

sec.aol("text to search",options).then(function(result){
    console.log(result);
});
```

### screenshot (boolean)
Enable or disable checkpoints screenshots.

### wait (number)
Wait after search(ms).

## Test
* `mocha` or `npm test`
* Check [test folder](https://gitlab.com/autokent/search-engine-client/tree/master/test) and [quickstart.js](https://gitlab.com/autokent/search-engine-client/blob/master/quickstart.js) for extra usages.

## Support
I use this package actively myself, so it has my top priority. You can chat on WhatsApp about any infos, ideas and suggestions.

[![WhatsApp](https://img.shields.io/badge/style-chat-green.svg?style=flat&label=whatsapp)](https://api.whatsapp.com/send?phone=905063042480&text=Hi%2C%0ALet%27s%20talk%20about%20search-engine-client)

### Submitting an Issue
If you find a bug or a mistake, you can help by submitting an issue to [GitLab Repository](https://gitlab.com/autokent/search-engine-client/issues)

### Creating a Merge Request
GitLab calls it merge request instead of pull request.  

* [A Guide for First-Timers](https://about.gitlab.com/2016/06/16/fearless-contribution-a-guide-for-first-timers/)
* [How to create a merge request](https://docs.gitlab.com/ee/gitlab-basics/add-merge-request.html)
* Check [Contributing Guide](https://gitlab.com/autokent/search-engine-client/blob/master/CONTRIBUTING.md) 

## License
[MIT licensed](https://gitlab.com/autokent/search-engine-client/blob/master/LICENSE) and all it's dependencies are MIT or BSD licensed.