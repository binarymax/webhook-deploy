#!/usr/bin/env node

/****************************************************************************
*
* webhook-deploy - A minimalist CI for github webhook deployments
* (c)Copyright 2014, Max Irwin
* MIT License
*
****************************************************************************/

// Module dependencies
var fs       = require('fs');
var http     = require('http');
var deploy   = require('./deploy');
var command  = require('commander');
var webhook  = require('github-webhook-handler')

// Application Defaults
var port     = 3030;
var secret   = null;
var restart  = null;

// --------------------------------------------------------------------------
// Read in the package.json file:
var package  = JSON.parse(fs.readFileSync(__dirname + "/package.json"));

// --------------------------------------------------------------------------
// Initialize cli
command
	.version(package.version)
	.option('-s, --secret <secret>','The secret')
	.option('-g, --git <git>','The path of the git repo to pull')
	.option('-r, --restart [restart]','The ubuntu restart command name, for "sudo restart ..."')
	.option('-p, --port [port]','The port on which the HTTP server will listen (defaults to 3030)')
	.parse(process.argv);

if (!command.git || !command.secret) {

	command.help();
	process.exit();

} else {

	if (command.port) port = parseInt(port,10);
	if (command.restart) restart = command.restart;

	initialize(command.git,command.secret,port,restart);

}

// --------------------------------------------------------------------------
// Starts Webhook server
function initialize(git,secret,port,restart) {

	var server;

	var handler = webhook({ path: '/deploy', secret: secret });

	handler.on('error', function (err) {
		console.err('Error:', err.message)
	});

	handler.on('push', function (event) {
		console.log('Received a push event for %s to %s',event.payload.repository.name,event.payload.ref);
		//deploy.doit(git,restart);
	});

	handler.on('issues', function (event) {
		console.log('Received an issue event for % action=%s: #%d %s',
			event.payload.repository.name,
			event.payload.action,
			event.payload.issue.number,
			event.payload.issue.title);
	});

	var listener = function(req,res) {

		handler(req, res, function (err) {
			res.statusCode = 404;
			res.end('no such location');
		});

	};

	server = http.createServer(listener);
	server.listen(port);
	console.log('Webhook-Deploy server listening on port',port);

};