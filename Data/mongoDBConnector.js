var fs = require('fs');
var mongojs = require("mongojs");

// to save the calculations imported by server using mongoDB
// format - exression:"5*5" result:"25" date:"Sat Nov 23 2013 20:18:36 GMT +0530 (India Standard Time)"
exports.saveToDatabase = function (expression1, result1) {
	// Database
	var databaseUrl = "calculatorDB";
	// Collection
	var collections = ["calciHistory"];
	// mongo connector
	var db = mongojs.connect(databaseUrl, collections);
	
	// MongoDB uses "+" for string concatenation and replaces "+" symbol with " "
	// so Convert " " to "+" before saving to DB
	expression1=expression1.replace(" ","+");
	result1=result1.replace(" ","+");
	
	// time and date while saving
	var date = new Date();
	
	// saving the expression and result
	db.calciHistory.save({expression:expression1, result:result1, date:date.toLocaleString()}, function(err, saved) {
		if(err||!saved ) {
			// steps on unsuccessful saving of expression in DB
			console.log("expression not saved");
		}
		else {
			// steps on successful saving of expression in DB
			console.log("expression saved");
		}
		// close the db after query
		db.close();
	});
};