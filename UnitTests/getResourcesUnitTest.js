
var resources = require('../getResources.js');

//to test getResources function with input as calciController.js
console.log("calciController.js : "+ resources.getResources("../Controllers/calciController.js"));
console.log("\n");

//to test getResources function with input as calciStyles.css
console.log("calciStyles.css : " + resources.getResources("../Styles/calciStyles.css"));