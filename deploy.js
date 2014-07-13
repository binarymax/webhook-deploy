var exec = require('child_process').exec;

var deploy = module.exports = {};

var pull;
var npm;
var restart;

var compose = function(command,options) {
	return function(callback) {
		return function() {
			exec(command, options, function (execerr, stdout, stderr) {		
				callback(execerr||stderr, stdout);
			});		
		};
	};
};

deploy.doit = function(callback) {

	//if (pull && npm && restart) {

		//pull(npm(restart(callback)))();

	if (pull) {

		pull(callback)();

	} else {

		callback("Initialize first");

	}

};

deploy.init = function(cwd,restart) {
	var opt = {cwd : cwd};
	pull    = compose("git pull", opt);
	npm     = compose("npm install", opt);
	start   = compose("sudo restart " + restart, opt);
};