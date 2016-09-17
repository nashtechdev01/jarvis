/**
 * Created by tamnguyenvt on 9/17/2016.
 */
'use strict';
var crawlerInterface = require('./iCrawler');
var iCrawler = _.clone(crawlerInterface);

var crawler = function (options) {
  this.provider = 'google';
};

crawler.prototype = _.extend(crawler.prototype, iCrawler.prototype);
crawler.prototype = _.extend(crawler.prototype, {
  crawl: function() {},
  weighting: function() {},
});

module.exports = crawler;