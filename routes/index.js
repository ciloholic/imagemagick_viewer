var express = require('express');
var router = express.Router();
var fs = require('fs');
var imagemagick = require('imagemagick');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'ImageMagick Viewer' });
});

router.post('/', function(req, res) {
  // 画像(base64) -> 画像(バイナリ)
  var image_file = new Buffer(req.body['image_file'].replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
  // 画像を一時保存
  fs.writeFileSync(__dirname + '/../public/images/tmp', image_file);
  // convertのコマンドを生成
  var command = [path].concat(req.body['cmd'].split(' ')).concat(['INLINE:PNG:-'])
  imagemagick.convert(command, function(err = '', stdout = '') {
    res.header('Content-Type', 'application/json; charset=utf-8')
    // 画像(base64)を送り返す
    res.send({ 'image_file': stdout });
  });
});

module.exports = router;
