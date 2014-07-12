#!/usr/bin/env node

/****************************************************************************
*
* webhook-github - A minimalist CI for github webhook deployments
* (c)Copyright 2014, Max Irwin
* MIT License
*
****************************************************************************/

// Module dependencies
var fs       = require('fs');
var http     = require('http');
var github   = require('./github');
var deploy   = require('./deploy');
var command  = require('commander');

// Application Defaults
var port     = 3030;
var restart  = null;

// --------------------------------------------------------------------------
// Read in the package.json file:
var package  = JSON.parse(fs.readFileSync(__dirname + "/package.json"));

// --------------------------------------------------------------------------
// Initialize cli
command
	.version(package.version)
	.option('-g, --git <git>','The path of the git repo to pull')	
	.option('-r, --restart [restart]','The ubuntu restart command name, for "sudo restart ..."')
	.option('-p, --port [port]','The port on which the HTTP server will listen (defaults to 3030)')
	.parse(process.argv);

if (!command.git) {

	command.help();
	process.exit();

} else {

	if (command.port) port = parseInt(port,10);
	if (command.restart) restart = command.restart;

	webhook(port,restart);

}

// --------------------------------------------------------------------------
// Starts Webhook server
function webhook(port,restart) {

	var listener = function(req,res) {

		if (github.verify(req.method,req.url,req.headers)) {

			//process.nextTick(deploy.doit);
			console.log(req);
			
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(JSON.stringify(req.body||{},null,2));
			res.write('Success');
			res.end();

		} else {

			res.writeHead(403, {'Content-Type': 'text/html'});
			res.write('Not Allowed');
			res.end();

		}

	};

	var server = http.createServer(listener);
	server.listen(port);
	console.log('Webhook-Github server listening on port',port);

};