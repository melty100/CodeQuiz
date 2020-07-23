class Question {
    constructor(questionText, response, correctResponse) {
        this.questionText = questionText;
        this.response = response;
        this.correctResponse = correctResponse;
    }
}

var questions = [new Question("Which of the following is not a method for an array?", ["concat()", "fill()", "keys()", "copy()"], 3), 
                 new Question("Which of the following expressions will return false?", ["[1] == [1]", "\"1\" == true", "\"\" == false", "[1] == \"1\""], 0),
                 new Question("What does the parseInt() function return if it's argument cannot be converted to a number?", ["undefined", "null", "NaN", "infinity"], 2),
                 new Question("Which of the following is the method for converting an object to a JSON string?", ["toString()", "parse()", "stringify()", "splice()"], 2),
                 new Question("True or False: In order to use the Math object we need to first create it.", ["True", "False"], 1),
                 new Question("What is the value of z, Given: var y = 3; var x = 9; z = x++ * ++y;", [30, 40, 27, 36], 0)];

var qIndex = 0;
var startingTime = 90;
var timeElapsed = 0;
var score = 0;
var promptDisplay = document.querySelector(".prompt-card");
var timeDisplay = document.querySelector("#time-left").textContent = startingTime - timeElapsed;
var interval;

document.addEventListener("click", function() {

    let targetId = event.target.id;
    console.log(targetId);
    let targetTagName = event.target.nodeName;

    if(targetTagName == "BUTTON"){
        if(targetId == "start"){

            interval = setInterval(startTimer, 1000);
        }
        else if(targetId == questions[qIndex].correctResponse){
            score++;
        }
        else{
            timeElapsed = timeElapsed + 10;
        }

        ++qIndex == questions.length || startingTime < timeElapsed ? renderReport() : renderNextQuestion();
    }
});

function renderNextQuestion(){
    //clear prompt
    promptDisplay.innerHTML = "";

    //Added next questions text
    var node = document.createElement("H3");
    console.log(questions[qIndex].questionText);
    var textNode = document.createTextNode(questions[qIndex].questionText);
    node.appendChild(textNode);
    promptDisplay.appendChild(node);

    //Add buttons for response with text
    for(i = 0; i < questions[qIndex].response.length; i++){
        let buttonNode = document.createElement("BUTTON");
        buttonNode.textContent = questions[qIndex].response[i];
        buttonNode.className += "btn btn-primary btn-lg";
        buttonNode.id = i;
        promptDisplay.appendChild(buttonNode);

    }
}

function renderReport(){
    promptDisplay.innerHTML = "";

}

function startTimer(){

    timeElapsed++;

    if(startingTime < timeElapsed || qIndex == questions.length) {
        startingTime = timeElapsed;
        renderReport();
        clearInterval(interval);
    }

    timeDisplay = document.querySelector("#time-left").textContent = startingTime - timeElapsed;
}

function shuffleQuestions(){
    for(i = 0; i < questions.length; i++){
        const j = Math.floor(Math.random() * i);
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;

        console.log(questions[i]);
    }
}

shuffleQuestions();

