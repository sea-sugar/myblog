var express = require('express');
var router = express.Router();
var users = require('./users')


router.use('/',users);
/* GET home page. */
router.get('/lhy', function(req, res, next) {
  res.render('index', { title: '海棠花未眠' });
});
router.get('/', function(req, res, next) {
  res.render('index', { title: '海棠花未眠' });
});

module.exports = router;
