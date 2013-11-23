var http = require('http');
var fs = require('fs');
var URLMod = require('url');
var resources = require('./getResources.js');

var util=require('util');
var querystring = require('querystring');
var dataPersistence = require('./Data/mongoDBConnector.js');

// function to handle get and post requests
// inputParams is nil for get requests
function requestHandler(req, res, inputParams){
	var fileResponse = "";
	var URL = req.url;
	var parsedURL = URLMod.parse(URL);
	var pathName = parsedURL.pathname;
	pathName = pathName.substring(1,pathName.length);
	//console.log(pathName);
	
	// base url - read calicView.html 
	if(pathName === "") {
		fileResponse=fs.readFileSync('Views/calciView.html');
		
		res.writeHead(200, {'Content-Type': 'text/html','Content-Length':fileResponse.length});
		res.write(fileResponse);
		res.end();
	}
	
	// other resource urls - to read calciController.js and calciStyles.js
	else if(pathName === "getResources"){
		var query = parsedURL.query;
		query = query.substring(6, query.length);
		
		fileResponse = resources.getResources(query);
		if(query==='Controllers/calciController.js') {
			res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length':fileResponse.length});
		}else {
			res.writeHead(200, {'Content-Type': 'text/css','Content-Length':fileResponse.length});
		}
		res.write(fileResponse);
		res.end();
	}
	
	// to save the expression and result, that are posted, into DB
	else if(pathName === "saveToDB") {
		var expression = inputParams.expression;
		var result = inputParams.result;
		
		dataPersistence.saveToDatabase(expression, result);
		
		res.writeHead(200, {'Content-Type': 'text/html','Content-Length':fileResponse.length});
		res.end();
	}
}

// Create Server at 127.0.0.1 with 9091 as port number
http.createServer(function(req, res){
	if(req.method==='GET') {
		requestHandler(req,res,null);
	}
	else {
		var chunk = '';
		req.on('data', function(data){
			chunk+=data;
		});
		req.on('end',function(){
			var inputParams = querystring.parse(chunk);
			requestHandler(req,res,inputParams);
		});
	}
}).listen(9091, '127.0.0.1');

console.log("Server Started with URL http://127.0.0.1:9091");