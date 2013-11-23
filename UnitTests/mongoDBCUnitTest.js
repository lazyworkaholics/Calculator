var resources = require('../Data/mongoDBConnector.js');

// before running this test make sure mongodb is up and running 
// and database calculatorDB is created with collection caliHistory in it

// to test saveToDatabase function in mongoDBConnector for various operators
resources.saveToDatabase("3+3", "6");
resources.saveToDatabase("18-3", "15");
resources.saveToDatabase("3*3", "9");
resources.saveToDatabase("12/4", "3");

// check the calciHistory in calculatorDB after running this file
// the above expression needs to be saved