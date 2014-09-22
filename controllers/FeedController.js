var FeedParser = require('feedparser');
var request = require('request');
var Article = require('../models/Articles');
var async = require('async');


module.exports = {
  processFeedLink: function (req, res) {
    console.log(req.body);
    var feedparser = new FeedParser();
    var content = [];
    var req = request(req.body.feedLink);
    req.on('error', function (error) {
      console.log('Request -: ', error);
    });
    req.on('response', function (res) {
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);
    });

    feedparser.on('error', function (error) {
      console.log('FeedParser -: ', error);
    });
    feedparser.on('readable', function () {
      var stream = this
        , meta = this.meta
        , item;
      content.push(stream.read());
    });
    feedparser.on('end', function () {
      res.send({success: true, data: content, errors: null}, 200);
    })
  },
  processArticles: function (req, res) {
    console.log(req.body);
    var feedparser = new FeedParser();
    var content = [];
    var contentWithMetaData = [];
    var reqs = request(req.body.feedURL);
    reqs.on('error', function (error) {
      console.log('Request -: ', error);
    });
    reqs.on('response', function (res) {
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);
    });

    feedparser.on('error', function (error) {
      console.log('FeedParser -: ', error);
    });
    feedparser.on('readable', function () {
      var stream = this
        , meta = this.meta
        , item;
      content.push(stream.read());
    });
    feedparser.on('end', function () {
      content.forEach(function (el, idx) {
        if (req.body.articles.indexOf(el.link) !== -1) {
          contentWithMetaData.push(el);
        }
      });

      var tasks = [];
      contentWithMetaData.forEach(function (el, idx) {
        tasks.push(function (callback) {
          new Article({
            title: el.title,
            url: el.link,
            description: el.description,
            publishedDate: el.date,
            author: el.author,
            imageUrls: el.image,
            dateAdded: +new Date(),
            userId: req.user._id
          }).save(function (err, user) {
              callback(err, user)
            })
        })
      })

      async.parallel(tasks, function (err, results) {
        res.send({success: true, data: results, errors: null}, 200);
      })
    })
  },
  fetchArticles: function (req, res) {
    Article.find({userId: req.user._id}, function (err, articles) {
      if (err) {
        res.send({success: false, data: null, errors: err}, 200);
      } else {
        res.send({success: true, data: articles, errors: null}, 200);
      }
    })
  },
  deleteArticle: function (req, res){
    console.log(req.param('id'));
    Article.remove({_id: req.param('id')}, function (err, deleted) {
      console.log(err, deleted);
      if (err) {
        res.send({success: false, data: null, errors: err}, 200);
      } else {
        res.send({success: true, data: deleted, errors: null}, 200);
      }
    })
  }
};