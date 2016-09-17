var GoogleSearch = require('google-search');
var googleSearch = new GoogleSearch({
    key: 'AIzaSyA8yV5y08JsYzq3Rm5aTl33EWUpH3d18Ec',
    cx: '012900654763493785442:uyz9s442hko'
});


googleSearch.build({
    q: "hello world",
    start: 5,
    //fileType: "pdf",
    //gl: "tr", //geolocation,
    //lr: "lang_tr",
    num: 10, // Number of search results to return between 1 and 10, inclusive
    //siteSearch: "http://kitaplar.ankara.edu.tr/" // Restricts results to URLs from a specified site
}, function(error, response) {
    console.log(response);
});

