var sha1 = require('./sha1');
var github = module.exports = {};

github.verify = function(method,url,headers) {

	return ((method === 'POST') && (url==='/deploy'));

};