const observableModule = require("tns-core-modules/data/observable");
//const httpModule = require("http");
//let jsonFile = httpModule.getJSON("http://localhost:5555/islaam/data");
var firebase = require("nativescript-plugin-firebase");
//let jsonFile = require("~/data");
var config = require("../shared/config");

function HomeViewModel(info) {
	info = info || {};
    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        question: info.question || "What is Islam",
        answer: info.answer || "Islam is complete submission to the Creator of the heavens and the earth without associating any partners to Him"
    });
    viewModel.jsonFile = [];

    viewModel.init = function(){
        firebase.init({
            url:config.dataUrl
        }).then(function(instance){
            console.log("firebase init done");
        },function(error){
            console.log("firebase init error"+error);
        });
    };

    viewModel.search = function(){
    	/*
    	after splitting the question posed into words, it is converted to lower case 
    	and than a filter function is applied to it after converting stopWords into a Set 

    	*/
    	var qSplitted= viewModel.question.split(/\s+/);
    	var array=[];
    	var stopWords=['what','is','how','who','a','in','an','the','who','in','are','there','any','were','was','all','about'];
        var qSplitLower = [];
       // var answer=[];
    	for(var i =0; i< qSplitted.length;i++){
    		qSplitLower.push(qSplitted[i].toLowerCase());
    	}
    	array.push(qSplitLower.filter(function(n){
							return !this.has(n)
						},new Set(stopWords))
		);
		return array[0];
		//console.log(array);
		
 		
    	/*islamicFacts = viewModel.getDoc();
    	for (var key in islamicFacts) {
 			if(key.toLowerCase() == array){
 				answer.push(islamicFacts[key]);
 			}
 		
		}*/
		
    };

    viewModel.getDoc = function(){
    	/* generate keys from object in the js file which has one json
			object with severral key value pairs. Hence once the array is created
			from the keys a random number is multiplied with the array length(i.e 1)
			and than after rounding that number down using the floor function it is
			wrapped in to an array, generating a key value pair.
    	*/
        var onChildEvent = function(result) {
            //console.log("Key: " + JSON.stringify(result.key));
            //console.log("Value: " + JSON.stringify(result.value));
            viewModel.jsonFile.push(JSON.stringify((result.key)+":"+(result.value)));
           // console.log(viewModel.jsonFile);
        };
        firebase.addChildEventListener(onChildEvent,             
            "/IslaamData").then((snapshot) => {
            console.log("[*] Info : We've some data !");

        });


       // console.log(viewModel.jsonFile);
        //jsonArray = Object.keys(viewModel.jsonFile),
            
		//factIndex = Math.floor(Math.random() * jsonArray.length),
    	//islamicFact = viewModel.jsonFile[jsonArray[factIndex]];
		return viewModel.jsonFile;
    };

    viewModel.setAnswer=function(ans){
    	viewModel.set("answer", ans);
    };

    viewModel.returnQuestion = function(){
    	return viewModel.question;
    };

    viewModel.returnAnswer = function(){
        return viewModel.answer;
    };

    viewModel.addToJsonFile = function(que,ans){
        var question = que;
        const myObj={};
        myObj[question] = ans;
        var json = JSON.stringify(myObj);
        return json;
    };
    viewModel.addQAtoDb=function(data){
        firebase.push("/QAData",{
            question:data
        }).then((result) => {
         console.log("[*] Info : Your data was pushed !");
         }, (error) => {
       console.log("[*] Error : While pushing your data toFirebase, with error: " + error);
         });
    };

    return viewModel;
}

module.exports = HomeViewModel;
