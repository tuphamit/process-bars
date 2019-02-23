document.addEventListener("DOMContentLoaded", function(event) { 
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	      var obj = JSON.parse(this.responseText);
	      myFunction(obj);
	    }
	  };
	  xhttp.open("GET", "/process-bars-0.0.1/demo/test-servlet", true);
	  xhttp.send();
});
var limit = 0;

function myFunction(obj) {
	var buttons = obj.buttons;
	var htmlButtons = '';
	for (var i = 0; i < buttons.length; i++) {
		htmlButtons += generateButton(buttons[i]);
	}
	var bars = obj.bars;
	limit = obj.limit;
	var x = document.getElementById("bar-select");
	var htmlProcessBar = '';
	for (var i = 0; i < bars.length; i++) {
		var option = document.createElement("option");
		option.text = "process-bar-" + (i + 1);
		option.value = i;
		x.add(option);
		htmlProcessBar += generateBarProcess(i, bars[i]);
	}

	document.getElementById("bars-div").innerHTML = htmlProcessBar;
	document.getElementById("button").innerHTML = htmlButtons;
}
function generateButton(value){
	return '<input type="button" onclick="buttonClick(this);" class="button-process" data-value="'+ value +'" value="' + value +'" />';
}
function generateBarProcess(index, defaultVal){
	return '<div class="w3-grey" data-proval="' + defaultVal +'" id="bar-process-' + index + '" style="height:30px;width:'+ defaultVal + '%">' 
		+ '<p class="label-percent">'+ defaultVal +'% </p></div>';
}
var setChanges = [];
var doingChange = false;
function buttonClick(ele){
	var barIndex = document.getElementById("bar-select").value;
	var barPorcess = document.getElementById("bar-process-"+ barIndex);
	var barValue = parseInt(barPorcess.dataset.proval);
	var updateVal = barValue + parseInt(ele.value);
	if(updateVal < 0){
		updateVal = 0;
	}
	if(updateVal > limit){
		updateVal = limit;
	}
	var valWidth = updateVal;
	if(updateVal > 100){
		valWidth = 100;
		barPorcess.classList.add("over-100");
	}else{
		barPorcess.classList.remove("over-100");
	}
	
	var objChange = {};
	objChange.barPorcess = barPorcess;
	objChange.currentVal = barValue;
	objChange.changeValue = parseInt(ele.value);
	objChange.displayValue = valWidth;
	
	if(doingChange){
		setChanges.push(objChange);
	}else{
		changeProcessObj(objChange, callBackChangeProcess);
	}
		
	barPorcess.innerHTML = '<p class="label-percent">'+ updateVal +'% </p>';
	barPorcess.dataset.proval = updateVal;
}
function callBackChangeProcess(){
	var objChange = setChanges[0];
	setChanges.shift();
	changeProcessObj(objChange, callBackChangeProcess);
}
function changeProcessObj(objChange, callback){
	var barPorcess = objChange.barPorcess;
	var currentVal = objChange.currentVal;
	var changeValue = objChange.changeValue;
	var displayValue = objChange.displayValue;
	var change = 0;
	var delayTime = 300/changeValue;
	doingChange = true;
	var timer = setInterval(function () {
        if (change == changeValue){
            clearInterval(timer);
            doingChange = false;
            if(setChanges.length > 0){
            	callback();
            }
        }else{
        	if((currentVal + change) < 101){
        		barPorcess.style["width"] = (currentVal + change) + "%";
        	}
        	if(changeValue > 0){
        		change += 1;
        	}else{
        		change -= 1;
        	} 
        }
    }, delayTime);
}
function changeProcess(barPorcess, currentVal, changeValue, displayValue){
	var change = 0;
	var delayTime = changeValue/300;
	var timer = setInterval(function () {
        if (change == changeValue){
            clearInterval(timer);
            barPorcess.style["width"] = displayValue+ "%";
        }
		if((currentVal + change) > 100){
			barPorcess.style["width"] = displayValue + "%";
		}else{
			barPorcess.style["width"] = (currentVal + change) + "%";
		}
			
		if(changeValue > 0){
			change += 1;
		}else{
			change -= 1;
		} 
    }, delayTime);
}