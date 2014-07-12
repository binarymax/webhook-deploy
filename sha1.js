var crypto = require('crypto');

var sha1 = module.exports = {};

sha1.compare = function(token,data,callback) {
	crypto.createHmac("sha1",token).update(data).digest("hex");
};