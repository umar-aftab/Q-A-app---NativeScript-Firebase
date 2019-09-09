/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
//const fs = require("tns-core-modules/file-system");
const HomeViewModel = require("./home-view-model");
//var bghttp = require("nativescript-background-http");
//const QuestionAnswerViewModel = require("./question-answer-view-model");
const httpModule = require("tns-core-modules/http");
const fs = require("fs");
//let jsonFile = httpModule.getJSON("http://localhost:5555/islaam/data");
//let jsonFile = require("~/data");
let logUrl = "http://umaraftab.pythonanywhere.com/"
//let dataQAFile = require("~/dataQA")

var home = new HomeViewModel();
//var qA = new QuestionAnswerViewModel();
//home.init();
var islamicFacts = home.getDoc();
var question;
var page;

exports.pageLoaded = function(args){
	//alert("Page Loaded");
	page = args.object;
    page.bindingContext = home;

}; 


exports.lookup =function(){
	//question = page.getViewById('question');
	console.log("---------------In Look up--------------");
	var keyWords_1={};
	var keyWords_2={};
	var keyWords_3={};
	var islamicData = {};
	//home.init();
	//console.log(islamicFacts);
	//console.log(islamicFact);
	for (var item in islamicFacts){
		thisItem=islamicFacts[item];
		splitItem=thisItem.split(':');
		islamicData[splitItem[0].replace(/['"]+/g, '')]=splitItem[1];

	}
	//console.log(islamicData);
	/*console.log("Items in islamicData");
	for (var item in islamicData){
		
		console.log(item);
	}*/

	var item=home.search();
	item.sort();
	//console.log("ITEM: "+item);
	//console.log("ITEMLENGTH: "+item.length);
	var newItem;
	var newKey;

	for(var key in islamicData){
		keyWord = key.toLowerCase().trim().split(" ");
		console.log(keyWord);
		keyWord.sort();
		if(keyWord.length == 1){
			keyWords_1[key]=keyWord;
		}else
		if(keyWord.length == 2){
			keyWords_2[key]=keyWord;
		}else
		if(keyWord.length == 3){
			keyWords_3[key]=keyWord;
		}
	}


	if(item.length ==1){
		newItem= item.filter(
			function(n){
				return !this.has(n)
			},
			new Set(Object.values(keyWords_1))
		);
		console.log("Key:"+newItem);
		for(var key in keyWords_1){
			if(keyWords_1[key][0] == newItem[0]){
				newKey = key;
			}
		}
		console.log("NewKey:"+newKey);
	}else
	if(item.length ==2){
		newItem= item.filter(
			function(n){
				return !this.has(n)
			},
			new Set(Object.values(keyWords_2))
		);
		console.log("Key:"+newItem);
		for(var key in keyWords_2){
			if(keyWords_2[key][0] == newItem[0] && keyWords_2[key][1] == newItem[1]){
				newKey = key;
			}
		}
		console.log(newKey);
	}else
	if(item.length ==3){
		newItem= item.filter(
			function(n){
				return !this.has(n)
			},
			new Set(Object.values(keyWords_3))
		);
		console.log("Key:"+newItem);
		for(var key in keyWords_3){
			if(keyWords_3[key][0] == newItem[0] && keyWords_3[key][1] == newItem[1] && keyWords_3[key][2] == newItem[2]){
				newKey = key;
			}
		}
		console.log(newKey);
	}
	if(item.length > 3){
		home.setAnswer("The app is not programmed for longer questions");
	}


	for(var key in islamicData){
		//key.toLowerCase();
		if(key === newKey){
			//console.log(key,newKey);
			home.setAnswer(islamicData[key]);
		}else if(islamicData[newKey] === undefined){
			home.setAnswer("The answer to this question is not available at the moment.");
		}
	}


	var addData= home.addToJsonFile(home.returnQuestion(),home.returnAnswer());
	home.addQAtoDb(addData);
	console.log(addData);
	console.log();
	//fs.writeFileSync(dataQAFile,addData);
	//console.log(keyWords_1);
	//console.log(keyWords_2);
	//console.log(keyWords_3);
/*
	if(item.length == 1){
		for(var key in islamicFacts){	
    		//console.log(key + ": " + islamicFacts[key]);
			console.log(key);
			if(key.toLowerCase() == item){
 				home.setAnswer(islamicFacts[key]);
 			}
		
		}	
	}else if(item.length == 2){
		for(var key in islamicFacts){
			keyWord = key.toLowerCase().trim().split(" ");
			console.log(keyWord);
			keyWord.sort();
			if(keyWord.length == 2){

				if(keyWords== item){
					console.log(keyWords);
	 				home.setAnswer(islamicFacts[key]);
	 			}
 			}
		}
	}*/
/*
	if (islamicFacts.hasOwnProperty(key)) {
    	console.log(key + ": " + islamicFacts[key]);
 	}*/
};

/*exports.getRequest = function(){
	httpModule.getJSON("http://umaraftab.pythonanywhere.com/islaam").then(function(result) {
        console.log(JSON.stringify(result));
    }, function(error) {
        console.error(JSON.stringify(error)); 
    });
};*/

