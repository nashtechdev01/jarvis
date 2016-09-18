/**
 * Created by tamnguyenvt on 9/17/2016.
 */
'use strict';
var tm = require('text-miner');

var TextMiner = function (docs) {
  this.corpus = new tm.Corpus(docs);
  this.tidy();
};

TextMiner.prototype.tidy = function() {
  this.corpus
    .trim()
    .toLower()
    .clean()
    .removeInterpunctuation()
    .removeNewlines()
    .removeWords(tm.STOPWORDS.EN);
};

TextMiner.prototype.weighting = function (customFuncs) {
    customFuncs = customFuncs || [];
    this.terms = new tm.Terms(this.corpus);

    // TODO: Weighting with customFuncs
    console.log(this.terms.vocabulary);
    console.log(this.terms.dtm);
};

TextMiner.prototype.getTerms = function () {
    return (new tm.Terms(this.corpus));
};

module.exports = TextMiner;