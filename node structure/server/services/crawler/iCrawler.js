/**
 * Created by tamnguyenvt on 9/17/2016.
 */
'use strict';

var iCrawler = function (options) {
  this.provider = options.provider;
};

iCrawler.prototype.crawl = function() {};
iCrawler.prototype.weighting = function() {};

module.exports = iCrawler;