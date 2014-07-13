var sha1 = require('./sha1');
var github = module.exports = {};

github.verify = function(method,url,password,headers) {

	//return ((method === 'POST') && (url==='/deploy') && sha1.compare(headers['x-hub-signature'],password));
	return ((method === 'POST') && (url==='/deploy'));

};