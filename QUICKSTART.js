//const sec = require('search-engine-client');
const sec = require('./');


//sec.google("text to search").then(function(result){
//    debugger;
//    console.log(result);
//});


sec.bing("text to search").then(function (result) {
	debugger;
	console.log(result);
});

sec.aol("text to search").then(function (result) {
	debugger;
	console.log(result);
});
