var ArticleSchema = new _Schema({
  "title": String,
  "url": String,
  "author": String,
  "dateAdded": Number,
  "publishedDate": String,
  description: String,
  imageUrls: Array,
  userId: String
});


module.exports = _mongoose.model('Article', ArticleSchema);