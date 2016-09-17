/**
 * Created by tamnguyenvt on 9/17/2016.
 */
'use strict';
var tm = require('text-miner');

var TextMiner = function (docs) {
  this.corpus = new tm.Corpus(docs);
};

TextMiner.prototype.tidy = function() {
  this.corpus
    .trim()
    .toLower()
    .clean()
    .removeInterpunctuation()
    .removeNewlines()
    .removeWords(tm.STOPWORDS.EN);

  this.terms = new tm.Terms(this.corpus);
  console.log(this.terms.vocabulary);
  console.log(this.terms.dtm);
};

module.exports = TextMiner;