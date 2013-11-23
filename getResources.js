
var fs = require('fs');

// reads the resources calciControllers.js and calciStyles.css respectively
// takes the path of the resource as parameter
// returns the corresponding buffer
exports.getResources = function (inputResource) {
	return fs.readFileSync(inputResource);
};