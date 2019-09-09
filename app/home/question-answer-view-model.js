/*

function QuestionAnswerViewModel(info){
	info= info||{};
	const qaViewModel = observableModule.fromObject({
		question:info.question,
		answer:info.answer
	});

	qaViewModel.addToJSON = function(){
		var question = qaViewModel.question;
		var answer = qaViewModel.answer;
		const myObj={
			question : answer
		}
		var json = JSON.stringify(myObj);
		return json;
	};

	return qaViewModel;
}

module.exports = QuestionAnswerViewModel;
*/