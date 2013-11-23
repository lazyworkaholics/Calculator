
// to track the presence of decimal point while pressing numbers
// decimal point should be appear only once in any number
var decimalPoint = false;

// to track the condition to change the number on display
// number needs to be changed on pressing = or any operator
var bufferNumberChange = false;

// save a number in buffer for the binary operation
// this calculator works like (BUFFERED NUMBER)(OPERATOR)(NUMBER ON DISPLAY)
var bufferedNumber = "0";

// to track the operator in buffer, +,-,*,/
var currentOperator = "";

function calciController ($scope) {
	$scope.displayValue="0";
	
	// to save the expression and result into DB
	// using asynchronous post request
	function saveToDB(expression, result) {
		//console.log("exp: "+expression+" result: "+result);
		
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp=new XMLHttpRequest();
		}
		else {
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.onreadystatechange=function() {
			
			//call back, when the calculation is not saved in DB
			if (xmlhttp.readyState==4 && xmlhttp.status!=200) {
				window.alert("Server not responding. Caculation cannot be saved.");
			}
		}
	
		// save the expression in DB asynchronously
		xmlhttp.open("POST","http://127.0.0.1:9091/saveToDB",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		
		//"expression=5*5&result=25"
		var inputParam = "expression="+expression+"&result="+result;
		console.log(inputParam);
		
		// send request
		xmlhttp.send(inputParam);
	};
	
	// funtion that gets called on pressing any button 0-9
	$scope.number=function (n) {
		// check the number change condition
		if(!bufferNumberChange) {
			// check the existence of decimal point
			if(!decimalPoint) {
				// limiting the number of digits of input number to max 12
				if($scope.displayValue.toString().length<=12){
					$scope.displayValue = parseInt((parseInt($scope.displayValue)*10) + parseInt(n));
				}
			}else {
				// limiting the number of digits of input number to max 12
				if($scope.displayValue.toString().length<=13){
					$scope.displayValue=$scope.displayValue + n;
				}
			}
		}else {
			$scope.displayValue=n;
			bufferNumberChange = false;
		}
	};

	// funtion that gets called on pressing any decimal point
	$scope.decimal=function () {
		if(!bufferNumberChange) {
			// if the decimal point doesnot exist in the number now place it
			if(!decimalPoint) {
				$scope.displayValue=$scope.displayValue + ".";
			}
		}else {
			$scope.displayValue = "0.";
			bufferNumberChange = false;
		}
		
		// make decimal point tracker true
		decimalPoint = true;
	};

	// funtion that gets called on pressing '=' button
	$scope.equals=function () {
		evaluate();
	};

	// funtion that gets called on pressing any operator +, -, *, /
	$scope.operator=function (sign) {
		// if an operator already exists in buffer, make that binary calculation first
		if((!bufferNumberChange)&&(currentOperator!=="")) {
			evaluate();
		}
		// now save the current number on display in to buffer
		bufferedNumber = $scope.displayValue;
		// track the operator that is pressed now
		currentOperator = sign;
		// make the numberchanger buffer true now, the number on display resets
		bufferNumberChange = true;
	};

	// funtion that gets called on pressing any button c
	// clear all the buffer and bring calculator to default state
	$scope.clearAll=function () {
		// reset the display value to 0
		$scope.displayValue = "0";
		
		// set decimalPoint, bufferNumberChange, bufferedNumber, currentOperators to default values
		decimalPoint = false;
		bufferNumberChange = true;
		bufferedNumber = $scope.displayValue;
		currentOperator = "";
	};
	
	function evaluate() {
		// expression is one to parameter to be saved to db along with result (e.g: 5*5)
		var expression="";
		
		// Addition, Subtraction, Multiplication, Division handled on switch
		switch(currentOperator) {
		case "+": {
				// addition
				expression = bufferedNumber+"+"+$scope.displayValue;
				$scope.displayValue = parseFloat(bufferedNumber) + parseFloat($scope.displayValue);
			}
			break;
		case "-": {
				// subtraction
				expression = bufferedNumber+"-"+$scope.displayValue;
				$scope.displayValue = parseFloat(bufferedNumber) - parseFloat($scope.displayValue);
			}
			break;
		case "*": {
				// multiplication
				expression = bufferedNumber+"*"+$scope.displayValue;
				$scope.displayValue = parseFloat(bufferedNumber) * parseFloat($scope.displayValue);
			}
			break;
		
		case "/": {
				// division
				expression = bufferedNumber+"/"+$scope.displayValue;
				$scope.displayValue = parseFloat(bufferedNumber) / parseFloat($scope.displayValue);
			}
			break;
		}
		
		// save the calculation that is done above to db if its valid.
		// ignore invalid calculations like division by 0.
		if($scope.displayValue!=='Infinity'){
			saveToDB(expression,$scope.displayValue);
		}
		bufferNumberChange = true;
		decimalPoint = false;
		currentOperator = "";
	}

}

