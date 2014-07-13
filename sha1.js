var crypto = require('crypto');

var sha1 = module.exports = {};

sha1.compare = function(signature,password,payload,callback) {
	var verifier = crypto.createVerify("sha1")
	verifier.update(payload);
	return verifier.verify(password,signature,'hex');
};